"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  ArrowsInSimple,
  ArrowsOutSimple,
  Barcode,
  CaretDown,
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
  CaretUp,
  CreditCard,
  Crosshair,
  DeviceMobile,
  House,
  List,
  MapTrifold,
  Printer,
  Pulse,
  Robot,
  SpeakerHigh,
  SpeakerSlash,
  UserCircle,
  Waveform,
  X,
} from "@phosphor-icons/react";

type Point = { x: number; y: number };
type WorldBounds = { x: number; y: number; width: number; height: number };
type CampusDisplayMode = "framed" | "expanded";
type RoverState = Point & {
  vx: number;
  vy: number;
  heading: number;
  colliding: boolean;
};

type Landmark = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  summary: string;
  impact: string;
  context: string;
  contribution: string;
  tech: string[];
  outcome: string;
  principle: string;
  x: number;
  y: number;
  artwork: string;
  bounds: WorldBounds;
  approach: Point;
  mapHotspot: Point;
  statusLabel: string;
  tone: "blue" | "mint" | "amber" | "green";
  kind: string;
  details: string[];
};

type RoleLens = {
  id: string;
  label: string;
  title: string;
  summary: string;
  focus: string;
  resume: string;
};

const LANDMARKS: Landmark[] = [
  {
    id: "payments",
    number: "01",
    eyebrow: "ENTERPRISE DEPLOYMENT",
    title: "Payment Terminal Bay",
    shortTitle: "Payment Bay",
    summary:
      "Contactless payments and a four-stage local PIN pad upgrade engineered for distributed production.",
    impact: "800+ locations · zero production failures",
    context:
      "Vendor package constraints required a staged device update path across a live retail estate. The same Android environment also needed dependable Apple Pay and Google Pay support through external payment-terminal workflows.",
    contribution:
      "Helped design and deliver four local upgrade checkpoints, aligning Android behavior, PIN pad constraints, deployment sequencing, and field validation while reducing the need for on-site technician visits.",
    tech: ["Kotlin / Android", "Apple Pay", "Google Pay", "PIN pads", "Staged rollout"],
    outcome:
      "The upgrade reached more than 800 locations with zero production failures.",
    principle: "Production reliability matters more than flashy demos.",
    x: 30,
    y: 20,
    artwork: "/campus/campus-ring-world.webp",
    bounds: { x: 21, y: 9, width: 18, height: 22 },
    approach: { x: 31, y: 35 },
    mapHotspot: { x: 30, y: 24 },
    statusLabel: "4-stage route ready",
    tone: "amber",
    kind: "terminal",
    details: [
      "The local upgrade sequence addressed vendor package constraints without claiming firmware-level work.",
      "Contactless support covered Apple Pay and Google Pay within enterprise Android payment flows.",
      "Risk-aware rollout planning treated production readiness as a system property—not a final QA step.",
    ],
  },
  {
    id: "printers",
    number: "02",
    eyebrow: "DEVICE OPERATIONS",
    title: "Printer Operations Center",
    shortTitle: "Printer Ops",
    summary:
      "Xerox workflow modernization and real-time printer status-light observability.",
    impact: "Migration redesign + actionable device status",
    context:
      "Enterprise printers expose noisy, vendor-shaped status data. The useful product is not the raw signal—it is a reliable operational interpretation.",
    contribution:
      "Modernized the Android/Xerox application path and built real-time status-light monitoring in Splunk, surfacing issue duration and frequency.",
    tech: ["Kotlin", "Android 13", "Xerox devices", "Splunk", "Telemetry"],
    outcome:
      "Gave technical teams and management a clearer view of device health and faster evidence for production troubleshooting.",
    principle: "Device data becomes valuable when people can act on it.",
    x: 63,
    y: 19,
    artwork: "/campus/printer-ops-preview.webp",
    bounds: { x: 54, y: 8, width: 19, height: 23 },
    approach: { x: 64, y: 35 },
    mapHotspot: { x: 63, y: 24 },
    statusLabel: "Telemetry connected",
    tone: "blue",
    kind: "printer",
    details: [
      "Migration flow and status observability are presented as related, distinct case studies.",
      "Signal interpretation was designed around support and production diagnosis.",
      "The application layer translated device behavior into understandable states.",
    ],
  },
  {
    id: "scanner",
    number: "03",
    eyebrow: "AUTOMATION",
    title: "Scanner Automation Garage",
    shortTitle: "Scanner Garage",
    summary:
      "A greenfield Kotlin Android application that automated POS testing through real hardware.",
    impact: "65 test cases · +55% automation · 1st place",
    context:
      "A company hackathon created room to replace repetitive POS validation with a practical device-driven automation workflow.",
    contribution:
      "Built the company’s first Kotlin Android application, using a self-hosted local server on a tablet to connect a barcode scanner and POS terminal into a repeatable test lane.",
    tech: ["Kotlin", "Jetpack Compose", "MVVM", "Coroutines", "NanoHttpd", "LiveData"],
    outcome:
      "Automated 65 POS test cases, increased POS automation by 55%, and placed first in the 2025 company hackathon. The application was later maintained by a 4–8 engineer team.",
    principle: "A prototype becomes valuable when another engineer can maintain it.",
    x: 78,
    y: 39,
    artwork: "/campus/campus-ring-world.webp",
    bounds: { x: 69, y: 29, width: 20, height: 21 },
    approach: { x: 68, y: 45 },
    mapHotspot: { x: 78, y: 39 },
    statusLabel: "65 tests available",
    tone: "green",
    kind: "scanner",
    details: [
      "Greenfield architecture balanced hackathon speed with a maintainable handoff.",
      "A tablet-hosted local server coordinated physical scan events and repeatable checkpoints.",
      "The later 4–8 engineer maintenance team is the strongest signal of durability.",
    ],
  },
  {
    id: "tabtally",
    number: "04",
    eyebrow: "PERSONAL PRODUCT",
    title: "TabTally Mobile Lab",
    shortTitle: "TabTally Lab",
    summary:
      "A Kotlin Multiplatform receipt-splitting product exploring OCR, AI-assisted parsing, and shared UI.",
    impact: "Capture → parse → review → assign → split",
    context:
      "Splitting a detailed receipt is a compact systems problem: capture imperfect input, create structured data, keep people in control, then calculate a trustworthy result.",
    contribution:
      "Designed the end-to-end product flow and application architecture with Kotlin Multiplatform and Compose Multiplatform.",
    tech: ["Kotlin Multiplatform", "Compose Multiplatform", "OCR", "AI-assisted parsing"],
    outcome:
      "A focused personal project that demonstrates cross-platform product thinking and human-in-the-loop AI design.",
    principle: "AI should accelerate review, not remove user control.",
    x: 72,
    y: 69,
    artwork: "/campus/campus-ring-world.webp",
    bounds: { x: 63, y: 59, width: 20, height: 22 },
    approach: { x: 66, y: 64 },
    mapHotspot: { x: 72, y: 69 },
    statusLabel: "Processing flow online",
    tone: "mint",
    kind: "mobile",
    details: [
      "Receipt capture creates the source image for OCR.",
      "AI-assisted parsing proposes structure; item review keeps the user in control.",
      "Participant assignment feeds the final split calculation.",
      "No screenshots or app-store claims are shown because none were supplied.",
    ],
  },
  {
    id: "observability",
    number: "05",
    eyebrow: "PRODUCTION HEALTH",
    title: "Observability Tower",
    shortTitle: "Observability",
    summary:
      "Splunk dashboards and production diagnosis that turn hardware behavior into actionable information.",
    impact: "Telemetry → context → production action",
    context:
      "Device fleets fail in physical environments, across networks, and at the edges of application assumptions. Diagnosis needs context across those boundaries.",
    contribution:
      "Built operational views that connect printer and device telemetry to time, location, application behavior, and production impact.",
    tech: ["Splunk", "Dashboards", "Production diagnosis", "Device telemetry"],
    outcome:
      "Made production health easier to inspect and hardware problems faster to reason about.",
    principle: "Observability is a product for the people operating the system.",
    x: 50,
    y: 45,
    artwork: "/campus/campus-ring-world.webp",
    bounds: { x: 43, y: 31, width: 14, height: 27 },
    approach: { x: 50, y: 66 },
    mapHotspot: { x: 50, y: 45 },
    statusLabel: "Production health live",
    tone: "blue",
    kind: "tower",
    details: [
      "Useful dashboards start from operational questions, not available fields.",
      "Time-series context helps separate transient signals from recurring patterns.",
      "Device and application evidence belong in one diagnostic story.",
    ],
  },
  {
    id: "robotics",
    number: "06",
    eyebrow: "FUTURE DIRECTION",
    title: "Robotics Applications Dock",
    shortTitle: "Robotics Dock",
    summary:
      "Application-layer robotics at the intersection of Android, Linux, networking, sensors, and human-machine interfaces.",
    impact: "Application layer · interfaces · automation",
    context:
      "Industrial and mobile robots need application experiences that make sensor-rich, networked machines useful to operators.",
    contribution:
      "Bringing an enterprise Android and device-integration perspective to control surfaces, operational interfaces, networked workflows, and automation.",
    tech: ["Android", "Linux", "Networking", "Sensors", "HMI"],
    outcome:
      "A clear next direction: application-layer robotics—not firmware, assembly, or low-level embedded development.",
    principle: "The best machine interface makes complex behavior feel dependable.",
    x: 29,
    y: 70,
    artwork: "/campus/campus-ring-world.webp",
    bounds: { x: 19, y: 59, width: 21, height: 23 },
    approach: { x: 35, y: 64 },
    mapHotspot: { x: 29, y: 70 },
    statusLabel: "HMI dock available",
    tone: "green",
    kind: "robot",
    details: [
      "Primary interest: application-layer behavior and operator experience.",
      "Strong fit: Android/Linux interfaces, networking, sensors, and automation.",
      "Explicitly out of scope: firmware, physical assembly, and low-level embedded work.",
    ],
  },
  {
    id: "profile",
    number: "07",
    eyebrow: "ENGINEER PROFILE",
    title: "Engineer Profile Station",
    shortTitle: "Profile",
    summary:
      "Anas Ahmed is an Enterprise Android Engineer building dependable software around real devices.",
    impact: "Greater Boston · remote-first",
    context:
      "My work sits where applications meet payment terminals, printers, scanners, observability systems, and operational teams.",
    contribution:
      "I connect product thinking, Android engineering, hardware behavior, and production reliability.",
    tech: ["Kotlin", "Android", "Device integration", "Systems thinking"],
    outcome:
      "Open to enterprise Android and application-layer robotics opportunities.",
    principle: "The best device integration is the kind users never notice.",
    x: 18,
    y: 47,
    artwork: "/campus/campus-ring-world.webp",
    bounds: { x: 9, y: 36, width: 20, height: 22 },
    approach: { x: 32, y: 49 },
    mapHotspot: { x: 18, y: 47 },
    statusLabel: "Profile station online",
    tone: "mint",
    kind: "profile",
    details: [
      "Verified email, phone, LinkedIn, and GitHub links are available in Recruiter Mode.",
      "Professional experience spans Staples, General Motors, and Syntax Tutoring.",
      "Use Recruiter Mode for the complete text-based portfolio.",
      "Downloadable role-targeted résumé variants are available.",
    ],
  },
];

const SKILLS = [
  "Kotlin",
  "Java",
  "JavaScript",
  "Swift",
  "Python",
  "SQL",
  "Android",
  "Jetpack Compose",
  "Coroutines",
  "MVVM",
  "LiveData",
  "RxJava",
  "Retrofit",
  "Gradle",
  "React Native",
  "Hardware SDK/API integration",
  "Local networking",
  "NanoHttpd",
  "Jenkins",
  "Azure DevOps",
  "Firebase",
  "Splunk",
];

const ROLE_LENSES: RoleLens[] = [
  {
    id: "enterprise",
    label: "Enterprise devices",
    title: "Enterprise Android Engineer · Hardware-Integrated Mobile Systems",
    summary: "Android engineer specializing in enterprise systems that connect applications and tablets with printers, scanners, payment terminals, and store networks.",
    focus: "Kotlin modernization · hardware SDK/API integration · production reliability",
    resume: "/resumes/Anas_Ahmed_Enterprise_Android_Hardware.pdf",
  },
  {
    id: "payments",
    label: "Payments & POS",
    title: "Android Payments / POS Device Integration Engineer",
    summary: "Production experience across contactless payments, PIN pads, POS scanner automation, printers, and distributed retail device ecosystems.",
    focus: "Apple Pay · Google Pay · PIN pads · retail device rollouts",
    resume: "/resumes/Anas_Ahmed_Payments_POS_Device_Integration.pdf",
  },
  {
    id: "robotics",
    label: "Robotics & HMI",
    title: "Android HMI / Robotics Software Engineer",
    summary: "Application-layer Android engineer focused on operator-facing software that connects people to physical systems through device communication, networking, automation, and observability.",
    focus: "Application layer · HMI · device systems · industrial reliability",
    resume: "/resumes/Anas_Ahmed_Robotics_HMI_Industrial.pdf",
  },
  {
    id: "logistics",
    label: "Logistics & IoT",
    title: "Android Logistics / Warehouse Automation Engineer",
    summary: "Android engineer focused on tablet-based operational software, scanner automation, local networking, and hardware-integrated field workflows.",
    focus: "Tablets · scanners · edge apps · local networking",
    resume: "/resumes/Anas_Ahmed_Logistics_Warehouse_IoT.pdf",
  },
  {
    id: "platform",
    label: "Android platform",
    title: "Senior Android Engineer · Kotlin, Architecture & Mobile Platform",
    summary: "Senior Android engineer modernizing Java systems to Kotlin, shaping maintainable architecture, and supporting enterprise-scale production applications.",
    focus: "Kotlin · architecture · CI/CD · mobile observability",
    resume: "/resumes/Anas_Ahmed_Senior_Android_Platform.pdf",
  },
  {
    id: "ai",
    label: "Mobile AI",
    title: "Mobile Engineer · Android, AI Integration & Product Systems",
    summary: "Mobile engineer combining Android/Kotlin production experience with practical OCR, AI-assisted extraction, Firebase, and cross-platform product work.",
    focus: "OCR · AI APIs · Firebase · cross-platform products",
    resume: "/resumes/Anas_Ahmed_Mobile_AI_Integration.pdf",
  },
  {
    id: "healthcare",
    label: "Medical devices",
    title: "Android Medical Device / Enterprise Device Software Engineer",
    summary: "Reliability-focused Android engineer experienced in device communication, observability, maintainable architecture, and troubleshooting near the hardware/software boundary.",
    focus: "Reliability · device monitoring · hardware SDK/API integration",
    resume: "/resumes/Anas_Ahmed_Healthcare_Medical_Device.pdf",
  },
  {
    id: "lead",
    label: "Lead mobile",
    title: "Lead Mobile Engineer · Technical Ownership & Enterprise Android",
    summary: "Mobile engineer positioned for senior ownership roles requiring independent delivery, cross-functional collaboration, and end-to-end Android systems thinking.",
    focus: "Architecture · delivery ownership · mentoring · production systems",
    resume: "/resumes/Anas_Ahmed_Lead_Mobile_Engineer.pdf",
  },
];

function playSignal(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(680, context.currentTime + 0.08);
  gain.gain.setValueAtTime(0.035, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
  oscillator.addEventListener("ended", () => context.close());
}

const ROVER_START: RoverState = {
  x: 50,
  y: 73,
  vx: 0,
  vy: 0,
  heading: 0,
  colliding: false,
};

function LandmarkGlyph({ kind, size = 22 }: { kind: string; size?: number }) {
  const props = { size, weight: "duotone" as const, "aria-hidden": true };
  if (kind === "terminal") return <CreditCard {...props} />;
  if (kind === "printer") return <Printer {...props} />;
  if (kind === "scanner") return <Barcode {...props} />;
  if (kind === "mobile") return <DeviceMobile {...props} />;
  if (kind === "tower") return <Pulse {...props} />;
  if (kind === "robot") return <Robot {...props} />;
  return <UserCircle {...props} />;
}

function isRoverPositionAllowed(position: Point) {
  if (position.x < 5 || position.x > 95 || position.y < 6 || position.y > 95) {
    return false;
  }
  const dx = position.x - 50;
  const dy = (position.y - 49) * 1.08;
  const ringDistance = Math.hypot(dx, dy);
  const onServiceRing = ringDistance >= 19 && ringDistance <= 37;
  const onEntryLane =
    position.x >= 45 && position.x <= 55 && position.y >= 48 && position.y <= 95;
  const onApproachPad = LANDMARKS.some(
    (landmark) =>
      Math.hypot(
        landmark.approach.x - position.x,
        landmark.approach.y - position.y,
      ) < 7.5,
  );
  return onServiceRing || onEntryLane || onApproachPad;
}

export default function PortfolioExperience({
  initialMode,
}: {
  initialMode: "campus" | "recruiter";
}) {
  const [mode, setMode] = useState<"intro" | "campus" | "recruiter">(
    initialMode,
  );
  const [active, setActive] = useState<Landmark | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [campusDisplay, setCampusDisplay] =
    useState<CampusDisplayMode>("expanded");
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [rover, setRover] = useState<RoverState>(ROVER_START);
  const [roverPaused, setRoverPaused] = useState(false);
  const [roleLens, setRoleLens] = useState("enterprise");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const pressedKeys = useRef(new Set<string>());

  useEffect(() => {
    let storedVisited: string[] = [];
    try {
      const stored = localStorage.getItem("anas-campus-visited");
      if (stored) storedVisited = JSON.parse(stored);
    } catch {
      // The experience works without local storage.
    }
    const reducedPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const frame = window.requestAnimationFrame(() => {
      setVisited(storedVisited);
      setReduced(reducedPreference);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("anas-campus-visited", JSON.stringify(visited));
    } catch {
      // Progress is optional.
    }
  }, [visited]);

  const openLandmark = useCallback(
    (landmark: Landmark) => {
      previousFocus.current = document.activeElement as HTMLElement;
      setActive(landmark);
      setDrawerOpen(true);
      setRoverPaused(true);
      setVisited((current) =>
        current.includes(landmark.id) ? current : [...current, landmark.id],
      );
      playSignal(!muted);
    },
    [muted],
  );

  const closeLandmark = useCallback(() => {
    setActive(null);
    setRoverPaused(false);
    window.setTimeout(() => previousFocus.current?.focus(), 0);
  }, []);

  const resetCampus = useCallback(() => {
    setRover(ROVER_START);
    setVisited([]);
    setMapOpen(false);
    playSignal(!muted);
  }, [muted]);

  useEffect(() => {
    if (mode !== "campus" || roverPaused) return;
    let frame = 0;
    let previousTime = performance.now();
    const move = (time: number) => {
      const frameScale = Math.min(2, (time - previousTime) / 16.67);
      previousTime = time;
      const keys = pressedKeys.current;
      const dx =
        (keys.has("arrowright") || keys.has("d") ? 1 : 0) -
        (keys.has("arrowleft") || keys.has("a") ? 1 : 0);
      const dy =
        (keys.has("arrowdown") || keys.has("s") ? 1 : 0) -
        (keys.has("arrowup") || keys.has("w") ? 1 : 0);
      setRover((position) => {
        const acceleration = reduced ? 0.045 : 0.032;
        const friction = dx || dy ? 0.9 : 0.78;
        let vx = (position.vx + dx * acceleration * frameScale) * friction;
        let vy = (position.vy + dy * acceleration * frameScale) * friction;
        const speed = Math.hypot(vx, vy);
        const maxSpeed = reduced ? 0.38 : 0.58;
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }
        if (Math.abs(vx) < 0.004) vx = 0;
        if (Math.abs(vy) < 0.004) vy = 0;
        const candidate = {
          x: position.x + vx * frameScale,
          y: position.y + vy * frameScale,
        };
        const allowed = isRoverPositionAllowed(candidate);
        const heading =
          dx || dy || speed > 0.02
            ? (Math.atan2(vy || dy, vx || dx) * 180) / Math.PI + 90
            : position.heading;
        return allowed
          ? { ...candidate, vx, vy, heading, colliding: false }
          : { ...position, vx: 0, vy: 0, heading, colliding: true };
      });
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [mode, reduced, roverPaused]);

  const nearby = useMemo(() => {
    const nearest = LANDMARKS.map((landmark) => ({
      landmark,
      distance: Math.hypot(
        landmark.approach.x - rover.x,
        landmark.approach.y - rover.y,
      ),
    })).sort((a, b) => a.distance - b.distance)[0];
    return nearest.distance < 8 ? nearest.landmark : null;
  }, [rover.x, rover.y]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (active && key === "escape") {
        event.preventDefault();
        closeLandmark();
        return;
      }
      if (mode !== "campus" || active) return;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
        pressedKeys.current.add(key);
      }
      if (key === "m") {
        event.preventDefault();
        setMapOpen((value) => !value);
      }
      if (key === "r") {
        event.preventDefault();
        setRover(ROVER_START);
      }
      if (key === "enter" && nearby) {
        event.preventDefault();
        openLandmark(nearby);
      }
    };
    const onKeyUp = (event: KeyboardEvent) =>
      pressedKeys.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [active, closeLandmark, mode, nearby, openLandmark]);

  useEffect(() => {
    if (!active || !dialogRef.current) return;
    dialogRef.current.focus();
  }, [active]);

  const discovered = visited.length;
  const completion = Math.round((discovered / LANDMARKS.length) * 100);
  const activeLens = ROLE_LENSES.find((lens) => lens.id === roleLens) ?? ROLE_LENSES[0];

  const moveRover = (dx: number, dy: number) => {
    if (roverPaused) return;
    setRover((position) => ({
      ...(isRoverPositionAllowed({
        x: position.x + dx,
        y: position.y + dy,
      })
        ? {
            x: position.x + dx,
            y: position.y + dy,
            colliding: false,
          }
        : { x: position.x, y: position.y, colliding: true }),
      vx: 0,
      vy: 0,
      heading: (Math.atan2(dy, dx) * 180) / Math.PI + 90,
    }));
  };
  const leaveCampus = (destination: "intro" | "recruiter") => {
    setActive(null);
    setRoverPaused(false);
    window.location.assign(destination === "recruiter" ? "/recruiter/" : "/");
  };

  const tabTallyFlow = useMemo(
    () => ["Capture receipt", "OCR", "AI-assisted parsing", "Item review", "Participant assignment", "Calculated split"],
    [],
  );
  const cameraStyle = {
    "--camera-x": `${(50 - rover.x) * 0.08}%`,
    "--camera-y": `${(50 - rover.y) * 0.06}%`,
    "--camera-scale": campusDisplay === "expanded" ? "1.075" : "1.02",
  } as CSSProperties;

  return (
    <main
      className={`${reduced ? "reduced-effects" : ""} ${
        active && mode !== "campus" ? "modal-open" : ""
      } ${mode === "campus" ? "campus-active" : ""}`}
    >
      <a className="skip-link" href="#portfolio-content">
        Skip interactive campus
      </a>
      <noscript>
        <section className="noscript-resume">
          <p>ANAS AHMED · ENTERPRISE ANDROID ENGINEER</p>
          <h1>Dependable applications for real devices.</h1>
          <p>
            Greater Boston · Remote-first. Enterprise Android experience across payment terminals,
            printers, barcode scanners, POS automation, Splunk observability, and mobile platform tooling.
          </p>
          <ul>
            <li>Software Engineer II, Mobile at Staples (2022–present); previously Sr. Mobile Device Software Developer at General Motors.</li>
            <li>Owned a Java/Android 7 to Kotlin/Android 13 modernization for hardware-integrated retail workflows.</li>
            <li>Payment terminal upgrade: 800+ locations with zero production failures.</li>
            <li>Scanner automation: 65 POS tests, 55% automation increase, first place in the 2025 company hackathon.</li>
            <li>TabTally: Kotlin Multiplatform receipt capture, OCR, AI-assisted parsing, review, assignment, and split calculation.</li>
            <li>Future direction: application-layer robotics, Android/Linux interfaces, networking, sensors, and automation.</li>
          </ul>
          <p>Email: anas.ahmed10@outlook.com · Phone: 774-300-7831 · GitHub: github.com/anasahmed10 · LinkedIn: linkedin.com/in/anas-ahmed-28b391166</p>
        </section>
      </noscript>

      {mode !== "campus" && <header className="site-header">
        <a className="brand-lockup" href="/" aria-label="Return to home">
          <span className="brand-mark" aria-hidden="true">AA</span>
          <span>
            <strong>Anas Ahmed</strong>
            <small>Enterprise Android Engineer</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/campus/">Campus</a>
          <a className={mode === "recruiter" ? "active" : ""} href="/recruiter/">Recruiter view</a>
          <a href="/products/">Products</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>}

      {mode === "intro" && (
        <section className="intro-screen" aria-labelledby="intro-title">
          <div className="intro-grid" aria-hidden="true" />
          <div className="intro-copy">
            <p className="system-kicker"><span /> SYSTEMS CAMPUS · ONLINE</p>
            <h1 id="intro-title">Engineering where software meets the real world.</h1>
            <p className="intro-lede">
              I’m Anas Ahmed, an Enterprise Android Engineer building dependable applications around payments,
              printers, scanners, telemetry, and the people who operate them.
            </p>
            <p className="intro-invitation">Explore the campus, or jump straight to my experience.</p>
            <div className="intro-actions">
              <button className="primary-action" onClick={() => setMode("campus")}>
                Explore the systems campus <span aria-hidden="true">→</span>
              </button>
              <button className="secondary-action" onClick={() => setMode("recruiter")}>
                View résumé and experience
              </button>
            </div>
            <div className="intro-metrics" aria-label="Career impact highlights">
              <div><strong>800+</strong><span>production locations</span></div>
              <div><strong>65</strong><span>automated POS tests</span></div>
              <div><strong>0</strong><span>upgrade failures</span></div>
            </div>
          </div>

          <div className="campus-preview" aria-label="Abstract preview of the Enterprise Systems Campus">
            <div className="preview-orbit orbit-one" />
            <div className="preview-orbit orbit-two" />
            <div className="preview-core">
              <span>APPLICATION</span>
              <strong>LAYER</strong>
              <small>7 connected systems</small>
            </div>
            {["POS", "PRINT", "SCAN", "MOBILE", "OPS", "ROBOT"].map((label, index) => (
              <div key={label} className={`preview-node node-${index + 1}`}>
                <i />
                <span>{label}</span>
              </div>
            ))}
            <div className="preview-scanline" />
          </div>
        </section>
      )}

      {mode === "campus" && (
        <section
          className={`campus-shell campus-${campusDisplay}`}
          aria-labelledby="campus-title"
        >
          <h1 id="campus-title" className="sr-only">
            Enterprise Systems Campus
          </h1>
          <div className="campus-frame-title">
            <button onClick={() => leaveCampus("intro")}>
              <House size={18} weight="duotone" aria-hidden />
              <span>Anas Ahmed</span>
            </button>
            <p>Enterprise Systems Campus</p>
            <button onClick={() => leaveCampus("recruiter")}>Recruiter mode</button>
          </div>

          <div
            className="campus-world"
            role="application"
            aria-label="Interactive 2.5D industrial campus. Use W A S D or arrow keys to steer the service rover around the signal ring. Press Enter near a landmark to inspect it."
          >
            <div className="campus-camera" style={cameraStyle}>
              <div
                className="world-art"
                aria-hidden="true"
                style={{
                  backgroundImage: 'url("/campus/campus-ring-world.webp")',
                }}
              />

              {LANDMARKS.map((landmark) => {
                const isVisited = visited.includes(landmark.id);
                const isNearby = nearby?.id === landmark.id;
                return (
                  <button
                    key={landmark.id}
                    className={`landmark-marker tone-${landmark.tone} ${
                      isVisited ? "visited" : ""
                    } ${isNearby ? "nearby" : ""}`}
                    style={{
                      left: `${landmark.mapHotspot.x}%`,
                      top: `${landmark.mapHotspot.y}%`,
                    }}
                    onClick={() => openLandmark(landmark)}
                    aria-label={`${landmark.title}. ${landmark.impact}. ${
                      isVisited ? "Visited." : "Not yet visited."
                    }`}
                  >
                    <span className="marker-icon">
                      <LandmarkGlyph kind={landmark.kind} />
                    </span>
                    <span className="marker-copy">
                      <small>{landmark.number}</small>
                      <strong>{landmark.shortTitle}</strong>
                      <i>{landmark.statusLabel}</i>
                    </span>
                  </button>
                );
              })}

              <div
                className={`service-rover ${roverPaused ? "paused" : ""} ${
                  rover.colliding ? "colliding" : ""
                }`}
                style={{
                  left: `${rover.x}%`,
                  top: `${rover.y}%`,
                  transform: `translate(-50%, -50%) rotate(${rover.heading}deg)`,
                }}
                aria-hidden="true"
              >
                <img src="/campus/service-rover.png" alt="" />
                <i />
              </div>
            </div>

            <div className="campus-toolbar">
              <div className="campus-brand-actions">
                <button
                  className="campus-home"
                  onClick={() => leaveCampus("intro")}
                  aria-label="Return to introduction"
                >
                  <House size={18} weight="duotone" aria-hidden />
                </button>
                <div className="live-indicator">
                  <i /> LIVE CAMPUS
                </div>
              </div>
              <div className="toolbar-actions">
                <button
                  onClick={() => setMapOpen((value) => !value)}
                  aria-expanded={mapOpen}
                >
                  <MapTrifold size={18} weight="duotone" aria-hidden />
                  <span>Map</span>
                  <kbd>M</kbd>
                </button>
                <button onClick={() => setMuted((value) => !value)}>
                  {muted ? (
                    <SpeakerSlash size={18} weight="duotone" aria-hidden />
                  ) : (
                    <SpeakerHigh size={18} weight="duotone" aria-hidden />
                  )}
                  <span>{muted ? "Sound off" : "Sound on"}</span>
                </button>
                <button onClick={() => setReduced((value) => !value)}>
                  <Waveform size={18} weight="duotone" aria-hidden />
                  <span>{reduced ? "Effects off" : "Effects on"}</span>
                </button>
                <button onClick={resetCampus}>
                  <ArrowCounterClockwise
                    size={18}
                    weight="duotone"
                    aria-hidden
                  />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() =>
                    setCampusDisplay((value) =>
                      value === "expanded" ? "framed" : "expanded",
                    )
                  }
                  aria-label={
                    campusDisplay === "expanded"
                      ? "Collapse campus frame"
                      : "Expand campus to full screen"
                  }
                >
                  {campusDisplay === "expanded" ? (
                    <ArrowsInSimple size={19} weight="duotone" aria-hidden />
                  ) : (
                    <ArrowsOutSimple size={19} weight="duotone" aria-hidden />
                  )}
                </button>
              </div>
              <div
                className="campus-progress"
                aria-label={`${discovered} of ${LANDMARKS.length} systems connected`}
              >
                <span>SYSTEMS CONNECTED</span>
                <strong>
                  {discovered}/{LANDMARKS.length}
                </strong>
                <i>
                  <b style={{ width: `${completion}%` }} />
                </i>
              </div>
            </div>

            {!drawerOpen && (
              <button
                className="drawer-toggle"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open systems drawer"
              >
                <List size={22} weight="duotone" aria-hidden />
                <CaretDoubleLeft size={17} weight="bold" aria-hidden />
              </button>
            )}

            <aside
              className={`systems-drawer ${drawerOpen ? "open" : ""} ${
                active ? "inspecting" : ""
              }`}
              aria-labelledby="systems-drawer-title"
            >
              <div className="drawer-header">
                <div>
                  <small>{active ? "SYSTEM INSPECTION" : "DIRECT ACCESS"}</small>
                  <h2 id="systems-drawer-title">
                    {active ? active.shortTitle : "Systems index"}
                  </h2>
                </div>
                <button
                  onClick={() =>
                    active ? closeLandmark() : setDrawerOpen(false)
                  }
                  aria-label={active ? "Close case study" : "Close systems drawer"}
                >
                  {active ? (
                    <X size={20} weight="bold" aria-hidden />
                  ) : (
                    <CaretDoubleRight size={20} weight="bold" aria-hidden />
                  )}
                </button>
              </div>

              {active ? (
                <div
                  className="inspection-panel"
                  role="dialog"
                  aria-modal="false"
                  aria-labelledby="inspection-title"
                  tabIndex={-1}
                  ref={dialogRef}
                >
                  {active.id === "printers" && (
                    <img
                      src={active.artwork}
                      alt="Enterprise printer and telemetry displays in the Printer Operations Center"
                    />
                  )}
                  <div className="inspection-status">
                    <span>
                      <i /> Connected
                    </span>
                    <small>{active.number} · {active.eyebrow}</small>
                  </div>
                  <h3 id="inspection-title">{active.title}</h3>
                  <p>{active.summary}</p>
                  <strong>{active.impact}</strong>
                  <section>
                    <span>CONTRIBUTION</span>
                    <p>{active.contribution}</p>
                  </section>
                  <section>
                    <span>OUTCOME</span>
                    <p>{active.outcome}</p>
                  </section>
                  <div className="inspection-tech">
                    {active.tech.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <details>
                    <summary>Technical details</summary>
                    <ul>
                      {active.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </details>
                  <blockquote>“{active.principle}”</blockquote>
                  {active.id === "tabtally" && (
                    <a className="inspection-product-link" href="/products/tabtally/">
                      View the complete TabTally product story
                    </a>
                  )}
                  <button className="inspection-close" onClick={closeLandmark}>
                    Back to campus
                  </button>
                </div>
              ) : (
                <>
                  <p className="drawer-intro">
                    Every case study is available without driving.
                  </p>
                  <div className="systems-list">
                    {LANDMARKS.map((landmark) => {
                      const isVisited = visited.includes(landmark.id);
                      return (
                        <button
                          key={landmark.id}
                          onClick={() => openLandmark(landmark)}
                          className={isVisited ? "visited" : ""}
                        >
                          <span>{landmark.number}</span>
                          <i>
                            <LandmarkGlyph kind={landmark.kind} size={20} />
                          </i>
                          <div>
                            <strong>{landmark.shortTitle}</strong>
                            <small>{landmark.eyebrow}</small>
                          </div>
                          <b aria-hidden="true">
                            {isVisited ? (
                              <Pulse size={15} weight="fill" />
                            ) : (
                              <ArrowRight size={16} weight="bold" />
                            )}
                          </b>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="recruiter-jump"
                    onClick={() => leaveCampus("recruiter")}
                  >
                    <span>SHORT ON TIME?</span>
                    <strong>
                      Open recruiter mode
                      <ArrowRight size={16} weight="bold" aria-hidden />
                    </strong>
                  </button>
                </>
              )}
            </aside>

            {nearby && !active && (
              <button
                className="interaction-prompt"
                onClick={() => openLandmark(nearby)}
              >
                <Crosshair size={17} weight="duotone" aria-hidden />
                <kbd>Enter</kbd>
                Inspect {nearby.shortTitle}
              </button>
            )}

            {mapOpen && (
              <aside className="map-overlay" aria-label="Campus map">
                <div className="map-header">
                  <div>
                    <small>CAMPUS MAP</small>
                    <strong>{completion}% DISCOVERED</strong>
                  </div>
                  <button
                    onClick={() => setMapOpen(false)}
                    aria-label="Close campus map"
                  >
                    <X size={22} weight="bold" aria-hidden />
                  </button>
                </div>
                <div
                  className="illustrated-map"
                  style={{
                    backgroundImage: 'url("/campus/campus-ring-world.webp")',
                  }}
                >
                  {LANDMARKS.map((landmark) => (
                    <button
                      key={landmark.id}
                      className={
                        visited.includes(landmark.id) ? "visited" : ""
                      }
                      style={{
                        left: `${landmark.mapHotspot.x}%`,
                        top: `${landmark.mapHotspot.y}%`,
                      }}
                      onClick={() => openLandmark(landmark)}
                      aria-label={`Open ${landmark.title}`}
                    >
                      <LandmarkGlyph kind={landmark.kind} size={18} />
                      <span>{landmark.number}</span>
                    </button>
                  ))}
                  <i
                    className="mini-rover"
                    style={{ left: `${rover.x}%`, top: `${rover.y}%` }}
                  />
                </div>
              </aside>
            )}

            {helpOpen && (
              <div className="help-card">
                <button
                  onClick={() => setHelpOpen(false)}
                  aria-label="Dismiss exploration help"
                >
                  <X size={16} weight="bold" aria-hidden />
                </button>
                <small>HOW TO EXPLORE</small>
                <div>
                  <kbd>WASD</kbd>
                  <span>or arrows to steer</span>
                </div>
                <div>
                  <kbd>Enter</kbd>
                  <span>inspect a nearby system</span>
                </div>
                <div>
                  <kbd>M</kbd>
                  <span>map</span>
                  <kbd>R</kbd>
                  <span>return rover</span>
                </div>
              </div>
            )}

            <div className="mobile-controls" aria-label="Touch rover controls">
              <button
                onPointerDown={() => moveRover(0, -3)}
                aria-label="Move rover up"
              >
                <CaretUp size={22} weight="bold" aria-hidden />
              </button>
              <div>
                <button
                  onPointerDown={() => moveRover(-3, 0)}
                  aria-label="Move rover left"
                >
                  <CaretLeft size={22} weight="bold" aria-hidden />
                </button>
                <button
                  onClick={() => nearby && openLandmark(nearby)}
                  disabled={!nearby}
                  aria-label="Interact with nearby landmark"
                >
                  <Crosshair size={22} weight="duotone" aria-hidden />
                </button>
                <button
                  onPointerDown={() => moveRover(3, 0)}
                  aria-label="Move rover right"
                >
                  <CaretRight size={22} weight="bold" aria-hidden />
                </button>
              </div>
              <button
                onPointerDown={() => moveRover(0, 3)}
                aria-label="Move rover down"
              >
                <CaretDown size={22} weight="bold" aria-hidden />
              </button>
            </div>
          </div>
        </section>
      )}

      {mode === "recruiter" && (
        <section id="portfolio-content" className="resume-view" aria-labelledby="resume-title">
          <div className="resume-topbar">
            <p><i /> RECRUITER MODE · ALL ESSENTIAL INFORMATION</p>
            <div>
              <a href={activeLens.resume} download>Download tailored résumé</a>
              <a href="/campus/">Explore campus</a>
              <a href="/products/">View products</a>
            </div>
          </div>

          <section className="role-lens-panel" aria-labelledby="role-lens-title">
            <div className="lens-intro">
              <small>ROLE-ADAPTIVE PROFILE</small>
              <h2 id="role-lens-title">What are you hiring for?</h2>
              <p>Select a lens to see the most relevant positioning and résumé. The underlying experience stays the same.</p>
            </div>
            <div className="lens-controls" role="tablist" aria-label="Choose a role focus">
              {ROLE_LENSES.map((lens) => (
                <button
                  key={lens.id}
                  role="tab"
                  aria-selected={roleLens === lens.id}
                  className={roleLens === lens.id ? "active" : ""}
                  onClick={() => setRoleLens(lens.id)}
                >
                  {lens.label}
                </button>
              ))}
            </div>
            <div className="lens-readout" role="tabpanel">
              <div>
                <span>CURRENT LENS</span>
                <strong>{activeLens.title}</strong>
                <p>{activeLens.summary}</p>
                <small>{activeLens.focus}</small>
              </div>
              <a href={activeLens.resume} download>Download {activeLens.label} résumé <span aria-hidden="true">↓</span></a>
            </div>
          </section>

          <div className="resume-hero">
            <div className="resume-identity">
              <p className="system-kicker"><span /> ANDROID · PHYSICAL SYSTEMS · PRODUCTION</p>
              <h1 id="resume-title">Anas Ahmed</h1>
              <h2>{activeLens.title}</h2>
              <p>{activeLens.summary}</p>
              <div className="resume-actions">
                <a href="#experience">View experience</a>
                <a href="mailto:anas.ahmed10@outlook.com">Email Anas</a>
                <a href={activeLens.resume} download>Download résumé</a>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-monogram" aria-label="Headshot not provided; Anas Ahmed monogram shown">AA</div>
              <div>
                <span>BASED IN</span><strong>Greater Boston</strong>
                <span>WORK STYLE</span><strong>Remote-first</strong>
                <span>EXPERIENCE</span><strong>Staples · General Motors</strong>
                <span>EDUCATION</span><strong>B.S. Computer Science</strong>
              </div>
            </div>
          </div>

          <div className="impact-strip" aria-label="Selected impact">
            <div><strong>800+</strong><span>locations upgraded</span></div>
            <div><strong>0</strong><span>production failures</span></div>
            <div><strong>65</strong><span>automated POS tests</span></div>
            <div><strong>+55%</strong><span>POS automation</span></div>
            <div><strong>1st</strong><span>2025 company hackathon</span></div>
            <div><strong>7→13</strong><span>Android modernization</span></div>
          </div>

          <div className="resume-grid">
            <div className="resume-main">
              <section id="experience" className="resume-section">
                <div className="section-label"><span>01</span><p>Career timeline</p></div>
                <div className="career-timeline">
                  <article>
                    <div className="career-meta"><span>2022—PRESENT</span><small>FRAMINGHAM, MA</small></div>
                    <div>
                      <p>STAPLES</p>
                      <h3>Software Engineer II, Mobile</h3>
                      <ul>
                        <li>Owned architecture and primary implementation for a Java/Android 7 to Kotlin/Android 13 modernization, enabling multilingual support plus Google Drive and Dropbox integrations.</li>
                        <li>Delivered Android workflows across Xerox printers, scanners, payment terminals, PIN pads, and store networks supporting deployments across 500–1,000 locations.</li>
                        <li>Implemented Apple Pay and Google Pay support and helped deliver the four-step local PIN pad upgrade across 800+ locations with zero production failures.</li>
                        <li>Built real-time printer status-light monitoring and Splunk dashboards for issue duration, frequency, and faster production diagnosis.</li>
                      </ul>
                    </div>
                  </article>
                  <article>
                    <div className="career-meta"><span>2021—2022</span><small>REMOTE</small></div>
                    <div>
                      <p>GENERAL MOTORS</p>
                      <h3>Sr. Mobile Device Software Developer</h3>
                      <ul>
                        <li>Built an Android/iOS app-size dashboard from Jenkins pipeline data and deployed build/release pipelines in Azure DevOps.</li>
                        <li>Created a Universal Deep Link Handler in React Native to consolidate routing and simplify future mobile development.</li>
                      </ul>
                    </div>
                  </article>
                  <article>
                    <div className="career-meta"><span>2021—2024</span><small>FOXBOROUGH, MA</small></div>
                    <div>
                      <p>SYNTAX TUTORING</p>
                      <h3>Founder and CEO</h3>
                      <ul>
                        <li>Founded a programming tutoring company and designed Android/web curricula, interactive applications, lectures, and hands-on labs.</li>
                      </ul>
                    </div>
                  </article>
                </div>
              </section>

              <section className="resume-section">
                <div className="section-label"><span>02</span><p>Featured systems</p></div>
                <div className="experience-list">
                  {LANDMARKS.slice(0, 3).map((landmark) => (
                    <article key={landmark.id}>
                      <div className={`experience-icon tone-${landmark.tone}`}><i /></div>
                      <div>
                        <small>{landmark.eyebrow}</small>
                        <h3>{landmark.title}</h3>
                        <p>{landmark.summary}</p>
                        <strong>{landmark.impact}</strong>
                        <button onClick={() => openLandmark(landmark)}>Read case study →</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="resume-section">
                <div className="section-label"><span>03</span><p>Featured projects</p></div>
                <div className="project-grid">
                  <article className="tabtally-card">
                    <div className="project-card-head">
                      <span>PERSONAL PRODUCT</span><small>KMP · COMPOSE</small>
                    </div>
                    <h3>TabTally</h3>
                    <p>
                      A multiplatform receipt-splitting flow with human-in-the-loop OCR and AI-assisted parsing.
                    </p>
                    <div className="flow-list" aria-label="TabTally product flow">
                      {tabTallyFlow.map((step, index) => (
                        <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>
                      ))}
                    </div>
                    <a className="project-link" href="/products/tabtally/">View full product story →</a>
                  </article>
                  <article className="robotics-card">
                    <div className="project-card-head">
                      <span>NEXT DIRECTION</span><small>APP LAYER</small>
                    </div>
                    <div className="robotics-diagram" aria-hidden="true">
                      <i className="robot-base" /><i className="robot-sensor" /><i className="robot-signal one" /><i className="robot-signal two" />
                    </div>
                    <h3>Robotics applications</h3>
                    <p>Android/Linux control surfaces, networking, sensors, automation, and human-machine interfaces.</p>
                    <div className="scope-note"><strong>Focus</strong> Application layer, not firmware or assembly.</div>
                    <button onClick={() => openLandmark(LANDMARKS[5])}>View direction →</button>
                  </article>
                </div>
                <div className="additional-projects">
                  <article>
                    <span>MOBILE AI · CROSS-PLATFORM</span>
                    <h3>Split.It</h3>
                    <p>React/Ionic Capacitor receipt splitting with Tesseract.js OCR, Groq API extraction, Firebase services, and a native-style Android/iOS experience.</p>
                    <small>React · Ionic Capacitor · Groq API · Tesseract.js · Firebase</small>
                  </article>
                  <article>
                    <span>ANDROID MARKETPLACE</span>
                    <h3>Yardscape</h3>
                    <p>Android marketplace application for browsing and posting yard-sale listings with authentication, storage, and API-backed workflows.</p>
                    <small>Kotlin · Java · MVVM · Coroutines · Volley · Firebase</small>
                  </article>
                </div>
              </section>
            </div>

            <aside className="resume-sidebar">
              <section className="resume-section">
                <div className="section-label"><span>04</span><p>Technical skills</p></div>
                <div className="skill-cloud">
                  {SKILLS.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </section>
              <section className="resume-section education-card">
                <div className="section-label"><span>05</span><p>Education</p></div>
                <small>UNIVERSITY OF MASSACHUSETTS LOWELL</small>
                <h3>Bachelor of Science in Computer Science</h3>
                <p>Dean’s List Recipient · Lowell, Massachusetts</p>
              </section>
              <section className="resume-section principles">
                <div className="section-label"><span>06</span><p>Engineering principles</p></div>
                <blockquote>“Production reliability matters more than flashy demos.”</blockquote>
                <blockquote>“A prototype becomes valuable when another engineer can maintain it.”</blockquote>
                <blockquote>“The best device integration is the kind users never notice.”</blockquote>
              </section>
            </aside>
          </div>

          <section id="contact" className="contact-panel">
            <div>
              <p className="system-kicker"><span /> CONTACT STATION</p>
              <h2>Let’s build dependable systems around real devices.</h2>
              <p>Greater Boston · Remote-first · Enterprise Android · Application-layer robotics</p>
            </div>
            <div className="contact-links">
              <a href="mailto:anas.ahmed10@outlook.com"><span>Email</span><strong>anas.ahmed10@outlook.com</strong></a>
              <a href="tel:+17743007831"><span>Phone</span><strong>774-300-7831</strong></a>
              <a href="https://www.linkedin.com/in/anas-ahmed-28b391166" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>View profile ↗</strong></a>
              <a href="https://github.com/anasahmed10" target="_blank" rel="noreferrer"><span>GitHub</span><strong>@anasahmed10 ↗</strong></a>
              <a href={activeLens.resume} download><span>Tailored résumé</span><strong>Download {activeLens.label} ↓</strong></a>
            </div>
          </section>
        </section>
      )}

      {active && mode !== "campus" && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeLandmark()}>
          <div
            className="case-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <div className="case-modal-top">
              <div>
                <span>{active.number} · {active.eyebrow}</span>
                <i className={`tone-${active.tone}`} />
              </div>
              <button onClick={closeLandmark} aria-label="Close case study">×</button>
            </div>
            <div className="case-modal-body">
              <div className="case-intro">
                <p>CASE STUDY</p>
                <h2 id="case-title">{active.title}</h2>
                <p>{active.summary}</p>
                <strong>{active.impact}</strong>
              </div>
              <div className="case-facts">
                <section><span>CONTEXT</span><p>{active.context}</p></section>
                <section><span>CONTRIBUTION</span><p>{active.contribution}</p></section>
                <section><span>OUTCOME</span><p>{active.outcome}</p></section>
                <section>
                  <span>TECHNOLOGIES</span>
                  <div>{active.tech.map((item) => <i key={item}>{item}</i>)}</div>
                </section>
                <details>
                  <summary>Technical details <span>+</span></summary>
                  <ul>{active.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                </details>
              </div>
              <aside className="principle-card">
                <span>FIELD NOTE</span>
                <blockquote>“{active.principle}”</blockquote>
                <small>SYSTEMS PRINCIPLE · {active.number}</small>
              </aside>
            </div>
            <div className="case-modal-footer">
              <span>System connected · progress saved locally</span>
              <button onClick={closeLandmark}>Back to campus</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
