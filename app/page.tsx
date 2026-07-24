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

const LANDMARKS: Landmark[] = [
  {
    id: "payments",
    number: "01",
    eyebrow: "ENTERPRISE DEPLOYMENT",
    title: "Payment Terminal Bay",
    shortTitle: "Payment Bay",
    summary:
      "A four-stage terminal upgrade engineered for a distributed production environment.",
    impact: "800+ locations · zero production failures",
    context:
      "A payment-terminal estate needed a controlled upgrade path across hundreds of live locations, where rollback clarity and operational confidence mattered as much as the code.",
    contribution:
      "Structured the work as four connected upgrade checkpoints, aligning application behavior, device constraints, deployment sequencing, and validation before production rollout.",
    tech: ["Android", "Device integration", "Staged rollout", "Production validation"],
    outcome:
      "The upgrade reached more than 800 locations with zero production failures.",
    principle: "Production reliability matters more than flashy demos.",
    x: 18,
    y: 25,
    tone: "amber",
    kind: "terminal",
    details: [
      "Four explicit upgrade gates reduced ambiguity during rollout.",
      "Production readiness was treated as a system property—not a final QA step.",
      "Operational signals and rollback thinking shaped the delivery plan.",
    ],
  },
  {
    id: "printers",
    number: "02",
    eyebrow: "DEVICE OPERATIONS",
    title: "Printer Operations Center",
    shortTitle: "Printer Ops",
    summary:
      "Migration redesign and printer-status observability for a complex enterprise device fleet.",
    impact: "Migration redesign + actionable device status",
    context:
      "Enterprise printers expose noisy, vendor-shaped status data. The useful product is not the raw signal—it is a reliable operational interpretation.",
    contribution:
      "Redesigned the Xerox migration flow and made printer behavior legible through normalized status handling and observability views.",
    tech: ["Android", "Xerox devices", "Telemetry", "Operational UX"],
    outcome:
      "Improved migration clarity and gave support teams a more useful picture of device state.",
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
      "Built the greenfield Kotlin Android application connecting a tablet, barcode scanner, and POS terminal into a repeatable test lane.",
    tech: ["Kotlin", "Android", "Barcode scanner", "POS automation"],
    outcome:
      "Automated 65 POS test cases, increased POS automation by 55%, and placed first in the 2025 company hackathon. The application was later maintained by a 4–8 engineer team.",
    principle: "A prototype becomes valuable when another engineer can maintain it.",
    x: 79,
    y: 32,
    tone: "green",
    kind: "scanner",
    details: [
      "Greenfield architecture balanced hackathon speed with a maintainable handoff.",
      "Physical scan events advanced repeatable test checkpoints.",
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
      "Contact links and a headshot are intentionally not fabricated when source assets were not provided.",
      "Use Recruiter Mode for the complete text-based portfolio.",
      "Use the print action to save the résumé view as a PDF.",
    ],
  },
];

const SKILLS = [
  "Kotlin",
  "Android",
  "Jetpack Compose",
  "Kotlin Multiplatform",
  "Compose Multiplatform",
  "Device integration",
  "Barcode scanners",
  "Payment terminals",
  "Enterprise printers",
  "Splunk",
  "Production diagnosis",
  "Automation",
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
            printers, barcode scanners, POS automation, Splunk observability, and Kotlin Multiplatform.
          </p>
          <ul>
            <li>Payment terminal upgrade: 800+ locations with zero production failures.</li>
            <li>Scanner automation: 65 POS tests, 55% automation increase, first place in the 2025 company hackathon.</li>
            <li>TabTally: Kotlin Multiplatform receipt capture, OCR, AI-assisted parsing, review, assignment, and split calculation.</li>
            <li>Future direction: application-layer robotics, Android/Linux interfaces, networking, sensors, and automation.</li>
          </ul>
          <p>Contact links and a résumé file were not included in the supplied source material.</p>
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
              <button onClick={() => window.print()}>Print / save résumé</button>
              <button onClick={() => setMode("campus")}>Explore campus</button>
            </div>
          </div>

          <div className="resume-hero">
            <div className="resume-identity">
              <p className="system-kicker"><span /> ENTERPRISE ANDROID · DEVICE SYSTEMS</p>
              <h1 id="resume-title">Anas Ahmed</h1>
              <h2>Enterprise Android Engineer</h2>
              <p>
                I build dependable application-layer systems around real hardware—payment terminals,
                printers, scanners, telemetry, and the operational teams who rely on them.
              </p>
              <div className="resume-actions">
                <a href="#experience">View experience</a>
                <a href="#contact">Contact details</a>
                <button onClick={() => window.print()}>Download résumé as PDF</button>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-monogram" aria-label="Headshot not provided; Anas Ahmed monogram shown">AA</div>
              <div>
                <span>BASED IN</span><strong>Greater Boston</strong>
                <span>WORK STYLE</span><strong>Remote-first</strong>
                <span>FOCUS</span><strong>Applications × devices</strong>
              </div>
            </div>
          </div>

          <div className="impact-strip" aria-label="Selected impact">
            <div><strong>800+</strong><span>locations upgraded</span></div>
            <div><strong>0</strong><span>production failures</span></div>
            <div><strong>65</strong><span>automated POS tests</span></div>
            <div><strong>+55%</strong><span>POS automation</span></div>
            <div><strong>1st</strong><span>2025 company hackathon</span></div>
          </div>

          <div className="resume-grid">
            <div className="resume-main">
              <section id="experience" className="resume-section">
                <div className="section-label"><span>01</span><p>Selected experience</p></div>
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
                <div className="section-label"><span>02</span><p>Featured projects</p></div>
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
              </section>
            </div>

            <aside className="resume-sidebar">
              <section className="resume-section">
                <div className="section-label"><span>03</span><p>Technical skills</p></div>
                <div className="skill-cloud">
                  {SKILLS.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </section>
              <section className="resume-section principles">
                <div className="section-label"><span>04</span><p>Engineering principles</p></div>
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
            <div className="contact-status">
              <span>Contact links</span>
              <strong>Ready when supplied</strong>
              <p>
                Email, GitHub, LinkedIn, a résumé file, and a professional headshot were not included in the source brief,
                so this published version does not invent them.
              </p>
              <button onClick={() => window.print()}>Save this résumé view</button>
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
