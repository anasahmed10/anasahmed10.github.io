import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type PublicSection = "home" | "campus" | "recruiter" | "products";

export function PublicHeader({ active }: { active: PublicSection }) {
  return (
    <header className="public-header">
      {/* A plain anchor keeps this shared server component compatible with vinext and static export. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="public-brand" href="/" aria-label="Anas Ahmed home">
        <span className="public-brand-mark" aria-hidden="true">AA</span>
        <span>
          <strong>Anas Ahmed</strong>
          <small>Engineer · Product Builder</small>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        <a className={active === "campus" ? "active" : ""} href="/campus/">Campus</a>
        <a className={active === "recruiter" ? "active" : ""} href="/recruiter/">Recruiter</a>
        <a className={active === "products" ? "active" : ""} href="/products/">Products</a>
        <a href="mailto:anas.ahmed10@outlook.com">
          Contact <ArrowUpRight size={13} weight="bold" aria-hidden />
        </a>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <span className="public-brand-mark" aria-hidden="true">AA</span>
        <p>Software built around physical devices and the people operating them.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/campus/">Systems Campus</a>
        <a href="/recruiter/">Recruiter View</a>
        <a href="/products/">Products</a>
        <a href="https://github.com/anasahmed10" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/anas-ahmed-28b391166" target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
      <small>© 2026 Anas Ahmed. All rights reserved.</small>
    </footer>
  );
}
