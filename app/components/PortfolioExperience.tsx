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
    id: "software-engineering",
    label: "Software engineering",
    title: "Software Engineer · Mobile, Systems & Products",
    summary:
      "Production Android systems, cross-platform applications, and independently shipped products built around reliable workflows and real users.",
    focus: ["Kotlin and Java", "System integration", "Product delivery"],
  },
  {
    id: "android-platform",
    label: "Android platform",
    title: "Android Engineer · Kotlin, Architecture & Mobile Platform",
    summary:
      "Android ownership spanning Java-to-Kotlin modernization, maintainable architecture, delivery tooling, observability, and long-lived applications.",
    focus: ["Android 7 to 13", "Architecture", "CI/CD"],
  },
  {
    id: "cross-platform",
    label: "Cross-platform products",
    title: "Cross-Platform Software Engineer",
    summary:
      "Shared Android and iOS product engineering alongside a published, installable web experience with live data integrations.",
    focus: ["Kotlin Multiplatform", "iOS and Android", "Web delivery"],
  },
  {
    id: "connected-systems",
    label: "Connected systems",
    title: "Software Engineer · Connected Devices & Payments",
    summary:
      "Application-layer engineering around printers, scanners, payment terminals, local networks, POS automation, and production diagnostics.",
    focus: ["Hardware SDKs", "Device communication", "Observability"],
  },
];

const IMPACT = [
  {
    value: "3,000+",
    label: "devices",
    detail: "Android architecture across 827 locations",
  },
  {
    value: "800+",
    label: "locations",
    detail: "Payment update · zero production failures",
  },
  {
    value: "65 / 55%",
    label: "tests / automation",
    detail: "POS scanner automation",
  },
  {
    value: "7 → 13",
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
    (project) => project.id !== "splitdish" && project.id !== "smartshopper" && project.id !== "highlight-corner",
  );
  const splitDish = FEATURED_PROJECTS.find((project) => project.id === "splitdish");
  const smartShopper = FEATURED_PROJECTS.find((project) => project.id === "smartshopper");
  const splitDishProduct = PRODUCTS.find((product) => product.id === "splitdish");
  const highlightCornerProduct = PRODUCTS.find((product) => product.id === "highlight-corner");

  return (
    <>
      <div className="recruiter-view">
        <section className="recruiter-hero" aria-labelledby="recruiter-title">
          <div className="recruiter-hero-copy">
            <p className="recruiter-eyebrow">ANAS AHMED · SOFTWARE ENGINEER</p>
            <h1 id="recruiter-title">Software for products and real-world systems.</h1>
            <p className="recruiter-lede">
              5+ years in production mobile engineering at Staples and General Motors.
              I lead Kotlin and Java systems for connected retail devices and
              build cross-platform mobile and web products around reliable workflows.
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
            <h2 id="role-lens-title">One background, four engineering angles.</h2>
            <span>Choose a focus to scan the experience. Every option downloads the same résumé.</span>
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
            <a href={RESUME_HREF} download>Download résumé</a>
          </div>
        </section>

        <div className="recruiter-content-grid">
          <div className="recruiter-main-content">
            <section id="experience" className="recruiter-section" aria-labelledby="experience-title">
              <div className="recruiter-section-heading">
                <span>01</span>
                <div><p>EXPERIENCE</p><h2 id="experience-title">Professional experience</h2></div>
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

            <section id="featured-systems" className="recruiter-section" aria-labelledby="systems-title">
              <div className="recruiter-section-heading">
                <span>02</span>
                <div><p>FEATURED SYSTEMS</p><h2 id="systems-title">Selected engineering systems</h2></div>
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
                <div><p>PRODUCT WORK</p><h2 id="products-title">Shipped products and independent builds</h2></div>
              </div>
              <div className="recruiter-project-grid">
                <article className="recruiter-project-feature">
                  <small>APP STORE PRODUCT · ANDROID + iOS</small>
                  <h3>{splitDishProduct?.name ?? "SplitDish"}</h3>
                  <p>{splitDish?.summary}</p>
                  <ul>
                    <li>ML Kit on Android · Apple Vision on iOS</li>
                    <li>Groq extraction · SQLDelight persistence</li>
                    <li>{splitDishProduct?.availability.apple}</li>
                    <li>{splitDishProduct?.availability.googlePlay}</li>
                  </ul>
                  <a href="/products/splitdish/">View the product and engineering story →</a>
                  {splitDishProduct?.appStoreHref && (
                    <a href={splitDishProduct.appStoreHref} target="_blank" rel="noreferrer">View on the Apple App Store ↗</a>
                  )}
                </article>
                <article>
                  <small>LIVE WEB PRODUCT · INSTALLABLE</small>
                  <h3>{highlightCornerProduct?.name ?? "Highlight Corner"}</h3>
                  <p>{highlightCornerProduct?.engineeringSummary}</p>
                  <span>{highlightCornerProduct?.technologies.join(" · ")}</span>
                  {highlightCornerProduct && (
                    <a href={highlightCornerProduct.href} target="_blank" rel="noreferrer">Open Highlight Corner ↗</a>
                  )}
                </article>
                <article>
                  <small>CROSS-PLATFORM MARKETPLACE MVP</small>
                  <h3>YardScape</h3>
                  <p>Kotlin Multiplatform yard-sale marketplace with shared Compose UI, Android, iOS, and web targets, plus a Ktor API that separates public event previews from RSVP-gated location access. The current MVP uses seeded app data.</p>
                  <span>Kotlin Multiplatform · Compose Multiplatform · Ktor · Android · iOS · Web</span>
                </article>
                <article>
                  <small>AI SHOPPING ASSISTANT</small>
                  <h3>{smartShopper?.navLabel ?? "SmartShopper"}</h3>
                  <p>{smartShopper?.summary}</p>
                  {smartShopper?.link && (
                    <a href={smartShopper.link.href} target="_blank" rel="noreferrer">Open SmartShopper ↗</a>
                  )}
                </article>
              </div>
            </section>
          </div>

          <aside className="recruiter-sidebar" aria-label="Skills, education, and working principles">
            <section className="recruiter-section" aria-labelledby="skills-title">
              <div className="recruiter-section-heading compact">
                <span>04</span>
                <div><p>TECHNICAL SKILLS</p><h2 id="skills-title">Technical skills</h2></div>
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
            <h2 id="contact-title">Let&apos;s build dependable software for real-world use.</h2>
            <span>Software engineering · Android · Cross-platform products · Connected systems</span>
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
