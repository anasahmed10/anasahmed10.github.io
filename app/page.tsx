import type { Metadata } from "next";
import {
  ArrowRight,
  Briefcase,
  Buildings,
  DeviceMobile,
  Scan,
} from "@phosphor-icons/react/dist/ssr";
import { PublicFooter, PublicHeader } from "./components/PublicHeader";

export const metadata: Metadata = {
  title: { absolute: "Anas Ahmed — Engineer and Product Builder" },
  description:
    "Explore Anas Ahmed’s Enterprise Systems Campus, recruiter profile, and public products including TabTally.",
};

const destinations = [
  {
    number: "01",
    icon: Buildings,
    label: "Interactive portfolio",
    title: "Enterprise Systems Campus",
    copy: "Drive through production systems spanning payment terminals, printers, scanners, observability, mobile AI, and application-layer robotics.",
    href: "/campus/",
    action: "Enter the campus",
    tone: "mint",
  },
  {
    number: "02",
    icon: Briefcase,
    label: "For hiring teams",
    title: "Recruiter View",
    copy: "A direct, role-adaptive profile with verified impact, career history, technical skills, tailored résumés, and contact information.",
    href: "/recruiter/",
    action: "Open recruiter view",
    tone: "blue",
  },
  {
    number: "03",
    icon: DeviceMobile,
    label: "Public products",
    title: "Products",
    copy: "See how product thinking, mobile engineering, and privacy-aware AI come together in TabTally—and in products still to come.",
    href: "/products/",
    action: "Explore products",
    tone: "amber",
  },
];

export default function Home() {
  return (
    <main className="public-shell">
      <PublicHeader active="home" />

      <section className="hub-hero" aria-labelledby="hub-title">
        <div className="hub-grid" aria-hidden="true" />
        <div className="hub-hero-copy">
          <p className="public-kicker"><span /> ENGINEERING · PRODUCTS · REAL SYSTEMS</p>
          <h1 id="hub-title">Software that holds up in the real world.</h1>
          <p className="hub-lede">
            I’m Anas Ahmed, an Enterprise Android Engineer and product builder.
            I create dependable software around physical devices, production
            workflows, mobile AI, and the people who rely on them.
          </p>
          <div className="hub-actions">
            <a className="public-primary" href="/campus/">
              Explore my work <ArrowRight size={18} weight="bold" aria-hidden />
            </a>
            <a className="public-secondary" href="/products/tabtally/">
              Meet TabTally
            </a>
          </div>
          <div className="hub-proof" aria-label="Selected impact">
            <div><strong>800+</strong><span>production locations</span></div>
            <div><strong>65</strong><span>automated POS tests</span></div>
            <div><strong>2</strong><span>TabTally platforms</span></div>
          </div>
        </div>

        <a className="hub-product-window" href="/products/tabtally/" aria-label="Explore TabTally">
          <div className="hub-product-status"><i /> PRODUCT LAB · ONLINE</div>
          <img src="/products/tabtally/feature-graphic.png" alt="TabTally: scan receipts and split bills" />
          <div className="hub-product-meta">
            <span><Scan size={18} weight="duotone" aria-hidden /> ON-DEVICE OCR</span>
            <strong>Human-reviewed mobile AI</strong>
            <small>Kotlin Multiplatform · Android + iOS</small>
          </div>
        </a>
      </section>

      <section className="destination-section" aria-labelledby="choose-title">
        <div className="section-heading">
          <p className="public-kicker"><span /> CHOOSE YOUR PATH</p>
          <h2 id="choose-title">One public home. Three focused experiences.</h2>
          <p>Explore the work in the format that gives you the clearest signal.</p>
        </div>
        <div className="destination-grid">
          {destinations.map(({ icon: Icon, ...destination }) => (
            <a
              className={`destination-card tone-${destination.tone}`}
              href={destination.href}
              key={destination.title}
            >
              <div className="destination-top">
                <span>{destination.number}</span>
                <Icon size={26} weight="duotone" aria-hidden />
              </div>
              <small>{destination.label}</small>
              <h3>{destination.title}</h3>
              <p>{destination.copy}</p>
              <strong>{destination.action} <ArrowRight size={16} weight="bold" aria-hidden /></strong>
            </a>
          ))}
        </div>
      </section>

      <section className="hub-bridge">
        <div>
          <p className="public-kicker"><span /> CURRENT PRODUCT</p>
          <h2>TabTally turns a messy receipt into a trustworthy split.</h2>
        </div>
        <p>
          Native capture and on-device OCR meet strict-schema AI extraction,
          editable review, fair tax and tip allocation, and a shared Android/iOS
          interface.
        </p>
        <a href="/products/tabtally/">Read the product story <ArrowRight size={17} weight="bold" aria-hidden /></a>
      </section>

      <PublicFooter />
    </main>
  );
}
