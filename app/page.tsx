"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    x: 18,
    y: 25,
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
    x: 52,
    y: 18,
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
    x: 79,
    y: 32,
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
    x: 69,
    y: 71,
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
    x: 34,
    y: 70,
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
    x: 12,
    y: 72,
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
    x: 44,
    y: 44,
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
    resume: "resumes/Anas_Ahmed_Enterprise_Android_Hardware.pdf",
  },
  {
    id: "payments",
    label: "Payments & POS",
    title: "Android Payments / POS Device Integration Engineer",
    summary: "Production experience across contactless payments, PIN pads, POS scanner automation, printers, and distributed retail device ecosystems.",
    focus: "Apple Pay · Google Pay · PIN pads · retail device rollouts",
    resume: "resumes/Anas_Ahmed_Payments_POS_Device_Integration.pdf",
  },
  {
    id: "robotics",
    label: "Robotics & HMI",
    title: "Android HMI / Robotics Software Engineer",
    summary: "Application-layer Android engineer focused on operator-facing software that connects people to physical systems through device communication, networking, automation, and observability.",
    focus: "Application layer · HMI · device systems · industrial reliability",
    resume: "resumes/Anas_Ahmed_Robotics_HMI_Industrial.pdf",
  },
  {
    id: "logistics",
    label: "Logistics & IoT",
    title: "Android Logistics / Warehouse Automation Engineer",
    summary: "Android engineer focused on tablet-based operational software, scanner automation, local networking, and hardware-integrated field workflows.",
    focus: "Tablets · scanners · edge apps · local networking",
    resume: "resumes/Anas_Ahmed_Logistics_Warehouse_IoT.pdf",
  },
  {
    id: "platform",
    label: "Android platform",
    title: "Senior Android Engineer · Kotlin, Architecture & Mobile Platform",
    summary: "Senior Android engineer modernizing Java systems to Kotlin, shaping maintainable architecture, and supporting enterprise-scale production applications.",
    focus: "Kotlin · architecture · CI/CD · mobile observability",
    resume: "resumes/Anas_Ahmed_Senior_Android_Platform.pdf",
  },
  {
    id: "ai",
    label: "Mobile AI",
    title: "Mobile Engineer · Android, AI Integration & Product Systems",
    summary: "Mobile engineer combining Android/Kotlin production experience with practical OCR, AI-assisted extraction, Firebase, and cross-platform product work.",
    focus: "OCR · AI APIs · Firebase · cross-platform products",
    resume: "resumes/Anas_Ahmed_Mobile_AI_Integration.pdf",
  },
  {
    id: "healthcare",
    label: "Medical devices",
    title: "Android Medical Device / Enterprise Device Software Engineer",
    summary: "Reliability-focused Android engineer experienced in device communication, observability, maintainable architecture, and troubleshooting near the hardware/software boundary.",
    focus: "Reliability · device monitoring · hardware SDK/API integration",
    resume: "resumes/Anas_Ahmed_Healthcare_Medical_Device.pdf",
  },
  {
    id: "lead",
    label: "Lead mobile",
    title: "Lead Mobile Engineer · Technical Ownership & Enterprise Android",
    summary: "Mobile engineer positioned for senior ownership roles requiring independent delivery, cross-functional collaboration, and end-to-end Android systems thinking.",
    focus: "Architecture · delivery ownership · mentoring · production systems",
    resume: "resumes/Anas_Ahmed_Lead_Mobile_Engineer.pdf",
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

export default function Home() {
  const [mode, setMode] = useState<"intro" | "campus" | "recruiter">("intro");
  const [active, setActive] = useState<Landmark | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(true);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [rover, setRover] = useState({ x: 47, y: 57 });
  const [nearby, setNearby] = useState<Landmark | null>(null);
  const [roverPaused, setRoverPaused] = useState(false);
  const [roleLens, setRoleLens] = useState("enterprise");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const pressedKeys = useRef(new Set<string>());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("anas-campus-visited");
      if (stored) setVisited(JSON.parse(stored));
    } catch {
      // The experience works without local storage.
    }
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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
    setRover({ x: 47, y: 57 });
    setVisited([]);
    setNearby(null);
    setMapOpen(false);
    playSignal(!muted);
  }, [muted]);

  useEffect(() => {
    if (mode !== "campus" || roverPaused || reduced) return;
    let frame = 0;
    const move = () => {
      const keys = pressedKeys.current;
      const dx =
        (keys.has("arrowright") || keys.has("d") ? 1 : 0) -
        (keys.has("arrowleft") || keys.has("a") ? 1 : 0);
      const dy =
        (keys.has("arrowdown") || keys.has("s") ? 1 : 0) -
        (keys.has("arrowup") || keys.has("w") ? 1 : 0);
      if (dx || dy) {
        setRover((position) => ({
          x: Math.max(4, Math.min(96, position.x + dx * 0.38)),
          y: Math.max(7, Math.min(91, position.y + dy * 0.38)),
        }));
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [mode, reduced, roverPaused]);

  useEffect(() => {
    const nearest = LANDMARKS.map((landmark) => ({
      landmark,
      distance: Math.hypot(landmark.x - rover.x, landmark.y - rover.y),
    })).sort((a, b) => a.distance - b.distance)[0];
    setNearby(nearest.distance < 10 ? nearest.landmark : null);
  }, [rover]);

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
        if (!event.repeat) {
          const dx = key === "arrowright" || key === "d" ? 1.2 : key === "arrowleft" || key === "a" ? -1.2 : 0;
          const dy = key === "arrowdown" || key === "s" ? 1.2 : key === "arrowup" || key === "w" ? -1.2 : 0;
          setRover((position) => ({
            x: Math.max(4, Math.min(96, position.x + dx)),
            y: Math.max(7, Math.min(91, position.y + dy)),
          }));
        }
      }
      if (key === "m") {
        event.preventDefault();
        setMapOpen((value) => !value);
      }
      if (key === "r") {
        event.preventDefault();
        setRover({ x: 47, y: 57 });
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
      x: Math.max(4, Math.min(96, position.x + dx)),
      y: Math.max(7, Math.min(91, position.y + dy)),
    }));
  };

  const tabTallyFlow = useMemo(
    () => ["Capture receipt", "OCR", "AI-assisted parsing", "Item review", "Participant assignment", "Calculated split"],
    [],
  );

  return (
    <main className={`${reduced ? "reduced-effects" : ""} ${active ? "modal-open" : ""}`}>
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

      <header className="site-header">
        <button className="brand-lockup" onClick={() => setMode("intro")} aria-label="Return to introduction">
          <span className="brand-mark" aria-hidden="true">AA</span>
          <span>
            <strong>Anas Ahmed</strong>
            <small>Enterprise Android Engineer</small>
          </span>
        </button>
        <nav aria-label="Primary navigation">
          <button className={mode === "campus" ? "active" : ""} onClick={() => setMode("campus")}>
            Campus
          </button>
          <button className={mode === "recruiter" ? "active" : ""} onClick={() => setMode("recruiter")}>
            Recruiter mode
          </button>
          <a href="#contact" onClick={() => setMode("recruiter")}>Contact</a>
        </nav>
      </header>

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
        <section className="campus-shell" aria-labelledby="campus-title">
          <div className="campus-heading">
            <div>
              <p className="system-kicker"><span /> CAMPUS GRID · SECTOR A7</p>
              <h1 id="campus-title">Enterprise Systems Campus</h1>
              <p>Navigate the service rover, or select any landmark directly.</p>
            </div>
            <div className="progress-module" aria-label={`${discovered} of ${LANDMARKS.length} systems connected`}>
              <div className="progress-copy">
                <span>Systems connected</span><strong>{discovered}/{LANDMARKS.length}</strong>
              </div>
              <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
            </div>
          </div>

          <div className="campus-layout">
            <div className="world-frame">
              <div className="world-toolbar">
                <div className="live-indicator"><i /> LIVE CAMPUS</div>
                <div>
                  <button onClick={() => setMapOpen((value) => !value)} aria-expanded={mapOpen}>Map <kbd>M</kbd></button>
                  <button onClick={() => setMuted((value) => !value)}>{muted ? "Sound off" : "Sound on"}</button>
                  <button onClick={() => setReduced((value) => !value)}>{reduced ? "Effects off" : "Effects on"}</button>
                  <button onClick={resetCampus}>Reset</button>
                </div>
              </div>

              <div
                className="campus-world"
                role="application"
                aria-label="Interactive top-down campus. Use W A S D or arrow keys to move the service rover. Press Enter near a landmark to open it."
              >
                <div className="world-grid" />
                <div className="road road-one" />
                <div className="road road-two" />
                <div className="road road-three" />
                <div className="road road-four" />
                <div className="plot-label plot-a">A1 · DEPLOYMENT</div>
                <div className="plot-label plot-b">B2 · DEVICE OPS</div>
                <div className="plot-label plot-c">C4 · AUTOMATION</div>
                <div className="plot-label plot-d">D7 · MOBILE LAB</div>
                <div className="water-retention" aria-hidden="true" />

                {LANDMARKS.map((landmark) => {
                  const isVisited = visited.includes(landmark.id);
                  const isNearby = nearby?.id === landmark.id;
                  return (
                    <button
                      key={landmark.id}
                      className={`landmark landmark-${landmark.kind} tone-${landmark.tone} ${isVisited ? "visited" : ""} ${isNearby ? "nearby" : ""}`}
                      style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                      onClick={() => openLandmark(landmark)}
                      aria-label={`${landmark.title}. ${landmark.impact}. ${isVisited ? "Visited." : "Not yet visited."}`}
                    >
                      <span className="landmark-object" aria-hidden="true">
                        <i className="object-main" />
                        <i className="object-detail detail-one" />
                        <i className="object-detail detail-two" />
                        <i className="signal-ring" />
                      </span>
                      <span className="landmark-label">
                        <small>{landmark.number}</small>
                        <strong>{landmark.shortTitle}</strong>
                        <i>{isVisited ? "CONNECTED" : "OPEN SYSTEM"}</i>
                      </span>
                    </button>
                  );
                })}

                <div
                  className={`service-rover ${roverPaused ? "paused" : ""}`}
                  style={{ left: `${rover.x}%`, top: `${rover.y}%` }}
                  aria-hidden="true"
                >
                  <i className="rover-sensor" />
                  <i className="rover-body" />
                  <i className="rover-wheel wheel-left" />
                  <i className="rover-wheel wheel-right" />
                  <span>SR-7</span>
                </div>

                {nearby && !active && (
                  <button className="interaction-prompt" onClick={() => openLandmark(nearby)}>
                    <kbd>Enter</kbd> Inspect {nearby.shortTitle}
                  </button>
                )}

                {mapOpen && (
                  <aside className="map-overlay" aria-label="Campus map">
                    <div className="map-header">
                      <div><small>CAMPUS MAP</small><strong>{completion}% DISCOVERED</strong></div>
                      <button onClick={() => setMapOpen(false)} aria-label="Close campus map">×</button>
                    </div>
                    <div className="mini-map">
                      {LANDMARKS.map((landmark) => (
                        <button
                          key={landmark.id}
                          className={visited.includes(landmark.id) ? "visited" : ""}
                          style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                          onClick={() => openLandmark(landmark)}
                          aria-label={`Open ${landmark.title}`}
                        >
                          {landmark.number}
                        </button>
                      ))}
                      <i className="mini-rover" style={{ left: `${rover.x}%`, top: `${rover.y}%` }} />
                    </div>
                  </aside>
                )}
              </div>

              <div className="mobile-controls" aria-label="Touch rover controls">
                <button onPointerDown={() => moveRover(0, -5)} aria-label="Move rover up">↑</button>
                <div>
                  <button onPointerDown={() => moveRover(-5, 0)} aria-label="Move rover left">←</button>
                  <button onClick={() => nearby && openLandmark(nearby)} disabled={!nearby} aria-label="Interact with nearby landmark">◎</button>
                  <button onPointerDown={() => moveRover(5, 0)} aria-label="Move rover right">→</button>
                </div>
                <button onPointerDown={() => moveRover(0, 5)} aria-label="Move rover down">↓</button>
              </div>
            </div>

            <aside className="case-index" aria-labelledby="case-index-title">
              <div className="index-heading">
                <small>DIRECT ACCESS</small>
                <h2 id="case-index-title">Systems index</h2>
                <p>Every case study is available without driving.</p>
              </div>
              <div className="index-list">
                {LANDMARKS.map((landmark) => (
                  <button
                    key={landmark.id}
                    onClick={() => openLandmark(landmark)}
                    className={visited.includes(landmark.id) ? "visited" : ""}
                  >
                    <span>{landmark.number}</span>
                    <div><strong>{landmark.shortTitle}</strong><small>{landmark.eyebrow}</small></div>
                    <i aria-hidden="true">{visited.includes(landmark.id) ? "●" : "↗"}</i>
                  </button>
                ))}
              </div>
              <button className="recruiter-jump" onClick={() => setMode("recruiter")}>
                <span>SHORT ON TIME?</span>
                <strong>Open recruiter mode →</strong>
              </button>
            </aside>
          </div>

          {helpOpen && (
            <div className="help-card">
              <button onClick={() => setHelpOpen(false)} aria-label="Dismiss exploration help">×</button>
              <small>HOW TO EXPLORE</small>
              <div><kbd>WASD</kbd><span>or arrows to move</span></div>
              <div><kbd>Enter</kbd><span>inspect a nearby system</span></div>
              <div><kbd>M</kbd><span>map</span><kbd>R</kbd><span>return rover</span></div>
            </div>
          )}
        </section>
      )}

      {mode === "recruiter" && (
        <section id="portfolio-content" className="resume-view" aria-labelledby="resume-title">
          <div className="resume-topbar">
            <p><i /> RECRUITER MODE · ALL ESSENTIAL INFORMATION</p>
            <div>
              <a href={activeLens.resume} download>Download tailored résumé</a>
              <button onClick={() => setMode("campus")}>Explore campus</button>
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
                    <button onClick={() => openLandmark(LANDMARKS[3])}>Open project details →</button>
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

      {active && (
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
