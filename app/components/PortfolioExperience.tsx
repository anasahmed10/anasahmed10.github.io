"use client";

import { useMemo, useState } from "react";
import { FEATURED_PROJECTS } from "../data/portfolio";

type RoleLens = {
  id: string;
  label: string;
  title: string;
  summary: string;
  focus: string;
  resume: string;
};

const RESUME_HREF = "/resumes/Anas_Ahmed_Resume.pdf";

const ROLE_LENSES: RoleLens[] = [
  {
    id: "enterprise",
    label: "Enterprise devices",
    title: "Enterprise Android Engineer · Hardware-Integrated Mobile Systems",
    summary:
      "Android engineer building production software around printers, scanners, payment terminals, tablets, and store networks.",
    focus: "Kotlin modernization · hardware integration · production reliability",
    resume: RESUME_HREF,
  },
  {
    id: "payments",
    label: "Payments & POS",
    title: "Android Payments / POS Device Integration Engineer",
    summary:
      "Production Android experience across contactless payments, PIN pads, POS automation, printers, and distributed retail devices.",
    focus: "Apple Pay · Google Pay · PIN pads · field-device rollouts",
    resume: RESUME_HREF,
  },
  {
    id: "platform",
    label: "Android platform",
    title: "Senior Android Engineer · Kotlin, Architecture & Mobile Platform",
    summary:
      "Android ownership spanning Java-to-Kotlin modernization, maintainable architecture, delivery tooling, observability, and device integration.",
    focus: "Android 7→13 · architecture · CI/CD · observability",
    resume: RESUME_HREF,
  },
  {
    id: "lead",
    label: "Technical ownership",
    title: "Lead Mobile Engineer · Enterprise Android",
    summary:
      "Mobile engineer comfortable owning architecture, implementation, debugging, rollout support, and long-term maintenance.",
    focus: "Independent delivery · cross-functional work · maintainable handoff",
    resume: RESUME_HREF,
  },
  {
    id: "ai",
    label: "Mobile AI",
    title: "Mobile Engineer · Android, AI Integration & Product Systems",
    summary:
      "Android and Kotlin production experience paired with practical OCR, reviewed AI extraction, and cross-platform product work.",
    focus: "Kotlin Multiplatform · OCR · Groq · Firebase",
    resume: RESUME_HREF,
  },
  {
    id: "robotics",
    label: "Robotics & HMI",
    title: "Android HMI / Robotics Software Engineer",
    summary:
      "Application-layer Android engineer interested in operator controls, device communication, networking, sensors, and automation.",
    focus: "Android/Linux interfaces · networking · HMI · device systems",
    resume: RESUME_HREF,
  },
  {
    id: "logistics",
    label: "Logistics & IoT",
    title: "Android Logistics / Warehouse Automation Engineer",
    summary:
      "Android engineer focused on tablet workflows, scanner automation, local networking, and software used around physical operations.",
    focus: "Tablets · scanners · edge applications · local networking",
    resume: RESUME_HREF,
  },
  {
    id: "medical",
    label: "Medical devices",
    title: "Android Medical Device / Enterprise Device Software Engineer",
    summary:
      "Reliability-focused Android engineer experienced in device communication, operational monitoring, and troubleshooting near the hardware boundary.",
    focus: "Device communication · observability · production stability",
    resume: RESUME_HREF,
  },
];

const SKILLS = [
  "Kotlin",
  "Java",
  "JavaScript",
  "Swift",
  "Python",
  "C#",
  "C++",
  "C",
  "SQL",
  "HTML/CSS",
  "Android",
  "Jetpack Compose",
  "Kotlin Multiplatform",
  "Compose Multiplatform",
  "Coroutines",
  "MVVM",
  "RxJava",
  "Retrofit",
  "Gradle",
  "React Native",
  "Node.js",
  "Hardware SDK/API integration",
  "Local networking",
  "NanoHttpd",
  "Jenkins",
  "Azure DevOps",
  "Firebase",
  "Splunk",
  "Koin",
  "Ktor",
  "OCR.space",
  "Qwen",
];

const tabTallyFlow = ["Capture", "On-device OCR", "Review", "Assign", "Calculate", "Share"];

export default function PortfolioExperience({
  initialMode,
}: {
  initialMode: "campus" | "recruiter";
}) {
  void initialMode;
  const [roleLens, setRoleLens] = useState("enterprise");
  const activeLens = useMemo(
    () => ROLE_LENSES.find((lens) => lens.id === roleLens) ?? ROLE_LENSES[0],
    [roleLens],
  );
  const employerProjects = FEATURED_PROJECTS.filter(
    (project) => project.id !== "tabtally" && project.id !== "smartshopper",
  );
  const tabTally = FEATURED_PROJECTS.find((project) => project.id === "tabtally");
  const smartShopper = FEATURED_PROJECTS.find((project) => project.id === "smartshopper");

  return (
    <main>
      <a className="skip-link" href="#experience">Skip to experience</a>

      <section className="resume-view" aria-labelledby="resume-title">
        <div className="resume-topbar">
          <p><i /> RECRUITER VIEW · VERIFIED PROJECT AND EXPERIENCE SUMMARY</p>
          <div>
            <a href="/campus/">Open 3D campus</a>
            <a href="/products/">Products</a>
            <a href="mailto:anas.ahmed10@outlook.com">Contact</a>
          </div>
        </div>

        <section className="role-lens-panel" aria-labelledby="lens-heading">
          <div className="lens-intro">
            <small>ROLE LENS</small>
            <h2 id="lens-heading">Same experience, different emphasis.</h2>
            <p>Choose the role closest to the work you are hiring for.</p>
          </div>
          <div className="lens-controls" role="tablist" aria-label="Role lenses">
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
            <a href={activeLens.resume} download>
              Download current résumé <span aria-hidden="true">↓</span>
            </a>
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
            <div className="profile-monogram" aria-label="Anas Ahmed monogram">AA</div>
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
          <div><strong>$0</strong><span>vendor technician cost</span></div>
          <div><strong>0</strong><span>production failures</span></div>
          <div><strong>65</strong><span>automated POS tests</span></div>
          <div><strong>55%</strong><span>more POS automation</span></div>
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
                      <li>Served as lead architect for the complete Android 13 redesign of the self-service print application, coordinating an external vendor, the UI team, and internal engineering partners while replacing its Java and Android 7 foundation with Kotlin.</li>
                      <li>Enabled multilingual support, Google Drive and Dropbox workflows, and Android integration with Xerox printers, scanners, payments, PIN pads, and store networks.</li>
                      <li>Implemented Apple Pay and Google Pay support and helped design a four-stage local update for bank-mandated payment-terminal software. The process brought vendor-technician cost for the rollout to $0 and reached 800+ locations with zero production failures.</li>
                      <li>Built real-time printer status-light monitoring and Splunk dashboards for issue duration, frequency, and production diagnosis.</li>
                    </ul>
                  </div>
                </article>
                <article>
                  <div className="career-meta"><span>2021—2022</span><small>REMOTE</small></div>
                  <div>
                    <p>GENERAL MOTORS</p>
                    <h3>Sr. Mobile Device Software Developer</h3>
                    <ul>
                      <li>Built a web dashboard that used Jenkins pipeline data to track Android and iOS app-size changes.</li>
                      <li>Deployed mobile build and release pipelines in Azure DevOps.</li>
                      <li>Created a Universal Deep Link Handler in React Native to consolidate routing and make future mobile development easier.</li>
                    </ul>
                  </div>
                </article>
                <article>
                  <div className="career-meta"><span>2021—2024</span><small>FOXBOROUGH, MA</small></div>
                  <div>
                    <p>SYNTAX TUTORING</p>
                    <h3>Founder and CEO</h3>
                    <ul>
                      <li>Founded a programming tutoring company and designed practical Android and web curricula, interactive applications, lectures, and hands-on labs.</li>
                    </ul>
                  </div>
                </article>
              </div>
            </section>

            <section id="featured-systems" className="resume-section">
              <div className="section-label"><span>02</span><p>Featured systems</p></div>
              <div className="experience-list">
                {employerProjects.map((project, index) => (
                  <article key={project.id}>
                    <div className={`experience-icon ${index === 0 ? "tone-amber" : index === 2 ? "tone-green" : ""}`}><i /></div>
                    <div>
                      <small>{project.kicker}</small>
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                      <strong>{project.impact}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="resume-section">
              <div className="section-label"><span>03</span><p>Product and additional work</p></div>
              <div className="project-grid">
                <article className="tabtally-card">
                  <div className="project-card-head">
                    <span>PERSONAL PRODUCT</span><small>KMP · COMPOSE</small>
                  </div>
                  <h3>{tabTally?.sceneLabel ?? "TabTally"}</h3>
                  <p>{tabTally?.summary}</p>
                  <div className="flow-list" aria-label="TabTally product flow">
                    {tabTallyFlow.map((step, index) => (
                      <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>
                    ))}
                  </div>
                  <a className="project-link" href="/products/tabtally/">View the complete product story →</a>
                </article>
                <article className="robotics-card">
                  <div className="project-card-head">
                    <span>FUTURE DIRECTION</span><small>APPLICATION LAYER</small>
                  </div>
                  <div className="robotics-diagram" aria-hidden="true">
                    <i className="robot-base" /><i className="robot-sensor" /><i className="robot-signal one" /><i className="robot-signal two" />
                  </div>
                  <h3>Robotics applications</h3>
                  <p>My focus is Android and Linux control surfaces, networking, sensors, automation, and operator-facing HMI software.</p>
                  <div className="scope-note"><strong>Scope</strong> Application software and interfaces.</div>
                </article>
              </div>
              <div className="additional-projects">
                <article>
                  <span>ANDROID MARKETPLACE · ADDITIONAL WORK</span>
                  <h3>Yardscape</h3>
                  <p>Android marketplace application for browsing and posting yard-sale listings with authentication, storage, and API-backed workflows.</p>
                  <small>Kotlin · Java · MVVM · Coroutines · Volley · Firebase</small>
                </article>
                <article className="smartshopper-card">
                  <span>AI SHOPPING ASSISTANT · PERSONAL PROJECT</span>
                  <h3>{smartShopper?.sceneLabel ?? "SmartShopper"}</h3>
                  <p>{smartShopper?.summary}</p>
                  <p>{smartShopper?.details[1]}</p>
                  <small>{smartShopper?.tech.join(" · ")}</small>
                  {smartShopper?.link && (
                    <a className="project-link" href={smartShopper.link.href} target="_blank" rel="noreferrer">Open SmartShopper ↗</a>
                  )}
                </article>
                <article>
                  <span>ORIGIN · AGE 17</span>
                  <h3>Deer Computer Repairs</h3>
                  <p>Co-founding a computer repair business taught me to diagnose technical problems, explain tradeoffs, and stand behind the work.</p>
                  <small>PC repair · upgrades · refurbishment · customer service</small>
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
              <p>Dean&apos;s List Recipient · Lowell, Massachusetts</p>
            </section>
            <section className="resume-section principles">
              <div className="section-label"><span>06</span><p>How I work</p></div>
              <blockquote>Production reliability comes before a flashy demo.</blockquote>
              <blockquote>A prototype matters when another engineer can maintain it.</blockquote>
              <blockquote>Good device integration disappears into the workflow.</blockquote>
            </section>
          </aside>
        </div>

        <section id="contact" className="contact-panel">
          <div>
            <p className="system-kicker"><span /> CONTACT</p>
            <h2>Let&apos;s build dependable software around real devices.</h2>
            <p>Greater Boston · Remote-first · Enterprise Android · Application-layer robotics</p>
          </div>
          <div className="contact-links">
            <a href="mailto:anas.ahmed10@outlook.com"><span>Email</span><strong>anas.ahmed10@outlook.com</strong></a>
            <a href="tel:+17743007831"><span>Phone</span><strong>774-300-7831</strong></a>
            <a href="https://www.linkedin.com/in/anas-ahmed-28b391166" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>View profile ↗</strong></a>
            <a href="https://github.com/anasahmed10" target="_blank" rel="noreferrer"><span>GitHub</span><strong>@anasahmed10 ↗</strong></a>
            <a href={activeLens.resume} download><span>Current résumé</span><strong>Download résumé ↓</strong></a>
          </div>
        </section>
      </section>

      <noscript>
        <section className="noscript-resume">
          <p>ANAS AHMED · ENTERPRISE ANDROID ENGINEER</p>
          <h1>Software for printers, scanners, payment terminals, and store networks.</h1>
          <p>Software Engineer II, Mobile at Staples. Previously Sr. Mobile Device Software Developer at General Motors.</p>
          <p>Email: anas.ahmed10@outlook.com · Phone: 774-300-7831</p>
        </section>
      </noscript>
    </main>
  );
}
