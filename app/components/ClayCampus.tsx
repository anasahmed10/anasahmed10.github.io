"use client";

import {
  Billboard,
  Float,
  Html,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  type MutableRefObject,
  type ReactNode,
  useCallback,
  useEffect,
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

const zoneById = Object.fromEntries(
  CAMPUS_ZONES.map((zone) => [zone.id, zone]),
) as Record<CampusZone["id"], CampusZone>;

function Tree({
  position,
  scale = 1,
  reducedMotion,
  phase = 0,
}: {
  position: [number, number, number];
  scale?: number;
  reducedMotion: boolean;
  phase?: number;
}) {
  const crownRef = useRef<THREE.Group>(null);
  const animationTimeRef = useRef(phase);
  useFrame((_, delta) => {
    if (!crownRef.current || reducedMotion) return;
    animationTimeRef.current += delta;
    crownRef.current.rotation.z =
      Math.sin(animationTimeRef.current * 0.72 + phase) * 0.035;
    crownRef.current.rotation.x =
      Math.cos(animationTimeRef.current * 0.54 + phase) * 0.018;
  });
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.5, 10]} />
        <meshStandardMaterial color="#936948" roughness={0.95} />
      </mesh>
      <group ref={crownRef} position={[0, 1.45, 0]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.9, 14, 12]} />
          <meshStandardMaterial color="#55b884" roughness={0.92} />
        </mesh>
        <mesh castShadow position={[0.55, 0.1, 0.12]}>
          <sphereGeometry args={[0.58, 12, 10]} />
          <meshStandardMaterial color="#71ca96" roughness={0.92} />
        </mesh>
        <mesh castShadow position={[-0.48, 0.05, -0.08]}>
          <sphereGeometry args={[0.52, 12, 10]} />
          <meshStandardMaterial color="#64c38c" roughness={0.94} />
        </mesh>
      </group>
    </group>
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
          <meshStandardMaterial color="#fff7e8" roughness={0.98} />
        </mesh>
      ))}
    </group>
  );
}

function LivingEnvironment({ reducedMotion }: { reducedMotion: boolean }) {
  const cloudRefs = useRef<Array<THREE.Group | null>>([]);
  const butterflyRef = useRef<THREE.Group>(null);
  const fountainRef = useRef<THREE.Group>(null);
  const animationTimeRef = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    animationTimeRef.current += delta;
    cloudRefs.current.forEach((cloud, index) => {
      if (!cloud) return;
      cloud.position.x += delta * (0.18 + index * 0.035);
      if (cloud.position.x > 22) cloud.position.x = -22;
      cloud.position.y +=
        Math.sin(animationTimeRef.current * 0.35 + index) * 0.0009;
    });
    if (butterflyRef.current) {
      const time = animationTimeRef.current;
      butterflyRef.current.position.set(
        Math.sin(time * 0.55) * 5.4,
        1.9 + Math.sin(time * 2.1) * 0.28,
        1 + Math.cos(time * 0.7) * 4.1,
      );
      butterflyRef.current.rotation.y = -time * 0.55;
      butterflyRef.current.children.forEach((wing, index) => {
        wing.rotation.y = Math.sin(time * 8) * 0.72 * (index === 0 ? 1 : -1);
      });
    }
    if (fountainRef.current) {
      fountainRef.current.rotation.y += delta * 0.28;
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
        <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
          <cylinderGeometry args={[1.28, 1.48, 0.82, 28]} />
          <meshStandardMaterial color="#fff0d2" roughness={0.9} />
        </mesh>
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

      <group ref={butterflyRef} position={[2, 2, 2]} scale={0.7}>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0.4, 0.25]}>
          <sphereGeometry args={[0.27, 10, 8]} />
          <meshStandardMaterial color="#ffbf3f" roughness={0.86} />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, -0.4, -0.25]}>
          <sphereGeometry args={[0.27, 10, 8]} />
          <meshStandardMaterial color="#ff6f61" roughness={0.86} />
        </mesh>
        <mesh scale={[0.28, 0.5, 0.28]}>
          <sphereGeometry args={[0.3, 10, 8]} />
          <meshStandardMaterial color="#25334a" roughness={0.9} />
        </mesh>
      </group>

      {[
        [-4.4, -2.6, "#ff6f61"],
        [4.8, 2.8, "#ffbf3f"],
        [-2.2, 5.1, "#9b6ce0"],
        [3.3, -5.2, "#ffffff"],
      ].map(([x, z, color], patchIndex) => (
        <group key={`${x}-${z}`} position={[Number(x), 0.12, Number(z)]}>
          {[-0.35, 0, 0.35].map((offset, flowerIndex) => (
            <mesh
              key={offset}
              position={[offset, flowerIndex % 2 ? 0.12 : 0, Math.sin(patchIndex + flowerIndex) * 0.25]}
            >
              <sphereGeometry args={[0.13, 8, 6]} />
              <meshStandardMaterial color={String(color)} roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
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
          <RoundedBox args={[4.8, 3.35, 4.1]} radius={0.72} smoothness={5} position={[0, 1.68, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={zone.color} roughness={0.9} />
          </RoundedBox>
          <RoundedBox args={[5.05, 0.54, 4.32]} radius={0.24} smoothness={4} position={[0, 3.45, 0]} rotation={[0, 0, -0.035]} castShadow>
            <meshStandardMaterial color="#fff0d2" roughness={0.92} />
          </RoundedBox>
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
          <RoundedBox args={[5.65, 4.7, 4.8]} radius={0.85} smoothness={6} position={[0, 2.35, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={zone.color} roughness={0.84} />
          </RoundedBox>
          <RoundedBox args={[4.1, 0.46, 3.2]} radius={0.3} smoothness={4} position={[0, 4.76, -0.25]} rotation={[0.03, 0, -0.025]}>
            <meshStandardMaterial color="#244b9e" roughness={0.74} />
          </RoundedBox>
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
          <RoundedBox args={[6.1, 3.45, 3.9]} radius={0.85} smoothness={6} position={[0, 1.72, -0.5]} castShadow receiveShadow>
            <meshStandardMaterial color={zone.color} roughness={0.83} />
          </RoundedBox>
          <RoundedBox args={[4.8, 2.35, 0.22]} radius={0.48} smoothness={5} position={[0, 1.55, 1.52]}>
            <meshStandardMaterial color="#fff4df" roughness={0.82} />
          </RoundedBox>
          <RoundedBox args={[4.25, 1.82, 0.12]} radius={0.36} smoothness={5} position={[0, 1.48, 1.68]}>
            <meshStandardMaterial color="#40536b" roughness={0.56} />
          </RoundedBox>
          <group position={[0, 0.72, 2.15]} rotation={[0, -0.03, 0]}>
            <RoundedBox args={[3.65, 0.95, 1.82]} radius={0.45} smoothness={6} castShadow>
              <meshStandardMaterial color="#ff6f61" roughness={0.82} />
            </RoundedBox>
            <RoundedBox args={[1.95, 0.84, 1.45]} radius={0.38} smoothness={6} position={[-0.15, 0.68, -0.12]} castShadow>
              <meshStandardMaterial color="#ff8d80" roughness={0.82} />
            </RoundedBox>
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
          <RoundedBox args={[5.35, 3.4, 4.25]} radius={0.55} smoothness={5} position={[0, 1.7, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={zone.color} roughness={0.84} />
          </RoundedBox>
          <RoundedBox args={[3.9, 2.42, 0.22]} radius={0.32} smoothness={4} position={[0, 1.55, 2.22]}>
            <meshStandardMaterial color="#fff4df" roughness={0.86} />
          </RoundedBox>
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
          <RoundedBox args={[5.35, 3.5, 4.45]} radius={1.05} smoothness={6} position={[0, 1.75, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={zone.color} roughness={0.86} />
          </RoundedBox>
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
        <RoundedBox args={[5.1, 0.42, 4.15]} radius={0.18} smoothness={4} position={[0, 0.23, 0]} receiveShadow>
          <meshStandardMaterial color="#fff0d2" roughness={0.92} />
        </RoundedBox>
        {[-2.05, 2.05].flatMap((postX) =>
          [-1.55, 1.55].map((postZ) => (
            <RoundedBox key={`${postX}-${postZ}`} args={[0.34, 3.7, 0.34]} radius={0.12} smoothness={4} position={[postX, 2.05, postZ]} castShadow>
              <meshStandardMaterial color={zone.color} roughness={0.86} />
            </RoundedBox>
          )),
        )}
        <RoundedBox args={[4.55, 0.38, 0.42]} radius={0.12} smoothness={4} position={[0, 3.84, 1.55]} castShadow>
          <meshStandardMaterial color={roofColor} roughness={0.84} />
        </RoundedBox>
        <RoundedBox args={[4.55, 0.38, 0.42]} radius={0.12} smoothness={4} position={[0, 3.84, -1.55]} castShadow>
          <meshStandardMaterial color={roofColor} roughness={0.84} />
        </RoundedBox>
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
        <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.18}>
          <mesh position={[1.75, 3.05, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.12, 10, 22]} />
            <meshStandardMaterial color="#fffdf5" roughness={0.9} />
          </mesh>
        </Float>
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
  const animationTimeRef = useRef(0);
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
    const movement = new THREE.Vector3();
    animationTimeRef.current += delta;

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
        const next = position.clone().add(movement);
        next.x = THREE.MathUtils.clamp(next.x, -WORLD_LIMIT, WORLD_LIMIT);
        next.z = THREE.MathUtils.clamp(next.z, -WORLD_LIMIT, WORLD_LIMIT);
        const blocked = CAMPUS_ZONES.some((zone) => {
          const [x, , z] = zone.position;
          return (
            Math.abs(next.x - x) < zone.width / 2 + 0.7 &&
            Math.abs(next.z - z) < 2.65
          );
        });
        if (!blocked) position.copy(next);
        group.current.rotation.y = Math.atan2(movement.x, movement.z);
      }
    }

    const isMoving = movement.lengthSq() > 0.00001;
    const time = animationTimeRef.current;
    const walkCycle = Math.sin(time * 10);
    const idleCycle = Math.sin(time * 1.7);
    group.current.position.copy(position);
    group.current.position.y =
      reducedMotion ? 0 : isMoving ? Math.abs(Math.sin(time * 10)) * 0.08 : idleCycle * 0.018;

    if (characterRef.current) {
      const targetScaleY = reducedMotion ? 1 : isMoving ? 1 + Math.abs(walkCycle) * 0.025 : 1 + idleCycle * 0.012;
      characterRef.current.scale.y = THREE.MathUtils.lerp(
        characterRef.current.scale.y,
        targetScaleY,
        0.12,
      );
      characterRef.current.rotation.z = THREE.MathUtils.lerp(
        characterRef.current.rotation.z,
        reducedMotion || isMoving ? 0 : Math.sin(time * 0.8) * 0.018,
        0.08,
      );
    }
    if (leftArmRef.current && rightArmRef.current && leftLegRef.current && rightLegRef.current) {
      const limbSwing = reducedMotion || !isMoving ? 0 : walkCycle * 0.62;
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, limbSwing, 0.22);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -limbSwing, 0.22);
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -limbSwing * 0.72, 0.22);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, limbSwing * 0.72, 0.22);
    }
    if (headRef.current) {
      headRef.current.rotation.y = reducedMotion || isMoving ? 0 : Math.sin(time * 0.72) * 0.16;
      headRef.current.rotation.z = reducedMotion || isMoving ? 0 : Math.sin(time * 0.5) * 0.035;
    }
    if (eyesRef.current) {
      const blink = !reducedMotion && Math.sin(time * 0.83) > 0.992 ? 0.12 : 1;
      eyesRef.current.scale.y = THREE.MathUtils.lerp(eyesRef.current.scale.y, blink, 0.55);
    }

    const nearest = CAMPUS_ZONES.find((zone) => {
      const approach = new THREE.Vector3(...zone.approach);
      return approach.distanceTo(position) < 2.2;
    })?.id ?? null;
    if (nearest !== previousNearby.current) {
      previousNearby.current = nearest;
      onNearby(nearest);
    }

    const desiredCamera = new THREE.Vector3(position.x + 10.5, 12.8, position.z + 14);
    camera.position.lerp(desiredCamera, reducedMotion ? 0.18 : 0.075);
    camera.lookAt(position.x, 1.1, position.z - 1.2);
  });

  return (
    <group ref={group}>
      <group ref={characterRef}>
        <mesh castShadow position={[0, 1.37, -0.08]}>
          <capsuleGeometry args={[0.4, 0.76, 8, 14]} />
          <meshStandardMaterial color="#2f66d0" roughness={0.88} />
        </mesh>
        <mesh position={[0, 1.45, 0.325]}>
          <boxGeometry args={[0.035, 0.62, 0.035]} />
          <meshStandardMaterial color="#d9f5ff" roughness={0.64} />
        </mesh>
        <mesh position={[0.19, 1.55, 0.345]}>
          <circleGeometry args={[0.075, 12]} />
          <meshStandardMaterial color="#ffbf3f" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 2.08, 0]}>
          <cylinderGeometry args={[0.25, 0.29, 0.18, 16]} />
          <meshStandardMaterial color="#fff3de" roughness={0.9} />
        </mesh>
        <RoundedBox
          args={[0.64, 0.7, 0.24]}
          radius={0.15}
          smoothness={4}
          position={[0, 1.5, -0.39]}
          castShadow
        >
          <meshStandardMaterial color="#ff6f61" roughness={0.88} />
        </RoundedBox>

        <group ref={headRef} position={[0, 2.46, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.4, 18, 14]} />
            <meshStandardMaterial color="#d9946d" roughness={0.92} />
          </mesh>
          <mesh castShadow position={[0, 0.24, -0.025]}>
            <sphereGeometry args={[0.405, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <meshStandardMaterial color="#24344a" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.2, 0.22, 0.2]} scale={[0.55, 0.32, 0.48]} rotation={[0.1, 0, -0.28]}>
            <sphereGeometry args={[0.35, 12, 9]} />
            <meshStandardMaterial color="#24344a" roughness={0.9} />
          </mesh>
          <group ref={eyesRef}>
            {[-0.13, 0.13].map((eyeX) => (
              <mesh key={eyeX} position={[eyeX, 0.035, 0.374]}>
                <sphereGeometry args={[0.037, 10, 8]} />
                <meshStandardMaterial color="#25334a" roughness={0.62} />
              </mesh>
            ))}
          </group>
          <mesh position={[0, -0.02, 0.39]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshStandardMaterial color="#c77f5b" roughness={0.9} />
          </mesh>
          <RoundedBox
            args={[0.14, 0.032, 0.028]}
            radius={0.014}
            smoothness={3}
            position={[0, -0.15, 0.395]}
          >
            <meshStandardMaterial color="#7b493d" roughness={0.82} />
          </RoundedBox>
        </group>

        <group ref={leftArmRef} position={[-0.47, 1.68, 0]}>
          <mesh castShadow position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.12, 0.48, 6, 10]} />
            <meshStandardMaterial color="#fff3de" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.7, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshStandardMaterial color="#d9946d" roughness={0.92} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.47, 1.68, 0]}>
          <mesh castShadow position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.12, 0.48, 6, 10]} />
            <meshStandardMaterial color="#fff3de" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.7, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshStandardMaterial color="#d9946d" roughness={0.92} />
          </mesh>
        </group>
        <group ref={leftLegRef} position={[-0.2, 0.9, 0]}>
          <mesh castShadow position={[0, -0.42, 0]}>
            <capsuleGeometry args={[0.14, 0.54, 6, 10]} />
            <meshStandardMaterial color="#40536b" roughness={0.88} />
          </mesh>
          <RoundedBox args={[0.32, 0.2, 0.46]} radius={0.1} position={[0, -0.77, 0.1]} castShadow>
            <meshStandardMaterial color="#25334a" roughness={0.82} />
          </RoundedBox>
        </group>
        <group ref={rightLegRef} position={[0.2, 0.9, 0]}>
          <mesh castShadow position={[0, -0.42, 0]}>
            <capsuleGeometry args={[0.14, 0.54, 6, 10]} />
            <meshStandardMaterial color="#40536b" roughness={0.88} />
          </mesh>
          <RoundedBox args={[0.32, 0.2, 0.46]} radius={0.1} position={[0, -0.77, 0.1]} castShadow>
            <meshStandardMaterial color="#25334a" roughness={0.82} />
          </RoundedBox>
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
  onNavigate,
  onNearby,
}: {
  moveTarget: MutableRefObject<MoveTarget>;
  positionRef: PositionRef;
  paused: boolean;
  reducedMotion: boolean;
  onNavigate: (zone: CampusZone) => void;
  onNearby: (id: CampusZone["id"] | null) => void;
}) {
  const trees = useMemo(
    () =>
      [
        [-12, -8], [-11, 1], [-12, 10], [-5, 10], [4, 10], [12, 10],
        [12, 1], [12, -9], [5, -12], [-6, -12], [-3, 3], [3, 3],
      ] as [number, number][],
    [],
  );

  return (
    <>
      <color attach="background" args={["#9fd8ff"]} />
      <fog attach="fog" args={["#b9e4ff", 24, 46]} />
      <ambientLight intensity={1.65} />
      <hemisphereLight args={["#fff7dd", "#79b98a", 1.6]} />
      <directionalLight
        castShadow
        position={[10, 18, 8]}
        intensity={2.3}
        shadow-mapSize-width={reducedMotion ? 1024 : 2048}
        shadow-mapSize-height={reducedMotion ? 1024 : 2048}
        shadow-camera-far={48}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <circleGeometry args={[21, 64]} />
        <meshStandardMaterial color="#cce8a4" roughness={1} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <ringGeometry args={[7.6, 9.1, 64]} />
        <meshStandardMaterial color="#fff1d7" roughness={0.98} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[4.4, 48]} />
        <meshStandardMaterial color="#f7d58d" roughness={0.98} />
      </mesh>
      {CAMPUS_ZONES.map((zone) => (
        <Building key={zone.id} zone={zone} onSelect={onNavigate} />
      ))}
      {trees.map(([x, z], index) => (
        <Tree
          key={`${x}-${z}`}
          position={[x, 0, z]}
          scale={0.8 + (index % 3) * 0.12}
          reducedMotion={reducedMotion}
          phase={index * 0.57}
        />
      ))}
      <LivingEnvironment reducedMotion={reducedMotion} />
      {!reducedMotion && (
        <Sparkles count={48} scale={[32, 7, 32]} size={1.5} speed={0.22} color="#ffffff" opacity={0.35} />
      )}
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
  const [webglAvailable, setWebglAvailable] = useState(true);
  const positionRef = useRef(START.clone());
  const moveTarget = useRef<MoveTarget>(null);
  const showAccessible = accessibleView || !webglAvailable;
  const paused = Boolean(!enteredCampus || activeZone || recruiterOpen || showAccessible);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    try {
      const canvas = document.createElement("canvas");
      const available = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      queueMicrotask(() => setWebglAvailable(available));
    } catch {
      queueMicrotask(() => setWebglAvailable(false));
    }
    return () => media.removeEventListener("change", updateMotion);
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

  const moveTo = useCallback((zone: CampusZone) => {
    moveTarget.current = {
      point: new THREE.Vector3(...zone.approach),
    };
  }, []);

  const warpTo = useCallback((zone: CampusZone) => {
    moveTarget.current = null;
    positionRef.current.set(...zone.approach);
    setNearby(zone.id);
    setActiveZone(zone);
  }, []);

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
              shadows
              dpr={[1, reducedMotion ? 1.25 : 1.65]}
              camera={{ position: [10.5, 12.8, 18.6], fov: 50, near: 0.1, far: 80 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <CampusScene
                moveTarget={moveTarget}
                positionRef={positionRef}
                paused={paused}
                reducedMotion={reducedMotion}
                onNavigate={moveTo}
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
          <span className="mobile-controls"><MouseSimple size={17} /> Tap a landmark to walk over</span>
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
                onClick={() => moveTo(zone)}
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
