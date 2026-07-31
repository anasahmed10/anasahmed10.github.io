"use client";

import {
  Billboard,
  Html,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import {
  Canvas,
  type ThreeEvent,
  type ThreeElements,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Briefcase,
  MapTrifold,
  Monitor,
  MouseSimple,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  Component,
  type ComponentProps,
  type MutableRefObject,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import {
  CAMPUS_DESTINATIONS as CAMPUS_ZONES,
  type CampusDestination as CampusZone,
} from "../data/portfolio";

type PositionRef = MutableRefObject<THREE.Vector3>;
type MoveTarget = { point: THREE.Vector3 } | null;

const START = new THREE.Vector3(0, 0, 4.6);
const WORLD_LIMIT = 15.5;
const STEPPED_FPS = 12;
const BUILDING_HALF_DEPTH = 2.65;
const BUILDING_COLLISION_PADDING = 0.7;
const BUILDING_TOUCH_RADIUS = 1.25;
const TREE_POSITIONS = [
  [-12, -8], [-11, 1], [-12, 10], [-5, 10], [4, 10], [12, 10],
  [12, 1], [12, -9], [5, -12], [-6, -12], [-3, 3], [3, 3],
] as const;
const TREE_CROWN_OFFSETS = [
  new THREE.Vector3(0, 1.85, 0),
  new THREE.Vector3(0.55, 1.55, 0.12),
  new THREE.Vector3(-0.48, 1.5, -0.08),
] as const;

type CampusRenderProfile = {
  mode: "desktop" | "mobile" | "reduced";
  dpr: [number, number];
  shadowMapSize: 512 | 1024;
};

const zoneById = Object.fromEntries(
  CAMPUS_ZONES.map((zone) => [zone.id, zone]),
) as Record<CampusZone["id"], CampusZone>;

function isTouchingBuilding(position: THREE.Vector3, zone: CampusZone) {
  const [x, , z] = zone.position;
  const outsideX = Math.max(Math.abs(position.x - x) - zone.width / 2, 0);
  const outsideZ = Math.max(Math.abs(position.z - z) - BUILDING_HALF_DEPTH, 0);
  return Math.hypot(outsideX, outsideZ) <= BUILDING_TOUCH_RADIUS;
}

function isInsideBuildingFootprint(
  position: THREE.Vector3,
  zone: CampusZone,
  padding = 0,
) {
  const [x, , z] = zone.position;
  return (
    Math.abs(position.x - x) < zone.width / 2 + padding &&
    Math.abs(position.z - z) < BUILDING_HALF_DEPTH + padding
  );
}

function isBlockedByBuilding(position: THREE.Vector3) {
  return CAMPUS_ZONES.some((zone) =>
    isInsideBuildingFootprint(
      position,
      zone,
      BUILDING_COLLISION_PADDING,
    ),
  );
}

function seedValue(seed: string) {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0) / 4294967295;
}

function deformClayGeometry(
  source: THREE.BufferGeometry,
  seed: string,
  amount: number,
  preserveBase = true,
) {
  const geometry = source.clone();
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  if (!bounds || !position || !normal) return geometry;

  const size = new THREE.Vector3();
  bounds.getSize(size);
  const displacementScale =
    Math.max(size.x, size.y, size.z) * amount * 0.2;
  const baseFadeHeight = Math.max(size.y * 0.12, 0.001);
  const seedPhase = seedValue(seed) * Math.PI * 8;

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const wave =
      Math.sin(x * 2.31 + y * 1.77 + seedPhase) * 0.48 +
      Math.cos(z * 2.63 - y * 1.19 + seedPhase * 0.71) * 0.34 +
      Math.sin((x + z) * 3.17 + seedPhase * 1.31) * 0.18;
    const baseFade = preserveBase
      ? THREE.MathUtils.smoothstep(y, bounds.min.y, bounds.min.y + baseFadeHeight)
      : 1;
    const displacement = wave * displacementScale * baseFade;
    position.setXYZ(
      index,
      x + normal.getX(index) * displacement,
      y + normal.getY(index) * displacement,
      z + normal.getZ(index) * displacement,
    );
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function takeSteppedDelta(
  accumulator: MutableRefObject<number>,
  delta: number,
  fps = STEPPED_FPS,
) {
  accumulator.current += delta;
  const interval = 1 / fps;
  if (accumulator.current < interval) return 0;
  const elapsed = accumulator.current;
  accumulator.current %= interval;
  return elapsed;
}

type ClayMaterialProps = {
  color: THREE.ColorRepresentation;
  roughness?: number;
  normalStrength?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  metalness?: number;
};

function ClayMaterial({
  color,
  roughness = 0.9,
  normalStrength = 0.16,
  emissive,
  emissiveIntensity,
  metalness = 0,
}: ClayMaterialProps) {
  const [normalMap, roughnessMap] = useTexture([
    "/textures/clay-normal.webp",
    "/textures/clay-roughness.webp",
  ]);
  const normalScale = useMemo(
    () => new THREE.Vector2(normalStrength * 1.1, normalStrength * 1.1),
    [normalStrength],
  );

  useEffect(() => {
    for (const texture of [normalMap, roughnessMap]) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2.5, 2.5);
      texture.colorSpace = THREE.NoColorSpace;
      texture.anisotropy = 2;
      texture.needsUpdate = true;
    }
  }, [normalMap, roughnessMap]);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      normalMap={normalMap}
      normalScale={normalScale}
      roughnessMap={roughnessMap}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      metalness={metalness}
    />
  );
}

type ClayRoundedBoxProps = ComponentProps<typeof RoundedBox> & {
  seed: string;
  deformation?: number;
};

function ClayRoundedBox({
  seed,
  deformation = 0.018,
  ...props
}: ClayRoundedBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const sourceGeometryRef = useRef<THREE.BufferGeometry | null>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    sourceGeometryRef.current ??= mesh.geometry;
    const source = sourceGeometryRef.current;
    const geometry = deformClayGeometry(source, seed, deformation);
    mesh.geometry = geometry;
    return () => {
      if (mesh.geometry === geometry) mesh.geometry = source;
      geometry.dispose();
    };
  }, [deformation, seed]);

  return <RoundedBox ref={meshRef} {...props} />;
}

type ClayMeshProps = ThreeElements["mesh"] & {
  seed: string;
  deformation?: number;
  preserveBase?: boolean;
};

function ClayMesh({
  seed,
  deformation = 0.01,
  preserveBase = false,
  ...props
}: ClayMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const sourceGeometryRef = useRef<THREE.BufferGeometry | null>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    sourceGeometryRef.current ??= mesh.geometry;
    const source = sourceGeometryRef.current;
    const geometry = deformClayGeometry(
      source,
      seed,
      deformation,
      preserveBase,
    );
    mesh.geometry = geometry;
    return () => {
      if (mesh.geometry === geometry) mesh.geometry = source;
      geometry.dispose();
    };
  }, [deformation, preserveBase, seed]);

  return <mesh ref={meshRef} {...props} />;
}

function TreeGrove({ reducedMotion }: { reducedMotion: boolean }) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const crownMainRef = useRef<THREE.InstancedMesh>(null);
  const crownRightRef = useRef<THREE.InstancedMesh>(null);
  const crownLeftRef = useRef<THREE.InstancedMesh>(null);
  const animationTimeRef = useRef(0);
  const stepAccumulatorRef = useRef(1 / STEPPED_FPS);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const treeEuler = useMemo(() => new THREE.Euler(), []);
  const treeQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const transformedOffset = useMemo(() => new THREE.Vector3(), []);
  const crownGeometries = useMemo(
    () => [
      deformClayGeometry(new THREE.SphereGeometry(0.9, 14, 12), "tree-main", 0.022, false),
      deformClayGeometry(new THREE.SphereGeometry(0.58, 12, 10), "tree-right", 0.026, false),
      deformClayGeometry(new THREE.SphereGeometry(0.52, 12, 10), "tree-left", 0.024, false),
    ],
    [],
  );

  const updateTrees = useCallback((time: number) => {
    const refs = [crownMainRef.current, crownRightRef.current, crownLeftRef.current];

    TREE_POSITIONS.forEach(([x, z], index) => {
      const scale = 0.8 + (index % 3) * 0.12;
      dummy.position.set(x, 0.75 * scale, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      trunkRef.current?.setMatrixAt(index, dummy.matrix);

      const phase = index * 0.57;
      treeEuler.set(
        reducedMotion ? 0 : Math.cos(time * 0.54 + phase) * 0.018,
        0,
        reducedMotion ? 0 : Math.sin(time * 0.72 + phase) * 0.035,
      );
      treeQuaternion.setFromEuler(treeEuler);
      TREE_CROWN_OFFSETS.forEach((offset, crownIndex) => {
        transformedOffset.copy(offset).multiplyScalar(scale).applyQuaternion(treeQuaternion);
        dummy.position.set(x + transformedOffset.x, transformedOffset.y, z + transformedOffset.z);
        dummy.quaternion.copy(treeQuaternion);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        refs[crownIndex]?.setMatrixAt(index, dummy.matrix);
      });
    });

    for (const ref of [trunkRef.current, ...refs]) {
      if (ref) ref.instanceMatrix.needsUpdate = true;
    }
  }, [dummy, reducedMotion, transformedOffset, treeEuler, treeQuaternion]);

  useLayoutEffect(() => {
    updateTrees(0);
  }, [updateTrees]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const steppedDelta = takeSteppedDelta(stepAccumulatorRef, delta);
    if (!steppedDelta) return;
    animationTimeRef.current += steppedDelta;
    updateTrees(animationTimeRef.current);
  });

  useEffect(
    () => () => crownGeometries.forEach((geometry) => geometry.dispose()),
    [crownGeometries],
  );

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 1.5, 10]} />
        <ClayMaterial color="#936948" roughness={0.95} normalStrength={0.14} />
      </instancedMesh>
      <instancedMesh ref={crownMainRef} args={[crownGeometries[0], undefined, TREE_POSITIONS.length]} castShadow>
        <ClayMaterial color="#55b884" roughness={0.92} normalStrength={0.2} />
      </instancedMesh>
      <instancedMesh ref={crownRightRef} args={[crownGeometries[1], undefined, TREE_POSITIONS.length]} castShadow>
        <ClayMaterial color="#71ca96" roughness={0.92} normalStrength={0.2} />
      </instancedMesh>
      <instancedMesh ref={crownLeftRef} args={[crownGeometries[2], undefined, TREE_POSITIONS.length]} castShadow>
        <ClayMaterial color="#64c38c" roughness={0.94} normalStrength={0.2} />
      </instancedMesh>
    </>
  );
}

function ClayCloud({
  cloudRef,
  position,
  scale,
}: {
  cloudRef: (node: THREE.Group | null) => void;
  position: [number, number, number];
  scale: number;
}) {
  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {[
        [-1.1, 0, 0, 0.85],
        [-0.35, 0.35, 0, 1.1],
        [0.55, 0.12, 0, 0.95],
        [1.2, -0.02, 0, 0.68],
      ].map(([x, y, z, size], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <sphereGeometry args={[size, 12, 10]} />
          <ClayMaterial color="#fff7e8" roughness={0.98} normalStrength={0.13} />
        </mesh>
      ))}
    </group>
  );
}

const FLOWER_PATCHES = [
  [-4.4, -2.6, "#ff6f61"],
  [4.8, 2.8, "#ffbf3f"],
  [-2.2, 5.1, "#9b6ce0"],
  [3.3, -5.2, "#ffffff"],
] as const;

function FlowerPatches() {
  const refs = useRef<Array<THREE.InstancedMesh | null>>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(
    () => deformClayGeometry(new THREE.SphereGeometry(0.13, 8, 6), "flower", 0.03, false),
    [],
  );

  useLayoutEffect(() => {
    FLOWER_PATCHES.forEach(([x, z], patchIndex) => {
      const mesh = refs.current[patchIndex];
      if (!mesh) return;
      [-0.35, 0, 0.35].forEach((offset, flowerIndex) => {
        dummy.position.set(
          x + offset,
          0.12 + (flowerIndex % 2 ? 0.12 : 0),
          z + Math.sin(patchIndex + flowerIndex) * 0.25,
        );
        dummy.rotation.set(
          (flowerIndex - 1) * 0.08,
          patchIndex * 0.23,
          (patchIndex - 1.5) * 0.04,
        );
        dummy.scale.setScalar(0.96 + flowerIndex * 0.04);
        dummy.updateMatrix();
        mesh.setMatrixAt(flowerIndex, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [dummy]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return FLOWER_PATCHES.map(([, , color], patchIndex) => (
    <instancedMesh
      key={color}
      ref={(node) => {
        refs.current[patchIndex] = node;
      }}
      args={[geometry, undefined, 3]}
      castShadow
    >
      <ClayMaterial color={color} roughness={0.95} normalStrength={0.11} />
    </instancedMesh>
  ));
}

function LivingEnvironment({ reducedMotion }: { reducedMotion: boolean }) {
  const cloudRefs = useRef<Array<THREE.Group | null>>([]);
  const fountainRef = useRef<THREE.Group>(null);
  const animationTimeRef = useRef(0);
  const stepAccumulatorRef = useRef(1 / STEPPED_FPS);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const steppedDelta = takeSteppedDelta(stepAccumulatorRef, delta);
    if (!steppedDelta) return;
    animationTimeRef.current += steppedDelta;
    cloudRefs.current.forEach((cloud, index) => {
      if (!cloud) return;
      cloud.position.x += steppedDelta * (0.18 + index * 0.035);
      if (cloud.position.x > 22) cloud.position.x = -22;
      cloud.position.y +=
        Math.sin(animationTimeRef.current * 0.35 + index) * 0.0009;
    });
    if (fountainRef.current) {
      fountainRef.current.rotation.y += steppedDelta * 0.28;
      fountainRef.current.position.y =
        1.28 + Math.sin(animationTimeRef.current * 2) * 0.08;
    }
  });

  return (
    <>
      <ClayCloud
        cloudRef={(node) => { cloudRefs.current[0] = node; }}
        position={[-13, 11, -16]}
        scale={1.15}
      />
      <ClayCloud
        cloudRef={(node) => { cloudRefs.current[1] = node; }}
        position={[4, 13, -19]}
        scale={0.78}
      />
      <ClayCloud
        cloudRef={(node) => { cloudRefs.current[2] = node; }}
        position={[15, 10.5, -14]}
        scale={1.02}
      />

      <group position={[0, 0, 0]}>
        <ClayMesh seed="fountain-base" deformation={0.015} castShadow receiveShadow position={[0, 0.42, 0]}>
          <cylinderGeometry args={[1.28, 1.48, 0.82, 28]} />
          <ClayMaterial color="#fff0d2" roughness={0.9} normalStrength={0.14} />
        </ClayMesh>
        <mesh position={[0, 0.86, 0]}>
          <cylinderGeometry args={[0.92, 1.08, 0.22, 28]} />
          <meshStandardMaterial color="#71c7dd" roughness={0.35} />
        </mesh>
        <group ref={fountainRef} position={[0, 1.28, 0]}>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.44, 0, Math.sin(angle) * 0.44]}
            >
              <sphereGeometry args={[0.16, 10, 8]} />
              <meshStandardMaterial
                color="#d9f8ff"
                transparent
                opacity={0.78}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      <FlowerPatches />
    </>
  );
}

function Building({
  zone,
  onSelect,
}: {
  zone: CampusZone;
  onSelect: (zone: CampusZone) => void;
}) {
  const [x, , z] = zone.position;
  const [hovered, setHovered] = useState(false);
  const roofColor = new THREE.Color(zone.color).offsetHSL(0, 0.03, 0.12);
  const glass = (
    <meshStandardMaterial
      color="#d9f5ff"
      emissive="#8fd9ff"
      emissiveIntensity={0.15}
      metalness={0.06}
      roughness={0.32}
    />
  );
  const door = (
    <group position={[0, 0, 2.18]}>
      <RoundedBox
        args={[1.35, 2.2, 0.38]}
        radius={0.48}
        smoothness={5}
        position={[0, 1.1, 0]}
        castShadow
      >
        <meshStandardMaterial color="#fff4df" roughness={0.76} />
      </RoundedBox>
      <RoundedBox
        args={[0.83, 1.72, 0.15]}
        radius={0.28}
        smoothness={5}
        position={[0, 1.02, 0.23]}
      >
        <meshStandardMaterial color="#40536b" roughness={0.5} />
      </RoundedBox>
    </group>
  );

  const buildingShape = (() => {
    if (zone.visual === "repair-workshop") {
      return (
        <>
          <ClayRoundedBox seed="repair-shell" deformation={0.021} args={[4.8, 3.35, 4.1]} radius={0.72} smoothness={5} position={[0, 1.68, 0]} rotation={[0.008, -0.006, -0.012]} castShadow receiveShadow>
            <ClayMaterial color={zone.color} roughness={0.9} normalStrength={0.19} />
          </ClayRoundedBox>
          <ClayRoundedBox seed="repair-roof" deformation={0.017} args={[5.05, 0.54, 4.32]} radius={0.24} smoothness={4} position={[0.02, 3.45, 0]} rotation={[0, 0.006, -0.035]} castShadow>
            <ClayMaterial color="#fff0d2" roughness={0.92} normalStrength={0.16} />
          </ClayRoundedBox>
          {door}
          <group position={[-1.35, 2.35, 2.2]} rotation={[0, 0, -0.05]}>
            <RoundedBox args={[1.25, 0.92, 0.22]} radius={0.18} smoothness={4}>
              <meshStandardMaterial color="#40536b" roughness={0.72} />
            </RoundedBox>
            <RoundedBox args={[0.92, 0.6, 0.08]} radius={0.12} smoothness={4} position={[0, 0, 0.15]}>
              <meshStandardMaterial color="#9fd8ff" emissive="#4e8fc3" emissiveIntensity={0.15} roughness={0.35} />
            </RoundedBox>
            <mesh position={[0, -0.78, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.72, 10]} />
              <meshStandardMaterial color="#40536b" roughness={0.8} />
            </mesh>
          </group>
          <group position={[0, 4.22, 0]}>
            <mesh position={[-0.36, 0.18, 0]} rotation={[0, 0, -0.52]} castShadow>
              <torusGeometry args={[0.55, 0.1, 9, 22, Math.PI * 1.35]} />
              <meshStandardMaterial color="#7b513b" roughness={0.95} />
            </mesh>
            <mesh position={[0.36, 0.18, 0]} rotation={[0, Math.PI, 0.52]} castShadow>
              <torusGeometry args={[0.55, 0.1, 9, 22, Math.PI * 1.35]} />
              <meshStandardMaterial color="#7b513b" roughness={0.95} />
            </mesh>
          </group>
        </>
      );
    }

    if (zone.visual === "copy-building") {
      return (
        <>
          <ClayRoundedBox seed="copy-shell" deformation={0.019} args={[5.65, 4.7, 4.8]} radius={0.85} smoothness={6} position={[0, 2.35, 0]} rotation={[-0.006, 0.008, 0.012]} castShadow receiveShadow>
            <ClayMaterial color={zone.color} roughness={0.88} normalStrength={0.19} />
          </ClayRoundedBox>
          <ClayRoundedBox seed="copy-roof" deformation={0.016} args={[4.1, 0.46, 3.2]} radius={0.3} smoothness={4} position={[0, 4.76, -0.25]} rotation={[0.03, 0.008, -0.025]}>
            <ClayMaterial color="#244b9e" roughness={0.78} normalStrength={0.15} />
          </ClayRoundedBox>
          <RoundedBox args={[3.8, 0.42, 0.28]} radius={0.18} smoothness={4} position={[0, 3.18, 2.5]}>
            <meshStandardMaterial color="#25334a" roughness={0.76} />
          </RoundedBox>
          <RoundedBox args={[3.35, 1.15, 0.16]} radius={0.2} smoothness={4} position={[0, 2.45, 2.62]} rotation={[0, 0, 0.025]}>
            <meshStandardMaterial color="#fffdf5" roughness={0.98} />
          </RoundedBox>
          <group position={[-1.75, 1.1, 2.5]} rotation={[0, 0, -0.08]}>
            <RoundedBox args={[1.05, 1.35, 0.3]} radius={0.2} smoothness={4}>
              <meshStandardMaterial color="#40536b" roughness={0.72} />
            </RoundedBox>
            <RoundedBox args={[0.73, 0.66, 0.08]} radius={0.12} smoothness={4} position={[0, 0.18, 0.2]}>
              {glass}
            </RoundedBox>
            <mesh position={[0, -0.38, 0.22]}>
              <circleGeometry args={[0.08, 12]} />
              <meshStandardMaterial color="#42b883" emissive="#42b883" emissiveIntensity={0.35} />
            </mesh>
          </group>
          <group position={[2.25, 1.35, 2.62]} rotation={[0, 0, 0.08]}>
            <RoundedBox args={[0.76, 1.55, 0.34]} radius={0.22} smoothness={4}>
              <meshStandardMaterial color="#fff0d2" roughness={0.86} />
            </RoundedBox>
            <RoundedBox args={[0.52, 0.58, 0.08]} radius={0.1} smoothness={4} position={[0, 0.3, 0.22]}>
              <meshStandardMaterial color="#25334a" roughness={0.52} />
            </RoundedBox>
          </group>
        </>
      );
    }

    if (zone.visual === "vehicle-garage") {
      return (
        <>
          <ClayRoundedBox seed="vehicle-shell" deformation={0.02} args={[6.1, 3.45, 3.9]} radius={0.85} smoothness={6} position={[0, 1.72, -0.5]} rotation={[0.004, -0.009, -0.008]} castShadow receiveShadow>
            <ClayMaterial color={zone.color} roughness={0.88} normalStrength={0.2} />
          </ClayRoundedBox>
          <ClayRoundedBox seed="vehicle-frame" deformation={0.014} args={[4.8, 2.35, 0.22]} radius={0.48} smoothness={5} position={[0, 1.55, 1.52]}>
            <ClayMaterial color="#fff4df" roughness={0.88} normalStrength={0.14} />
          </ClayRoundedBox>
          <RoundedBox args={[4.25, 1.82, 0.12]} radius={0.36} smoothness={5} position={[0, 1.48, 1.68]}>
            <meshStandardMaterial color="#40536b" roughness={0.56} />
          </RoundedBox>
          <group position={[0, 0.72, 2.15]} rotation={[0, -0.03, 0]}>
            <ClayRoundedBox seed="vehicle-car-body" deformation={0.014} args={[3.65, 0.95, 1.82]} radius={0.45} smoothness={6} rotation={[0, 0.008, -0.01]} castShadow>
              <ClayMaterial color="#ff6f61" roughness={0.86} normalStrength={0.14} />
            </ClayRoundedBox>
            <ClayRoundedBox seed="vehicle-car-cabin" deformation={0.012} args={[1.95, 0.84, 1.45]} radius={0.38} smoothness={6} position={[-0.15, 0.68, -0.12]} rotation={[0.008, -0.012, 0.008]} castShadow>
              <ClayMaterial color="#ff8d80" roughness={0.86} normalStrength={0.13} />
            </ClayRoundedBox>
            <RoundedBox args={[1.42, 0.48, 1.48]} radius={0.2} smoothness={4} position={[-0.12, 0.74, 0]}>
              {glass}
            </RoundedBox>
            {[-1.18, 1.18].map((wheelX) => (
              <mesh key={wheelX} position={[wheelX, -0.33, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.43, 0.43, 0.34, 16]} />
                <meshStandardMaterial color="#25334a" roughness={0.9} />
              </mesh>
            ))}
            <mesh position={[0.55, 0.12, 0.94]}>
              <sphereGeometry args={[0.13, 10, 8]} />
              <meshStandardMaterial color="#fff4df" emissive="#ffbf3f" emissiveIntensity={0.25} />
            </mesh>
          </group>
        </>
      );
    }

    if (zone.visual === "scanner-depot") {
      return (
        <>
          <ClayRoundedBox seed="scanner-shell" deformation={0.019} args={[5.35, 3.4, 4.25]} radius={0.55} smoothness={5} position={[0, 1.7, 0]} rotation={[-0.006, 0.01, 0.008]} castShadow receiveShadow>
            <ClayMaterial color={zone.color} roughness={0.88} normalStrength={0.19} />
          </ClayRoundedBox>
          <ClayRoundedBox seed="scanner-opening" deformation={0.014} args={[3.9, 2.42, 0.22]} radius={0.32} smoothness={4} position={[0, 1.55, 2.22]} rotation={[0, 0, -0.008]}>
            <ClayMaterial color="#fff4df" roughness={0.9} normalStrength={0.14} />
          </ClayRoundedBox>
          <group position={[0, 1.4, 2.42]}>
            {[-1.55, 1.55].map((postX) => (
              <RoundedBox key={postX} args={[0.42, 2.8, 0.42]} radius={0.15} smoothness={4} position={[postX, 0, 0]}>
                <meshStandardMaterial color="#25334a" roughness={0.78} />
              </RoundedBox>
            ))}
            <RoundedBox args={[3.5, 0.42, 0.42]} radius={0.15} smoothness={4} position={[0, 1.18, 0]}>
              <meshStandardMaterial color="#25334a" roughness={0.78} />
            </RoundedBox>
            <mesh position={[0, 0.5, 0.04]}>
              <boxGeometry args={[2.7, 0.05, 0.05]} />
              <meshBasicMaterial color="#ff6f61" transparent opacity={0.76} />
            </mesh>
          </group>
          <group position={[1.85, 2.25, 2.38]} rotation={[0, 0, 0.08]}>
            <RoundedBox args={[0.86, 1.18, 0.24]} radius={0.18} smoothness={4}>
              <meshStandardMaterial color="#40536b" roughness={0.72} />
            </RoundedBox>
            <RoundedBox args={[0.62, 0.76, 0.08]} radius={0.12} smoothness={4} position={[0, 0.08, 0.17]}>
              {glass}
            </RoundedBox>
          </group>
          <RoundedBox args={[3.2, 0.36, 1.18]} radius={0.16} smoothness={4} position={[0, 0.28, 2.55]}>
            <meshStandardMaterial color="#ffbf3f" roughness={0.88} />
          </RoundedBox>
        </>
      );
    }

    if (zone.visual === "receipt-cafe") {
      return (
        <>
          <ClayRoundedBox seed="receipt-shell" deformation={0.022} args={[5.35, 3.5, 4.45]} radius={1.05} smoothness={6} position={[0, 1.75, 0]} rotation={[0.006, -0.008, 0.01]} castShadow receiveShadow>
            <ClayMaterial color={zone.color} roughness={0.9} normalStrength={0.2} />
          </ClayRoundedBox>
          <mesh position={[0, 4.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 3.25, 24]} />
            <meshStandardMaterial color="#fffdf5" roughness={0.94} />
          </mesh>
          <RoundedBox args={[2.85, 2.1, 0.18]} radius={0.16} smoothness={4} position={[0, 3.12, 2.28]} rotation={[0, 0, -0.025]}>
            <meshStandardMaterial color="#fffdf5" roughness={0.98} />
          </RoundedBox>
          {[2.52, 2.2, 1.88].map((lineY, index) => (
            <RoundedBox key={lineY} args={[index === 0 ? 1.85 : 1.35, 0.08, 0.04]} radius={0.03} position={[0, lineY, 2.4]}>
              <meshStandardMaterial color={index === 0 ? "#25334a" : "#9b8d77"} roughness={0.85} />
            </RoundedBox>
          ))}
          {[-1.35, 1.35].map((tableX) => (
            <group key={tableX} position={[tableX, 0.62, 2.52]}>
              <mesh>
                <cylinderGeometry args={[0.62, 0.68, 0.18, 18]} />
                <meshStandardMaterial color="#fff0d2" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.44, 0]}>
                <cylinderGeometry args={[0.11, 0.14, 0.8, 10]} />
                <meshStandardMaterial color="#40536b" roughness={0.82} />
              </mesh>
            </group>
          ))}
          {door}
        </>
      );
    }

    return (
      <>
        <ClayRoundedBox seed="maker-base" deformation={0.018} args={[5.1, 0.42, 4.15]} radius={0.18} smoothness={4} position={[0, 0.23, 0]} rotation={[0, 0.006, -0.006]} receiveShadow>
          <ClayMaterial color="#fff0d2" roughness={0.92} normalStrength={0.17} />
        </ClayRoundedBox>
        {[-2.05, 2.05].flatMap((postX) =>
          [-1.55, 1.55].map((postZ) => (
            <ClayRoundedBox seed={`maker-post-${postX}-${postZ}`} deformation={0.015} key={`${postX}-${postZ}`} args={[0.34, 3.7, 0.34]} radius={0.12} smoothness={4} position={[postX, 2.05, postZ]} rotation={[postZ * 0.003, 0, postX * 0.004]} castShadow>
              <ClayMaterial color={zone.color} roughness={0.9} normalStrength={0.18} />
            </ClayRoundedBox>
          )),
        )}
        <ClayRoundedBox seed="maker-front-bar" deformation={0.015} args={[4.55, 0.38, 0.42]} radius={0.12} smoothness={4} position={[0, 3.84, 1.55]} rotation={[0.006, 0, -0.012]} castShadow>
          <ClayMaterial color={roofColor} roughness={0.88} normalStrength={0.18} />
        </ClayRoundedBox>
        <ClayRoundedBox seed="maker-back-bar" deformation={0.015} args={[4.55, 0.38, 0.42]} radius={0.12} smoothness={4} position={[0, 3.84, -1.55]} rotation={[-0.006, 0, 0.01]} castShadow>
          <ClayMaterial color={roofColor} roughness={0.88} normalStrength={0.18} />
        </ClayRoundedBox>
        <RoundedBox args={[0.74, 0.7, 0.68]} radius={0.16} smoothness={4} position={[0, 3.22, 0.45]} castShadow>
          <meshStandardMaterial color="#40536b" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 2.65, 0.45]}>
          <coneGeometry args={[0.16, 0.7, 10]} />
          <meshStandardMaterial color="#ff6f61" roughness={0.9} />
        </mesh>
        {[[-1.2, 0.48, 0.3], [-0.35, 0.72, -0.25], [0.55, 0.98, 0.22], [1.35, 1.24, -0.12]].map(
          ([blockX, blockY, blockZ], index) => (
            <RoundedBox key={index} args={[0.7, Number(blockY), 0.78]} radius={0.12} smoothness={4} position={[Number(blockX), Number(blockY) / 2 + 0.44, Number(blockZ)]} castShadow>
              <meshStandardMaterial color={index % 2 ? "#42b883" : "#ffbf3f"} roughness={0.92} />
            </RoundedBox>
          ),
        )}
        <group position={[1.75, 3.05, 0.35]} rotation={[Math.PI / 2 + 0.04, 0.02, -0.03]}>
          <mesh>
            <torusGeometry args={[0.46, 0.12, 10, 22]} />
            <ClayMaterial color="#fffdf5" roughness={0.92} normalStrength={0.12} />
          </mesh>
        </group>
      </>
    );
  })();

  return (
    <group
      position={[x, 0, z]}
      scale={hovered ? 1.035 : 1}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(zone);
      }}
    >
      {buildingShape}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
        scale={[1.15, 0.72, 1]}
      >
        <circleGeometry args={[zone.width / 2 + 0.18, 28]} />
        <meshBasicMaterial color="#49372d" transparent opacity={0.075} depthWrite={false} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[zone.width / 2 + 0.15, zone.width / 2 + (hovered ? 0.34 : 0.24), 36]} />
        <meshBasicMaterial color={zone.color} transparent opacity={hovered ? 0.58 : 0.18} />
      </mesh>
      <Billboard position={[0, zone.height + 0.45, 0]} follow>
        <Html center zIndexRange={[15, 5]} style={{ pointerEvents: "auto" }}>
          <button
            className="scene-label"
            aria-label={zone.accessibleName}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(zone);
            }}
          >
            <span style={{ background: zone.color }} />
            {zone.sceneLabel}
          </button>
        </Html>
      </Billboard>
    </group>
  );
}

function Explorer({
  positionRef,
  targetRef,
  paused,
  reducedMotion,
  onNearby,
}: {
  positionRef: PositionRef;
  targetRef: MutableRefObject<MoveTarget>;
  paused: boolean;
  reducedMotion: boolean;
  onNearby: (id: CampusZone["id"] | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const keys = useRef(new Set<string>());
  const previousNearby = useRef<CampusZone["id"] | null>(null);
  const poseTimeRef = useRef(0);
  const poseAccumulatorRef = useRef(1 / STEPPED_FPS);
  const movementRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());
  const desiredCameraRef = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
        keys.current.add(event.key.toLowerCase());
      }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const position = positionRef.current;
    const movement = movementRef.current.set(0, 0, 0);
    if (!paused) {
      if (keys.current.has("w") || keys.current.has("arrowup")) movement.z -= 1;
      if (keys.current.has("s") || keys.current.has("arrowdown")) movement.z += 1;
      if (keys.current.has("a") || keys.current.has("arrowleft")) movement.x -= 1;
      if (keys.current.has("d") || keys.current.has("arrowright")) movement.x += 1;

      if (movement.lengthSq() > 0) {
        targetRef.current = null;
        movement.normalize().multiplyScalar(delta * 5.2);
      } else if (targetRef.current) {
        movement.copy(targetRef.current.point).sub(position);
        if (movement.length() < 0.35) {
          targetRef.current = null;
          movement.set(0, 0, 0);
        } else {
          movement.normalize().multiplyScalar(delta * 4.6);
        }
      }

      if (movement.lengthSq() > 0) {
        const next = nextPositionRef.current.copy(position).add(movement);
        next.x = THREE.MathUtils.clamp(next.x, -WORLD_LIMIT, WORLD_LIMIT);
        next.z = THREE.MathUtils.clamp(next.z, -WORLD_LIMIT, WORLD_LIMIT);
        if (!isBlockedByBuilding(next)) {
          position.copy(next);
        } else {
          let movedAlongEdge = false;

          if (Math.abs(movement.x) > 0.0001) {
            next.copy(position);
            next.x = THREE.MathUtils.clamp(
              position.x + movement.x,
              -WORLD_LIMIT,
              WORLD_LIMIT,
            );
            if (!isBlockedByBuilding(next)) {
              position.copy(next);
              movedAlongEdge = true;
            }
          }

          if (!movedAlongEdge && Math.abs(movement.z) > 0.0001) {
            next.copy(position);
            next.z = THREE.MathUtils.clamp(
              position.z + movement.z,
              -WORLD_LIMIT,
              WORLD_LIMIT,
            );
            if (!isBlockedByBuilding(next)) {
              position.copy(next);
              movedAlongEdge = true;
            }
          }

          if (!movedAlongEdge) {
            targetRef.current = null;
            movement.set(0, 0, 0);
          }
        }
        group.current.rotation.y = Math.atan2(movement.x, movement.z);
      }
    }

    const isMoving = movement.lengthSq() > 0.00001;
    group.current.position.x = position.x;
    group.current.position.z = position.z;

    const steppedDelta = reducedMotion
      ? 0
      : takeSteppedDelta(poseAccumulatorRef, delta);
    if (reducedMotion || steppedDelta) {
      if (steppedDelta) poseTimeRef.current += steppedDelta;
      const poseTime = poseTimeRef.current;
      const walkCycle = Math.sin(poseTime * 10);
      const idleCycle = Math.sin(poseTime * 1.7);
      group.current.position.y = reducedMotion
        ? 0
        : isMoving
          ? Math.abs(walkCycle) * 0.08
          : idleCycle * 0.018;

      if (characterRef.current) {
        const targetScaleY = reducedMotion
          ? 1
          : isMoving
            ? 1 + Math.abs(walkCycle) * 0.028
            : 1 + idleCycle * 0.012;
        characterRef.current.scale.y = THREE.MathUtils.lerp(
          characterRef.current.scale.y,
          targetScaleY,
          reducedMotion ? 1 : 0.42,
        );
        characterRef.current.rotation.z = reducedMotion
          ? 0
          : isMoving
            ? 0
            : Math.sin(poseTime * 0.8) * 0.018;
      }
      if (leftArmRef.current && rightArmRef.current && leftLegRef.current && rightLegRef.current) {
        const limbSwing = reducedMotion || !isMoving ? 0 : walkCycle * 0.62;
        leftArmRef.current.rotation.x = limbSwing;
        rightArmRef.current.rotation.x = -limbSwing;
        leftLegRef.current.rotation.x = -limbSwing * 0.72;
        rightLegRef.current.rotation.x = limbSwing * 0.72;
      }
      if (headRef.current) {
        headRef.current.rotation.y =
          reducedMotion || isMoving ? 0 : Math.sin(poseTime * 0.72) * 0.16;
        headRef.current.rotation.z =
          reducedMotion || isMoving ? 0 : Math.sin(poseTime * 0.5) * 0.035;
      }
      if (eyesRef.current) {
        const blink =
          !reducedMotion && Math.sin(poseTime * 0.83) > 0.992 ? 0.12 : 1;
        eyesRef.current.scale.y = blink;
      }
    }

    const nearest = CAMPUS_ZONES.find((zone) => isTouchingBuilding(position, zone))?.id ?? null;
    if (nearest !== previousNearby.current) {
      previousNearby.current = nearest;
      onNearby(nearest);
    }

    const desiredCamera = desiredCameraRef.current.set(
      position.x + 10.5,
      12.8,
      position.z + 14,
    );
    camera.position.lerp(desiredCamera, reducedMotion ? 0.18 : 0.075);
    camera.lookAt(position.x, 1.1, position.z - 1.2);
  });

  return (
    <group ref={group}>
      <group ref={characterRef}>
        <ClayMesh seed="explorer-torso" deformation={0.012} castShadow position={[0, 1.37, -0.08]} rotation={[0.006, 0, -0.008]} scale={[1.04, 1.03, 1.02]}>
          <capsuleGeometry args={[0.42, 0.78, 8, 14]} />
          <ClayMaterial color="#2f66d0" roughness={0.9} normalStrength={0.15} />
        </ClayMesh>
        <mesh position={[0, 1.55, 0.345]}>
          <circleGeometry args={[0.075, 12]} />
          <meshStandardMaterial color="#ffbf3f" roughness={0.8} />
        </mesh>
        <ClayMesh seed="explorer-neck" deformation={0.01} castShadow position={[0, 2.08, 0]} rotation={[0, 0.02, 0.01]}>
          <cylinderGeometry args={[0.25, 0.29, 0.18, 16]} />
          <ClayMaterial color="#fff3de" roughness={0.92} normalStrength={0.12} />
        </ClayMesh>
        <group ref={headRef} position={[0, 2.46, 0]}>
          <ClayMesh seed="explorer-head" deformation={0.011} castShadow scale={[1.1, 1.075, 1.08]}>
            <sphereGeometry args={[0.4, 18, 14]} />
            <ClayMaterial color="#cf916b" roughness={0.93} normalStrength={0.12} />
          </ClayMesh>
          <ClayMesh seed="explorer-hair-cap" deformation={0.012} castShadow position={[0, 0.24, -0.025]} rotation={[0.012, 0, -0.018]} scale={[1.08, 1.03, 1.08]}>
            <sphereGeometry args={[0.405, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <ClayMaterial color="#211f20" roughness={0.92} normalStrength={0.13} />
          </ClayMesh>
          <ClayMesh seed="explorer-hair-lock" deformation={0.014} castShadow position={[-0.2, 0.22, 0.2]} scale={[0.55, 0.32, 0.48]} rotation={[0.1, 0, -0.28]}>
            <sphereGeometry args={[0.35, 12, 9]} />
            <ClayMaterial color="#211f20" roughness={0.92} normalStrength={0.13} />
          </ClayMesh>
          <ClayMesh seed="explorer-hair-lock-right" deformation={0.014} castShadow position={[0.2, 0.22, 0.2]} scale={[0.55, 0.32, 0.48]} rotation={[0.1, 0, 0.28]}>
            <sphereGeometry args={[0.35, 12, 9]} />
            <ClayMaterial color="#211f20" roughness={0.92} normalStrength={0.13} />
          </ClayMesh>
          <group ref={eyesRef}>
            {[-0.13, 0.13].map((eyeX) => (
              <mesh key={eyeX} position={[eyeX, 0.035, 0.374]}>
                <sphereGeometry args={[0.042, 10, 8]} />
                <meshStandardMaterial color="#211f20" roughness={0.62} />
              </mesh>
            ))}
          </group>
          <ClayMesh seed="explorer-nose" deformation={0.008} position={[0, -0.02, 0.39]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <ClayMaterial color="#c7835e" roughness={0.92} normalStrength={0.08} />
          </ClayMesh>
          <mesh position={[0, -0.15, 0.395]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.075, 0.018, 6, 10, Math.PI]} />
            <meshStandardMaterial color="#7b493d" roughness={0.82} />
          </mesh>
          <mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.055, 8, 16]} />
            <meshStandardMaterial color="#fff3de" roughness={0.92} />
          </mesh>
        </group>

        <group ref={leftArmRef} position={[-0.47, 1.68, 0]}>
          <ClayMesh seed="explorer-left-arm" deformation={0.01} castShadow position={[0, -0.38, 0]} rotation={[0, 0, 0.025]}>
            <capsuleGeometry args={[0.12, 0.48, 6, 10]} />
            <ClayMaterial color="#fff3de" roughness={0.92} normalStrength={0.11} />
          </ClayMesh>
          <ClayMesh seed="explorer-left-hand" deformation={0.009} castShadow position={[0.01, -0.7, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <ClayMaterial color="#cf916b" roughness={0.93} normalStrength={0.1} />
          </ClayMesh>
        </group>
        <group ref={rightArmRef} position={[0.47, 1.68, 0]}>
          <ClayMesh seed="explorer-right-arm" deformation={0.01} castShadow position={[0, -0.38, 0]} rotation={[0, 0, -0.022]}>
            <capsuleGeometry args={[0.12, 0.48, 6, 10]} />
            <ClayMaterial color="#fff3de" roughness={0.92} normalStrength={0.11} />
          </ClayMesh>
          <ClayMesh seed="explorer-right-hand" deformation={0.009} castShadow position={[-0.01, -0.7, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <ClayMaterial color="#cf916b" roughness={0.93} normalStrength={0.1} />
          </ClayMesh>
        </group>
        <group ref={leftLegRef} position={[-0.2, 0.9, 0]}>
          <ClayMesh seed="explorer-left-leg" deformation={0.01} castShadow position={[0, -0.42, 0]} rotation={[0, 0, 0.018]}>
            <capsuleGeometry args={[0.14, 0.54, 6, 10]} />
            <ClayMaterial color="#2c292b" roughness={0.9} normalStrength={0.12} />
          </ClayMesh>
          <ClayRoundedBox seed="explorer-left-shoe" deformation={0.009} args={[0.34, 0.22, 0.48]} radius={0.11} smoothness={4} position={[0, -0.77, 0.1]} castShadow>
            <ClayMaterial color="#211f20" roughness={0.9} normalStrength={0.1} />
          </ClayRoundedBox>
        </group>
        <group ref={rightLegRef} position={[0.2, 0.9, 0]}>
          <ClayMesh seed="explorer-right-leg" deformation={0.01} castShadow position={[0, -0.42, 0]} rotation={[0, 0, -0.02]}>
            <capsuleGeometry args={[0.14, 0.54, 6, 10]} />
            <ClayMaterial color="#2c292b" roughness={0.9} normalStrength={0.12} />
          </ClayMesh>
          <ClayRoundedBox seed="explorer-right-shoe" deformation={0.009} args={[0.34, 0.22, 0.48]} radius={0.11} smoothness={4} position={[0, -0.77, 0.1]} castShadow>
            <ClayMaterial color="#211f20" roughness={0.9} normalStrength={0.1} />
          </ClayRoundedBox>
        </group>
      </group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.92, 24]} />
        <meshBasicMaterial color="#503d32" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function CampusScene({
  moveTarget,
  positionRef,
  paused,
  reducedMotion,
  renderProfile,
  onNavigate,
  onGroundNavigate,
  onNearby,
}: {
  moveTarget: MutableRefObject<MoveTarget>;
  positionRef: PositionRef;
  paused: boolean;
  reducedMotion: boolean;
  renderProfile: CampusRenderProfile;
  onNavigate: (zone: CampusZone) => void;
  onGroundNavigate: (point: THREE.Vector3) => void;
  onNearby: (id: CampusZone["id"] | null) => void;
}) {
  const handleGroundClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onGroundNavigate(
        new THREE.Vector3(event.point.x, 0, event.point.z),
      );
    },
    [onGroundNavigate],
  );

  return (
    <>
      <color attach="background" args={["#9fd8ff"]} />
      <fog attach="fog" args={["#b9e4ff", 24, 46]} />
      <ambientLight intensity={0.2} />
      <hemisphereLight args={["#fff0d4", "#607d61", 0.72]} />
      <directionalLight
        castShadow
        color="#ffd8ad"
        position={[10, 18, 7]}
        intensity={2.38}
        shadow-mapSize-width={renderProfile.shadowMapSize}
        shadow-mapSize-height={renderProfile.shadowMapSize}
        shadow-camera-far={48}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.00045}
        shadow-normalBias={0.025}
      />
      <directionalLight
        color="#b9d9ff"
        position={[-12, 9, -10]}
        intensity={0.42}
      />
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        onClick={handleGroundClick}
      >
        <circleGeometry args={[21, 64]} />
        <ClayMaterial color="#bdd68f" roughness={0.98} normalStrength={0.09} />
      </mesh>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
        onClick={handleGroundClick}
      >
        <ringGeometry args={[7.6, 9.1, 64]} />
        <ClayMaterial color="#f0dfc4" roughness={0.96} normalStrength={0.08} />
      </mesh>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={handleGroundClick}
      >
        <circleGeometry args={[4.4, 48]} />
        <ClayMaterial color="#e5c36f" roughness={0.96} normalStrength={0.08} />
      </mesh>
      {CAMPUS_ZONES.map((zone) => (
        <Building key={zone.id} zone={zone} onSelect={onNavigate} />
      ))}
      <TreeGrove reducedMotion={reducedMotion} />
      <LivingEnvironment reducedMotion={reducedMotion} />
      <Explorer
        positionRef={positionRef}
        targetRef={moveTarget}
        paused={paused}
        reducedMotion={reducedMotion}
        onNearby={onNearby}
      />
    </>
  );
}

function OverlayShell({
  titleId,
  onClose,
  children,
}: {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.setTimeout(() => returnFocusRef.current?.focus(), 0);
    };
  }, [onClose]);
  return (
    <div className="clay-overlay-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        ref={panelRef}
        className="clay-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button className="overlay-close" onClick={onClose} aria-label="Close panel">
          <X size={22} weight="bold" />
        </button>
        {children}
      </section>
    </div>
  );
}

class CampusCanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ClayCampus() {
  const [enteredCampus, setEnteredCampus] = useState(false);
  const [activeZone, setActiveZone] = useState<CampusZone | null>(null);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [accessibleView, setAccessibleView] = useState(false);
  const [nearby, setNearby] = useState<CampusZone["id"] | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactRendering, setCompactRendering] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const positionRef = useRef(START.clone());
  const moveTarget = useRef<MoveTarget>(null);
  const showAccessible = accessibleView || !webglAvailable;
  const paused = Boolean(!enteredCampus || activeZone || recruiterOpen || showAccessible);
  const renderProfile = useMemo<CampusRenderProfile>(() => {
    if (reducedMotion) {
      return { mode: "reduced", dpr: [1, 1.15], shadowMapSize: 512 };
    }
    if (compactRendering) {
      return { mode: "mobile", dpr: [1, 1.25], shadowMapSize: 512 };
    }
    return { mode: "desktop", dpr: [1, 1.5], shadowMapSize: 1024 };
  }, [compactRendering, reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactMedia = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateRendering = () => setCompactRendering(compactMedia.matches);
    updateMotion();
    updateRendering();
    media.addEventListener("change", updateMotion);
    compactMedia.addEventListener("change", updateRendering);
    try {
      const canvas = document.createElement("canvas");
      const available = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      queueMicrotask(() => setWebglAvailable(available));
    } catch {
      queueMicrotask(() => setWebglAvailable(false));
    }
    return () => {
      media.removeEventListener("change", updateMotion);
      compactMedia.removeEventListener("change", updateRendering);
    };
  }, []);

  useEffect(() => {
    const interact = (event: KeyboardEvent) => {
      if (!enteredCampus || event.code !== "Space" || event.repeat || paused || !nearby) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "button, a, input, textarea, select, summary, [contenteditable='true']",
        )
      ) {
        return;
      }
      event.preventDefault();
      setActiveZone(zoneById[nearby]);
    };
    window.addEventListener("keydown", interact);
    return () => window.removeEventListener("keydown", interact);
  }, [enteredCampus, nearby, paused]);

  const warpTo = useCallback((zone: CampusZone) => {
    moveTarget.current = null;
    positionRef.current.set(...zone.approach);
    setNearby(zone.id);
    setActiveZone(zone);
  }, []);

  const moveToPoint = useCallback(
    (point: THREE.Vector3) => {
      const tappedZone = CAMPUS_ZONES.find((zone) =>
        isInsideBuildingFootprint(point, zone),
      );
      if (tappedZone) {
        warpTo(tappedZone);
        return;
      }

      point.x = THREE.MathUtils.clamp(
        point.x,
        -WORLD_LIMIT,
        WORLD_LIMIT,
      );
      point.z = THREE.MathUtils.clamp(
        point.z,
        -WORLD_LIMIT,
        WORLD_LIMIT,
      );
      moveTarget.current = { point };
      setNearby(null);
    },
    [warpTo],
  );

  const reset = useCallback(() => {
    positionRef.current.copy(START);
    moveTarget.current = null;
    setNearby(null);
  }, []);

  if (!enteredCampus) {
    return (
      <main className="campus-welcome">
        <div className="welcome-sun" aria-hidden="true" />
        <div className="welcome-cloud welcome-cloud-one" aria-hidden="true" />
        <div className="welcome-cloud welcome-cloud-two" aria-hidden="true" />
        <header className="welcome-header">
          <Link className="clay-brand" href="/" aria-label="Anas Ahmed home">
            <span>AA</span>
            <div>
              <strong>Anas Ahmed</strong>
              <small>Enterprise Android Engineer &amp; Product Builder</small>
            </div>
          </Link>
          <Link className="welcome-recruiter-link" href="/recruiter/">
            <Briefcase size={18} weight="fill" />
            Go straight to Recruiter View
          </Link>
        </header>

        <section className="welcome-layout" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p>ANAS AHMED’S INTERACTIVE PORTFOLIO</p>
            <h1 id="welcome-title">Walk through the work, or get the facts.</h1>
            <span>
              The clay campus turns four projects, my repair-shop origin, and
              my maker hobbies into places you can visit.
            </span>
            <div className="welcome-actions">
              <button className="welcome-enter" onClick={() => setEnteredCampus(true)}>
                Enter the 3D Campus <ArrowRight size={19} weight="bold" />
              </button>
              <Link className="welcome-recruiter" href="/recruiter/">
                <Briefcase size={18} weight="fill" />
                Open Recruiter View
              </Link>
            </div>
            <button
              className="welcome-accessible"
              onClick={() => {
                setAccessibleView(true);
                setEnteredCampus(true);
              }}
            >
              <Monitor size={17} />
              Use the accessible 2D portfolio
            </button>
          </div>

          <div className="welcome-preview" aria-label="Preview of the clay campus">
            <div className="welcome-preview-image" role="img" aria-label="Colorful clay campus with six project and personal landmarks" />
            <div className="welcome-player-card">
              <span className="welcome-player-avatar" aria-hidden="true">
                <i />
                <b />
              </span>
              <div>
                <small>YOUR CAMPUS GUIDE</small>
                <strong>Walk, explore, and interact</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="clay-campus">
      <a className="clay-skip" href="#campus-content">Skip to portfolio content</a>
      <header className="clay-header">
        <Link className="clay-brand" href="/" aria-label="Anas Ahmed home">
          <span>AA</span>
          <div>
            <strong>Anas Ahmed</strong>
            <small>Enterprise Android Engineer &amp; Product Builder</small>
          </div>
        </Link>
        <nav aria-label="Campus navigation">
          {CAMPUS_ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => warpTo(zone)}
              aria-label={`Open ${zone.sceneLabel}`}
            >
              {zone.navLabel}
            </button>
          ))}
        </nav>
        <button className="quick-view-button" onClick={() => setRecruiterOpen(true)}>
          <Briefcase size={17} weight="fill" /> Recruiter Quick View
        </button>
      </header>

      <section className="campus-stage" aria-label="Interactive 3D portfolio campus">
        {!showAccessible && (
          <CampusCanvasBoundary onError={() => setWebglAvailable(false)}>
            <Canvas
              shadows="basic"
              dpr={renderProfile.dpr}
              camera={{ position: [10.5, 12.8, 18.6], fov: 50, near: 0.1, far: 80 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 0.98;
              }}
            >
              <CampusScene
                moveTarget={moveTarget}
                positionRef={positionRef}
                paused={paused}
                reducedMotion={reducedMotion}
                renderProfile={renderProfile}
                onNavigate={warpTo}
                onGroundNavigate={moveToPoint}
                onNearby={setNearby}
              />
            </Canvas>
          </CampusCanvasBoundary>
        )}

        <div className="campus-intro-card">
          <p>ANAS AHMED’S 3D CAMPUS</p>
          <h1>Engineering that moves through the real world.</h1>
          <span>Walk to a landmark, or use a label to choose a destination.</span>
        </div>

        <div className="control-card" aria-label="Movement instructions">
          <span className="desktop-controls"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move</span>
          <span className="desktop-controls"><kbd>Space</kbd> interact</span>
          <span className="mobile-controls"><MouseSimple size={17} /> Tap anywhere to move</span>
          <button onClick={reset}><ArrowCounterClockwise size={16} /> Reset</button>
          <button onClick={() => setAccessibleView(true)}><Monitor size={16} /> 2D view</button>
        </div>

        {nearby && !paused && (
          <button
            className="nearby-prompt"
            aria-keyshortcuts="Space"
            onClick={() => setActiveZone(zoneById[nearby])}
          >
            View {zoneById[nearby].sceneLabel} information <ArrowRight size={17} weight="bold" />
          </button>
        )}

        <aside className="campus-map" aria-label="Campus map">
          <div><MapTrifold size={18} weight="fill" /><strong>Campus map</strong></div>
          <div className="map-grid">
            {CAMPUS_ZONES.map((zone) => (
              <button
                key={zone.id}
                style={{ "--zone": zone.color } as React.CSSProperties}
                onClick={() => warpTo(zone)}
                aria-label={`Go to ${zone.sceneLabel}`}
              >
                <i />{zone.sceneLabel}
              </button>
            ))}
          </div>
        </aside>
      </section>

      {activeZone && (
        <OverlayShell titleId="zone-title" onClose={() => setActiveZone(null)}>
          <div className="overlay-accent" style={{ background: activeZone.color }} />
          <p className="overlay-kicker">{activeZone.kicker}</p>
          <h2 id="zone-title">{activeZone.title}</h2>
          <strong className="overlay-impact">{activeZone.impact}</strong>
          <p className="overlay-summary">{activeZone.summary}</p>
          <ul>
            {activeZone.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          <div className="overlay-tech">
            {activeZone.tech.map((tech) => <span key={tech}>{tech}</span>)}
          </div>
          {activeZone.link && (
            <a className="overlay-primary" href={activeZone.link.href}>
              {activeZone.link.label} <ArrowRight weight="bold" />
            </a>
          )}
        </OverlayShell>
      )}

      {recruiterOpen && (
        <OverlayShell titleId="recruiter-title" onClose={() => setRecruiterOpen(false)}>
          <div className="overlay-accent recruiter-accent" />
          <p className="overlay-kicker">RECRUITER QUICK VIEW</p>
          <h2 id="recruiter-title">I build Android software around real devices.</h2>
          <p className="overlay-summary">
            My work connects Android applications to payment terminals,
            printers, scanners, production telemetry, and the people operating
            those systems.
          </p>
          <div className="recruiter-metrics">
            <div><strong>800+</strong><span>locations upgraded</span></div>
            <div><strong>65</strong><span>automated POS tests</span></div>
            <div><strong>7→13</strong><span>Android modernization</span></div>
          </div>
          <ul>
            <li>I am a Software Engineer II, Mobile at Staples and previously worked as a Sr. Mobile Device Software Developer at General Motors.</li>
            <li>My core tools include Kotlin, Android, Jetpack Compose, hardware SDK/API integration, local networking, Splunk, and delivery automation.</li>
            <li>I am interested in application-layer robotics across Android and Linux interfaces, sensors, networking, and HMI.</li>
          </ul>
          <div className="quick-actions">
            <a className="overlay-primary" href="/recruiter/">Open full recruiter profile <ArrowRight /></a>
            <a className="overlay-secondary" href="/resumes/Anas_Ahmed_Enterprise_Android_Hardware.pdf">Download résumé</a>
          </div>
        </OverlayShell>
      )}

      {showAccessible && (
        <section id="campus-content" className="accessible-campus" aria-labelledby="accessible-title">
          <header>
            <div>
              <p>ACCESSIBLE PORTFOLIO VIEW</p>
              <h2 id="accessible-title">Engineering that moves through the real world.</h2>
            </div>
            {webglAvailable && <button onClick={() => setAccessibleView(false)}>Return to 3D campus</button>}
          </header>
          <div className="accessible-grid">
            {CAMPUS_ZONES.map((zone) => (
              <article key={zone.id} style={{ "--zone": zone.color } as React.CSSProperties}>
                <i />
                <small>{zone.kicker}</small>
                <h3>{zone.title}</h3>
                <strong>{zone.impact}</strong>
                <p>{zone.summary}</p>
                <button onClick={() => {
                  setAccessibleView(false);
                  setActiveZone(zone);
                }}>Read details <ArrowRight /></button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
