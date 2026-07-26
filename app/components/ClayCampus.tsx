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
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  MapTrifold,
  Monitor,
  MouseSimple,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  type MutableRefObject,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

export type CampusZone = {
  id: "about" | "experience" | "products" | "systems" | "contact";
  navLabel: string;
  sceneLabel: string;
  kicker: string;
  title: string;
  summary: string;
  impact: string;
  color: string;
  position: [number, number, number];
  approach: [number, number, number];
  height: number;
  width: number;
  details: string[];
  tech: string[];
  link?: { label: string; href: string };
};

type PositionRef = MutableRefObject<THREE.Vector3>;
type MoveTarget = { point: THREE.Vector3; zoneId?: CampusZone["id"] } | null;

const START = new THREE.Vector3(0, 0, 8);
const WORLD_LIMIT = 14;

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: "about",
    navLabel: "Explore",
    sceneLabel: "About",
    kicker: "ABOUT ANAS",
    title: "From tinkering to connected systems.",
    summary:
      "I’m Anas Ahmed, an enterprise Android engineer who builds software that connects people, business systems, and real-world hardware.",
    impact: "A hands-on path into mobile engineering",
    color: "#ff6f61",
    position: [-8, 0, -5],
    approach: [-5.5, 0, -2.5],
    height: 4.2,
    width: 4.5,
    details: [
      "01 — It started with discovering and modifying software on Windows PCs, then grew into co-founding Deer Computer Repairs—repairing, building, upgrading, and refurbishing computers.",
      "02 — At university, mobile development became the bridge between a love of software and a lasting, hands-on interest in hardware.",
      "03 — At General Motors and Staples, that combination shaped work across a connected-vehicle companion app, self-service print and copy, payment terminals, printers, tablets, and barcode-scanning workflows.",
      "04 — Outside work, I’m building the Kotlin Multiplatform receipt-splitting app TabTally and dabbling in Godot game development, especially platforming physics.",
    ],
    tech: ["PC tinkering", "Deer Computer Repairs", "Mobile + hardware", "Products + play"],
  },
  {
    id: "experience",
    navLabel: "Experience",
    sceneLabel: "Engineering Experience",
    kicker: "ENGINEERING EXPERIENCE",
    title: "Dependable systems at production scale.",
    summary:
      "Professional experience spans Staples, General Motors, and Syntax Tutoring, with technical ownership across Android modernization, hardware integration, delivery tooling, and maintainable architecture.",
    impact: "800+ locations · zero production failures",
    color: "#2f66d0",
    position: [7.5, 0, -5.5],
    approach: [5.2, 0, -2.4],
    height: 5.4,
    width: 5.3,
    details: [
      "Owned a Java/Android 7 to Kotlin/Android 13 modernization for hardware-integrated retail workflows.",
      "Helped deliver a four-stage local PIN pad upgrade across 800+ locations with zero production failures.",
      "Built Android and iOS app-size dashboards from Jenkins data and release pipelines in Azure DevOps.",
    ],
    tech: ["Kotlin", "Jetpack Compose", "MVVM", "Azure DevOps", "Jenkins"],
    link: {
      label: "Download enterprise résumé",
      href: "/resumes/Anas_Ahmed_Enterprise_Android_Hardware.pdf",
    },
  },
  {
    id: "products",
    navLabel: "Products",
    sceneLabel: "Products",
    kicker: "PRODUCTS",
    title: "Product thinking, shipped with engineering discipline.",
    summary:
      "TabTally turns a messy receipt into a trustworthy split through capture, OCR, AI-assisted parsing, human review, participant assignment, and fair calculation.",
    impact: "Kotlin Multiplatform · Android + iOS",
    color: "#ffbf3f",
    position: [0, 0, -9.5],
    approach: [0, 0, -5.7],
    height: 3.8,
    width: 5.2,
    details: [
      "Designed the end-to-end product flow and cross-platform application architecture.",
      "AI proposes receipt structure while editable review keeps people in control.",
      "Shared product logic supports a native-style Android and iOS experience.",
    ],
    tech: ["Kotlin Multiplatform", "Compose Multiplatform", "OCR", "Mobile AI"],
    link: { label: "Explore TabTally", href: "/products/tabtally/" },
  },
  {
    id: "systems",
    navLabel: "Systems",
    sceneLabel: "Systems & Automation",
    kicker: "SYSTEMS & AUTOMATION",
    title: "Applications that connect to the physical world.",
    summary:
      "Device integration, scanner-led test automation, printer observability, and application-layer robotics meet in systems designed for operators—not demos.",
    impact: "65 POS tests · +55% automation · 1st place",
    color: "#42b883",
    position: [-8.5, 0, 6],
    approach: [-5.6, 0, 4],
    height: 4.8,
    width: 5.2,
    details: [
      "Built a Kotlin Android application and tablet-hosted local server that automated 65 POS tests.",
      "Created real-time printer status-light monitoring in Splunk to surface issue duration and frequency.",
      "Future direction: Android/Linux control surfaces, networking, sensors, automation, and HMI.",
    ],
    tech: ["Hardware APIs", "NanoHttpd", "Splunk", "Networking", "HMI"],
  },
  {
    id: "contact",
    navLabel: "Contact",
    sceneLabel: "Contact",
    kicker: "CONTACT",
    title: "Let’s build dependable systems.",
    summary:
      "Open to enterprise Android, hardware-integrated mobile systems, and application-layer robotics opportunities.",
    impact: "Greater Boston · Remote-first",
    color: "#9b6ce0",
    position: [8.5, 0, 6],
    approach: [5.6, 0, 4],
    height: 4,
    width: 4.8,
    details: [
      "Email: anas.ahmed10@outlook.com",
      "Phone: 774-300-7831",
      "LinkedIn and GitHub profiles are available below.",
    ],
    tech: ["Enterprise Android", "Device integration", "Robotics applications"],
  },
];

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
    if (zone.id === "about") {
      return (
        <>
          <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
            <cylinderGeometry args={[2.35, 2.48, 3.8, 32]} />
            <meshStandardMaterial color={zone.color} roughness={0.84} />
          </mesh>
          <mesh position={[0, 2.55, 0]} castShadow>
            <cylinderGeometry args={[2.42, 2.42, 1.12, 32]} />
            {glass}
          </mesh>
          <mesh position={[0, 3.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[1.75, 0.55, 12, 36]} />
            <meshStandardMaterial color={roofColor} roughness={0.77} />
          </mesh>
          <mesh position={[0, 3.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.23, 32]} />
            <meshStandardMaterial color="#b9e7f2" roughness={0.38} />
          </mesh>
          {door}
        </>
      );
    }

    if (zone.id === "experience") {
      return (
        <>
          <RoundedBox
            args={[5.25, 5.25, 4.3]}
            radius={0.8}
            smoothness={5}
            position={[0, 2.62, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={zone.color} roughness={0.84} />
          </RoundedBox>
          <RoundedBox
            args={[3.75, 0.34, 2.85]}
            radius={0.55}
            smoothness={5}
            position={[0, 5.22, 0]}
          >
            <meshStandardMaterial color="#244b9e" roughness={0.74} />
          </RoundedBox>
          <RoundedBox
            args={[3.15, 0.2, 2.25]}
            radius={0.42}
            smoothness={5}
            position={[0, 5.42, 0]}
          >
            <meshStandardMaterial color="#9fd8ff" roughness={0.38} />
          </RoundedBox>
          {[-1.72, -0.58, 0.58, 1.72].map((windowX) => (
            <RoundedBox
              key={windowX}
              args={[0.62, 1.75, 0.18]}
              radius={0.2}
              smoothness={4}
              position={[windowX, 3.45, 2.22]}
            >
              {glass}
            </RoundedBox>
          ))}
          {door}
        </>
      );
    }

    if (zone.id === "products") {
      return (
        <>
          <RoundedBox
            args={[5.3, 3.35, 4.5]}
            radius={1.05}
            smoothness={6}
            position={[0, 1.68, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={zone.color} roughness={0.83} />
          </RoundedBox>
          <RoundedBox
            args={[3.05, 0.24, 2.4]}
            radius={0.62}
            smoothness={5}
            position={[0, 3.42, -0.18]}
            rotation={[0, -0.12, 0]}
          >
            {glass}
          </RoundedBox>
          <RoundedBox
            args={[3.25, 1.55, 0.2]}
            radius={0.3}
            smoothness={4}
            position={[0, 2.12, 2.31]}
          >
            {glass}
          </RoundedBox>
          {[-0.8, 0, 0.8].map((mullionX) => (
            <mesh key={mullionX} position={[mullionX, 2.12, 2.45]}>
              <boxGeometry args={[0.09, 1.45, 0.09]} />
              <meshStandardMaterial color="#40536b" roughness={0.7} />
            </mesh>
          ))}
          {door}
        </>
      );
    }

    if (zone.id === "systems") {
      return (
        <>
          <RoundedBox
            args={[5.35, 4.15, 4.5]}
            radius={0.58}
            smoothness={5}
            position={[0, 2.08, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={zone.color} roughness={0.84} />
          </RoundedBox>
          <RoundedBox
            args={[3.05, 2.25, 0.22]}
            radius={0.3}
            smoothness={4}
            position={[0, 2.35, 2.32]}
          >
            {glass}
          </RoundedBox>
          {[-0.95, 0, 0.95].map((mullionX) => (
            <mesh key={mullionX} position={[mullionX, 2.35, 2.46]}>
              <boxGeometry args={[0.1, 2.1, 0.09]} />
              <meshStandardMaterial color="#fff4df" roughness={0.78} />
            </mesh>
          ))}
          {[-1.45, -0.48, 0.48, 1.45].map((ventX) => (
            <RoundedBox
              key={ventX}
              args={[0.64, 0.3, 2.55]}
              radius={0.12}
              position={[ventX, 4.35, -0.25]}
              rotation={[0, 0, 0.12]}
            >
              <meshStandardMaterial color="#fff0cf" roughness={0.8} />
            </RoundedBox>
          ))}
          {door}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
            <mesh castShadow position={[0, 5.45, 0]}>
              <torusGeometry args={[0.85, 0.18, 12, 24]} />
              <meshStandardMaterial color="#fff4df" roughness={0.7} />
            </mesh>
          </Float>
        </>
      );
    }

    return (
      <>
        <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
          <cylinderGeometry args={[2.45, 2.55, 3.8, 32]} />
          <meshStandardMaterial color={zone.color} roughness={0.84} />
        </mesh>
        <mesh castShadow position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.62, 0.58, 14, 36]} />
          <meshStandardMaterial color={roofColor} roughness={0.78} />
        </mesh>
        <mesh position={[0, 3.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.12, 32]} />
          <meshStandardMaterial color="#49395f" roughness={0.92} />
        </mesh>
        {[-1.25, 1.25].map((windowX) => (
          <RoundedBox
            key={windowX}
            args={[0.7, 1.15, 0.18]}
            radius={0.28}
            smoothness={5}
            position={[windowX, 2.45, 2.3]}
          >
            {glass}
          </RoundedBox>
        ))}
        {door}
      </>
    );
  })();

  return (
    <group
      position={[x, 0, z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(zone);
      }}
    >
      {buildingShape}
      <Billboard position={[0, zone.height + 1.15, 2.35]} follow>
        <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
          <div className="scene-label">
            <span style={{ background: zone.color }} />
            {zone.sceneLabel}
          </div>
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
  onArrive,
  onNearby,
}: {
  positionRef: PositionRef;
  targetRef: MutableRefObject<MoveTarget>;
  paused: boolean;
  reducedMotion: boolean;
  onArrive: (id: CampusZone["id"]) => void;
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
          const arrived = targetRef.current.zoneId;
          targetRef.current = null;
          if (arrived) onArrive(arrived);
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

    const desiredCamera = new THREE.Vector3(position.x + 8.5, 10.5, position.z + 10.5);
    camera.position.lerp(desiredCamera, reducedMotion ? 0.18 : 0.075);
    camera.lookAt(position.x, 1.1, position.z - 1.2);
  });

  return (
    <group ref={group}>
      <group ref={characterRef}>
        <mesh castShadow position={[0, 1.42, 0]}>
          <capsuleGeometry args={[0.4, 0.76, 8, 14]} />
          <meshStandardMaterial color="#2f66d0" roughness={0.88} />
        </mesh>
        <mesh position={[0, 1.5, 0.405]}>
          <boxGeometry args={[0.035, 0.62, 0.035]} />
          <meshStandardMaterial color="#d9f5ff" roughness={0.64} />
        </mesh>
        <mesh position={[0.19, 1.6, 0.425]}>
          <circleGeometry args={[0.075, 12]} />
          <meshStandardMaterial color="#ffbf3f" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 1.79, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.065, 8, 20]} />
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

        <group ref={headRef} position={[0, 2.15, 0]}>
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
          <mesh position={[0, -0.055, 0.39]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshStandardMaterial color="#c77f5b" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.14, 0.39]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.085, 0.018, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#7b493d" roughness={0.82} />
          </mesh>
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
  onOpen,
  onNearby,
}: {
  moveTarget: MutableRefObject<MoveTarget>;
  positionRef: PositionRef;
  paused: boolean;
  reducedMotion: boolean;
  onNavigate: (zone: CampusZone) => void;
  onOpen: (zone: CampusZone) => void;
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
        onArrive={(id) => onOpen(zoneById[id])}
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
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      zoneId: zone.id,
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
            <h1 id="welcome-title">Choose the fastest path to what you need.</h1>
            <span>
              Explore a living clay campus as a small engineer, or skip directly
              to a focused, recruiter-friendly profile.
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
            <div className="welcome-preview-image" role="img" aria-label="Colorful clay campus with five buildings" />
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
          {CAMPUS_ZONES.filter((zone) => zone.id !== "systems").map((zone) => (
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
          <Canvas
            shadows
            dpr={[1, reducedMotion ? 1.25 : 1.75]}
            camera={{ position: [8.5, 10.5, 18.5], fov: 48, near: 0.1, far: 80 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <CampusScene
              moveTarget={moveTarget}
              positionRef={positionRef}
              paused={paused}
              reducedMotion={reducedMotion}
              onNavigate={moveTo}
              onOpen={setActiveZone}
              onNearby={setNearby}
            />
          </Canvas>
        )}

        <div className="campus-intro-card">
          <p>ANAS AHMED’S 3D CAMPUS</p>
          <h1>Engineering that moves through the real world.</h1>
          <span>Explore the buildings or jump straight to the recruiter view.</span>
        </div>

        <div className="control-card" aria-label="Movement instructions">
          <span className="desktop-controls"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move</span>
          <span className="desktop-controls"><kbd>Space</kbd> interact</span>
          <span className="mobile-controls"><MouseSimple size={17} /> Tap a building to move</span>
          <button onClick={reset}><ArrowCounterClockwise size={16} /> Reset</button>
          <button onClick={() => setAccessibleView(true)}><Monitor size={16} /> 2D view</button>
        </div>

        {nearby && !paused && (
          <button
            className="nearby-prompt"
            aria-keyshortcuts="Space"
            onClick={() => setActiveZone(zoneById[nearby])}
          >
            Enter {zoneById[nearby].sceneLabel} <ArrowRight size={17} weight="bold" />
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
          {activeZone.id === "contact" && (
            <div className="contact-actions">
              <a href="mailto:anas.ahmed10@outlook.com"><EnvelopeSimple /> Email Anas</a>
              <a href="https://www.linkedin.com/in/anas-ahmed-28b391166" target="_blank" rel="noreferrer"><LinkedinLogo /> LinkedIn</a>
              <a href="https://github.com/anasahmed10" target="_blank" rel="noreferrer"><GithubLogo /> GitHub</a>
            </div>
          )}
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
          <h2 id="recruiter-title">Enterprise Android engineering for real devices.</h2>
          <p className="overlay-summary">
            Anas Ahmed is a Greater Boston–based, remote-first engineer connecting Android applications to payment terminals, printers, scanners, production telemetry, and operational teams.
          </p>
          <div className="recruiter-metrics">
            <div><strong>800+</strong><span>locations upgraded</span></div>
            <div><strong>65</strong><span>automated POS tests</span></div>
            <div><strong>7→13</strong><span>Android modernization</span></div>
          </div>
          <ul>
            <li>Software Engineer II, Mobile at Staples; previously Senior Mobile Device Software Developer at General Motors.</li>
            <li>Kotlin, Android, Jetpack Compose, hardware SDK/API integration, local networking, Splunk, and delivery automation.</li>
            <li>Application-layer robotics direction spanning Android/Linux interfaces, sensors, networking, and HMI.</li>
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
