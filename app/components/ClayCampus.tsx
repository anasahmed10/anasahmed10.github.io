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
    title: "Software for the real world.",
    summary:
      "I’m Anas Ahmed, an Enterprise Android Engineer and product builder creating dependable software around physical devices, production workflows, mobile AI, and the people who rely on them.",
    impact: "Greater Boston · Remote-first",
    color: "#ff6f61",
    position: [-8, 0, -5],
    approach: [-5.5, 0, -2.5],
    height: 4.2,
    width: 4.5,
    details: [
      "Enterprise Android experience across payment terminals, printers, scanners, store networks, and observability.",
      "Bachelor of Science in Computer Science from the University of Massachusetts Lowell.",
      "Interested in enterprise device systems and application-layer robotics.",
    ],
    tech: ["Kotlin", "Android", "Systems thinking", "Product engineering"],
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

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.5, 10]} />
        <meshStandardMaterial color="#936948" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.9, 14, 12]} />
        <meshStandardMaterial color="#55b884" roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0.55, 1.55, 0.12]}>
        <sphereGeometry args={[0.58, 12, 10]} />
        <meshStandardMaterial color="#71ca96" roughness={0.92} />
      </mesh>
    </group>
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
  return (
    <group
      position={[x, 0, z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(zone);
      }}
    >
      <RoundedBox
        args={[zone.width, zone.height, 4.1]}
        radius={0.45}
        smoothness={4}
        position={[0, zone.height / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={zone.color} roughness={0.82} />
      </RoundedBox>
      <RoundedBox
        args={[zone.width + 0.35, 0.55, 4.45]}
        radius={0.22}
        smoothness={4}
        position={[0, zone.height + 0.12, 0]}
        castShadow
      >
        <meshStandardMaterial color={roofColor} roughness={0.76} />
      </RoundedBox>
      <RoundedBox
        args={[1.15, 2.05, 0.28]}
        radius={0.18}
        position={[0, 1.02, 2.08]}
        castShadow
      >
        <meshStandardMaterial color="#fff4df" roughness={0.72} />
      </RoundedBox>
      {[-1.35, 1.35].map((windowX) => (
        <RoundedBox
          key={windowX}
          args={[0.8, 0.9, 0.22]}
          radius={0.16}
          position={[windowX, zone.height * 0.62, 2.1]}
        >
          <meshStandardMaterial
            color="#d9f5ff"
            emissive="#8fd9ff"
            emissiveIntensity={0.18}
            roughness={0.4}
          />
        </RoundedBox>
      ))}
      {zone.id === "systems" && (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
          <mesh castShadow position={[0, zone.height + 1.35, 0]}>
            <torusGeometry args={[0.85, 0.18, 12, 24]} />
            <meshStandardMaterial color="#fff4df" roughness={0.7} />
          </mesh>
        </Float>
      )}
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
  const keys = useRef(new Set<string>());
  const previousNearby = useRef<CampusZone["id"] | null>(null);
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

    group.current.position.copy(position);
    const bob = reducedMotion ? 0 : Math.sin(performance.now() * 0.008) * 0.025;
    group.current.position.y = bob;

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
      <mesh castShadow position={[0, 1.35, 0]}>
        <capsuleGeometry args={[0.38, 0.8, 8, 12]} />
        <meshStandardMaterial color="#fff3de" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 2.12, 0]}>
        <sphereGeometry args={[0.46, 16, 12]} />
        <meshStandardMaterial color="#d9946d" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2.42, -0.03]}>
        <sphereGeometry args={[0.47, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.54]} />
        <meshStandardMaterial color="#24344a" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[-0.22, 0.42, 0]}>
        <capsuleGeometry args={[0.13, 0.55, 6, 10]} />
        <meshStandardMaterial color="#2f66d0" roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0.22, 0.42, 0]}>
        <capsuleGeometry args={[0.13, 0.55, 6, 10]} />
        <meshStandardMaterial color="#2f66d0" roughness={0.86} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.85, 24]} />
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
        <Tree key={`${x}-${z}`} position={[x, 0, z]} scale={0.8 + (index % 3) * 0.12} />
      ))}
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
  const [activeZone, setActiveZone] = useState<CampusZone | null>(null);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [accessibleView, setAccessibleView] = useState(false);
  const [nearby, setNearby] = useState<CampusZone["id"] | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const positionRef = useRef(START.clone());
  const moveTarget = useRef<MoveTarget>(null);
  const showAccessible = accessibleView || !webglAvailable;
  const paused = Boolean(activeZone || recruiterOpen || showAccessible);

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
      if (event.code !== "Space" || event.repeat || paused || !nearby) return;
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
  }, [nearby, paused]);

  const moveTo = useCallback((zone: CampusZone) => {
    moveTarget.current = {
      point: new THREE.Vector3(...zone.approach),
      zoneId: zone.id,
    };
  }, []);

  const reset = useCallback(() => {
    positionRef.current.copy(START);
    moveTarget.current = null;
    setNearby(null);
  }, []);

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
            <button key={zone.id} onClick={() => moveTo(zone)}>{zone.navLabel}</button>
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
