"use client";

import { useMemo, useState } from "react";
import { CAREER_ROLES, FEATURED_PROJECTS, SKILL_GROUPS } from "../data/portfolio";
import { PRODUCTS } from "../data/products";

type RoleLens = {
  id: string;
  label: string;
  title: string;
  summary: string;
  focus: string[];
};

const RESUME_HREF = "/resumes/Anas_Ahmed_Resume.pdf";

const ROLE_LENSES: RoleLens[] = [
  {
    id: "enterprise-mobile",
    label: "Enterprise mobile",
    title: "Enterprise Mobile Engineer",
    summary:
      "Android and cross-platform engineering for production workflows that connect software, devices, and the people operating them.",
    focus: ["Kotlin", "Android architecture", "Production reliability"],
  },
  {
    id: "android-platform",
    label: "Android platform",
    title: "Senior Android Engineer · Kotlin, Architecture & Mobile Platform",
    summary:
      "Android ownership spanning Java-to-Kotlin modernization, maintainable architecture, delivery tooling, observability, and long-lived applications.",
    focus: ["Android 7 to 13", "Architecture", "CI/CD"],
  },
  {
    id: "payments-pos",
    label: "Payments & POS",
    title: "Android Payments & POS Integration Engineer",
    summary:
      "Production Android experience across contactless payments, PIN pads, POS automation, printers, scanners, and distributed retail devices.",
    focus: ["Apple Pay", "Google Pay", "Payment terminals"],
  },
  {
    id: "mobile-hardware",
    label: "Mobile + hardware",
    title: "Mobile + Hardware Systems Engineer · Device Integration",
    summary:
      "Application-layer mobile engineering around printers, scanners, payment terminals, local networks, sensors, and physical operations.",
    focus: ["Hardware SDKs", "Device communication", "Observability"],
  },
];

const IMPACT = [
  {
    value: "800+",
    label: "locations",
    detail: "Staged payment-terminal update",
  },
  {
    value: "0 / $0",
    label: "failures / onsite cost",
    detail: "Production rollout result",
  },
  {
    value: "65 / +55%",
    label: "tests / automation",
    detail: "POS scanner automation",
  },
  {
    value: "7 to 13",
    label: "Android versions",
    detail: "Java-to-Kotlin modernization",
  },
];

export default function PortfolioExperience() {
  const [roleLens, setRoleLens] = useState(ROLE_LENSES[0].id);
  const activeLens = useMemo(
    () => ROLE_LENSES.find((lens) => lens.id === roleLens) ?? ROLE_LENSES[0],
    [roleLens],
  );
  const employerProjects = FEATURED_PROJECTS.filter(
    (project) => project.id !== "tabtally" && project.id !== "smartshopper",
  );
  const tabTally = FEATURED_PROJECTS.find((project) => project.id === "tabtally");
  const smartShopper = FEATURED_PROJECTS.find((project) => project.id === "smartshopper");
  const tabTallyProduct = PRODUCTS.find((product) => product.id === "tabtally");

  return (
    <>
      <div className="recruiter-view">
        <section className="recruiter-hero" aria-labelledby="recruiter-title">
          <div className="recruiter-hero-copy">
            <p className="recruiter-eyebrow">ANAS AHMED · ENTERPRISE MOBILE ENGINEER</p>
            <h1 id="recruiter-title">Android systems built around real devices.</h1>
            <p className="recruiter-lede">
              5+ years building Kotlin, Android, and cross-platform software for
              printers, scanners, payment terminals, POS automation, and
              connected-device workflows at Staples and General Motors.
            </p>
            <div className="recruiter-actions">
              <a className="recruiter-primary" href={RESUME_HREF} download>Download résumé</a>
              <a href="#experience">View experience</a>
              <a href="mailto:anas.ahmed10@outlook.com">Email Anas</a>
              <a href="https://www.linkedin.com/in/anas-ahmed-28b391166" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>

          <aside className="recruiter-profile" aria-label="Current profile">
            <div className="recruiter-monogram" aria-hidden="true">AA</div>
            <dl>
              <div><dt>Current role</dt><dd>Software Engineer II, Mobile</dd></div>
              <div><dt>Current company</dt><dd>Staples</dd></div>
              <div><dt>Location</dt><dd>Greater Boston</dd></div>
              <div><dt>Availability</dt><dd>Remote · Boston-area hybrid</dd></div>
              <div><dt>Education</dt><dd>B.S. Computer Science</dd></div>
            </dl>
          </aside>
        </section>

        <dl className="recruiter-impact" aria-label="Selected engineering impact">
          {IMPACT.map((item) => (
            <div key={item.label}>
              <dt><strong>{item.value}</strong><span>{item.label}</span></dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>

        <section className="recruiter-lenses" aria-labelledby="role-lens-title">
          <div className="recruiter-section-intro">
            <p>ROLE EMPHASIS</p>
            <h2 id="role-lens-title">One background, four relevant hiring paths.</h2>
            <span>Choose the closest target role. Employment titles and dates remain unchanged.</span>
          </div>
          <div className="recruiter-lens-controls" aria-label="Choose a target role emphasis">
            {ROLE_LENSES.map((lens) => (
              <button
                key={lens.id}
                type="button"
                aria-pressed={roleLens === lens.id}
                onClick={() => setRoleLens(lens.id)}
              >
                {lens.label}
              </button>
            ))}
          </div>
          <div className="recruiter-lens-readout" aria-live="polite">
            <div>
              <small>TARGET ROLE LENS</small>
              <h3>{activeLens.title}</h3>
              <p>{activeLens.summary}</p>
              <ul aria-label="Role focus">
                {activeLens.focus.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <a href={RESUME_HREF} download>Download canonical résumé</a>
          </div>
        </section>

        <div className="recruiter-content-grid">
          <div className="recruiter-main-content">
            <section id="experience" className="recruiter-section" aria-labelledby="experience-title">
              <div className="recruiter-section-heading">
                <span>01</span>
                <div><p>EXPERIENCE</p><h2 id="experience-title">Production ownership, clearly stated.</h2></div>
              </div>
              <div className="recruiter-timeline">
                {CAREER_ROLES.map((role) => (
                  <article key={`${role.company}-${role.title}`}>
                    <div className="recruiter-role-meta">
                      <time>{role.dates}</time>
                      <span>{role.location}</span>
                    </div>
                    <div>
                      <p>{role.company}</p>
                      <h3>{role.title}</h3>
                      <ul>
                        {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="recruiter-section" aria-labelledby="systems-title">
              <div className="recruiter-section-heading">
                <span>02</span>
                <div><p>FEATURED SYSTEMS</p><h2 id="systems-title">Evidence at the device boundary.</h2></div>
              </div>
              <div className="recruiter-system-list">
                {employerProjects.map((project) => (
                  <article key={project.id}>
                    <small>{project.kicker}</small>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <strong>{project.impact}</strong>
                    {project.id === "scanner-automation" && (
                      <span>Established the architecture and workflow, then provided technical direction for a 4–8-engineer maintainer group.</span>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="recruiter-section" aria-labelledby="products-title">
              <div className="recruiter-section-heading">
                <span>03</span>
                <div><p>PRODUCT WORK</p><h2 id="products-title">Products that extend the same engineering habits.</h2></div>
              </div>
              <div className="recruiter-project-grid">
                <article className="recruiter-project-feature">
                  <small>ACTIVE PERSONAL PRODUCT · ANDROID + iOS</small>
                  <h3>{tabTally?.sceneLabel ?? "TabTally"}</h3>
                  <p>{tabTally?.summary}</p>
                  <ul>
                    <li>ML Kit on Android · Apple Vision on iOS</li>
                    <li>Groq extraction · SQLDelight persistence</li>
                    <li>{tabTallyProduct?.availability.apple}</li>
                    <li>{tabTallyProduct?.availability.googlePlay}</li>
                  </ul>
                  <a href="/products/tabtally/">View the product and engineering story →</a>
                </article>
                <article>
                  <small>AI SHOPPING ASSISTANT</small>
                  <h3>{smartShopper?.sceneLabel ?? "SmartShopper"}</h3>
                  <p>{smartShopper?.summary}</p>
                  {smartShopper?.link && (
                    <a href={smartShopper.link.href} target="_blank" rel="noreferrer">Open SmartShopper ↗</a>
                  )}
                </article>
                <article>
                  <small>ANDROID MARKETPLACE</small>
                  <h3>Yardscape</h3>
                  <p>Android yard-sale marketplace with authentication, cloud listing storage, and API-backed browsing and publishing workflows.</p>
                  <span>Kotlin · Java · MVVM · Coroutines · Volley · Firebase</span>
                </article>
                <article>
                  <small>TARGET WORK</small>
                  <h3>Mobile software for physical systems</h3>
                  <p>I am interested in application-layer Android and Linux work around device communication, networking, automation, sensors, and operator-facing HMI software.</p>
                  <span>Application software · interfaces · production reliability</span>
                </article>
              </div>
            </section>
          </div>

          <aside className="recruiter-sidebar" aria-label="Skills, education, and working principles">
            <section className="recruiter-section" aria-labelledby="skills-title">
              <div className="recruiter-section-heading compact">
                <span>04</span>
                <div><p>TECHNICAL SKILLS</p><h2 id="skills-title">Searchable and grouped.</h2></div>
              </div>
              <div className="recruiter-skill-groups">
                {SKILL_GROUPS.map((group) => (
                  <section key={group.label}>
                    <h3>{group.label}</h3>
                    <ul>
                      {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </section>
                ))}
              </div>
            </section>

            <section className="recruiter-side-card">
              <small>EDUCATION</small>
              <h2>University of Massachusetts Lowell</h2>
              <p>Bachelor of Science in Computer Science</p>
              <span>Dean&apos;s List Recipient</span>
            </section>

            <section className="recruiter-side-card">
              <small>HOW I WORK</small>
              <blockquote>Production reliability comes before a flashy demo.</blockquote>
              <blockquote>A prototype matters when another engineer can maintain it.</blockquote>
              <blockquote>Good device integration disappears into the workflow.</blockquote>
            </section>
          </aside>
        </div>

        <section className="recruiter-contact" aria-labelledby="contact-title">
          <div>
            <p>CONTACT</p>
            <h2 id="contact-title">Let&apos;s build dependable software around real devices.</h2>
            <span>Enterprise mobile · Android · Device integration · Greater Boston</span>
          </div>
          <div>
            <a href="mailto:anas.ahmed10@outlook.com"><span>Email</span><strong>anas.ahmed10@outlook.com</strong></a>
            <a href="tel:+17743007831"><span>Phone</span><strong>774-300-7831</strong></a>
            <a href="https://www.linkedin.com/in/anas-ahmed-28b391166" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>View profile ↗</strong></a>
            <a href="https://github.com/anasahmed10" target="_blank" rel="noreferrer"><span>GitHub</span><strong>@anasahmed10 ↗</strong></a>
          </div>
        </section>
      </div>
    </>
  );
}
