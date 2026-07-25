import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  BracketsCurly,
  Camera,
  CheckCircle,
  Database,
  DeviceMobile,
  Eye,
  GitBranch,
  LockKey,
  PencilSimple,
  Receipt,
  Scan,
  ShareNetwork,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { PublicFooter, PublicHeader } from "../../components/PublicHeader";

const SUPPORT_URL = "https://anasahmed10.github.io/tabtally-support/";
const PRIVACY_URL = "https://anasahmed10.github.io/tabtally-support/privacy/";

export const metadata: Metadata = {
  title: "TabTally — Kotlin Multiplatform Receipt Splitting",
  description:
    "See how TabTally combines native capture, on-device OCR, human-reviewed AI extraction, and shared Kotlin Multiplatform UI to split restaurant receipts.",
  openGraph: {
    title: "TabTally — From messy receipt to trustworthy split",
    description:
      "A recruiter-first product story covering Kotlin Multiplatform, on-device OCR, human-reviewed AI, and dependable bill-splitting logic.",
    type: "website",
    url: "https://anasahmed10.github.io/products/tabtally/",
    images: [
      {
        url: "/products/tabtally/og.png",
        width: 1536,
        height: 1024,
        alt: "TabTally product story",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TabTally — From messy receipt to trustworthy split",
    description: "Kotlin Multiplatform, on-device OCR, and human-reviewed mobile AI.",
    images: ["/products/tabtally/og.png"],
  },
};

const architecture = [
  {
    icon: Camera,
    number: "01",
    title: "Native input",
    copy: "Full-resolution Android camera capture, iOS camera integration, and gallery selection feed platform-neutral image bytes into shared code.",
  },
  {
    icon: Scan,
    number: "02",
    title: "On-device OCR",
    copy: "Bundled ML Kit on Android and Vision on iOS recognize receipt text without sending the original image to the AI extraction provider.",
  },
  {
    icon: GitBranch,
    number: "03",
    title: "Geometry reconstruction",
    copy: "Shared row reconstruction aligns names and prices, repairs split cents, and selectively improves weak money columns before extraction.",
  },
  {
    icon: BracketsCurly,
    number: "04",
    title: "Strict extraction",
    copy: "A centralized extractor requests schema-constrained receipt items, tax, and totals, then retries configured models or the OCR subtotal fallback.",
  },
  {
    icon: PencilSimple,
    number: "05",
    title: "Human review",
    copy: "People edit detected names and prices, assign individual and shared items, and control tip before any final amount is calculated.",
  },
  {
    icon: Database,
    number: "06",
    title: "Deterministic result",
    copy: "Shared business logic allocates tax, fees, tip, and unassigned items before saving an immutable local history snapshot and share text.",
  },
];

const journey = [
  { image: "ios-setup.png", step: "01", title: "Add the table", copy: "Start with everyone sharing the bill." },
  { image: "ios-scan.png", step: "02", title: "Scan the receipt", copy: "Capture it or choose a photo." },
  { image: "ios-review.png", step: "03", title: "Review the items", copy: "Correct names, prices, and totals." },
  { image: "ios-assign.png", step: "04", title: "Tap to split", copy: "Assign individual and shared items." },
  { image: "ios-summary.png", step: "05", title: "Ready to share", copy: "See a clear total for everyone." },
];

export default function TabTallyPage() {
  return (
    <main className="public-shell tabtally-shell">
      <PublicHeader active="products" />

      <section className="tabtally-hero" aria-labelledby="tabtally-title">
        <div className="tabtally-hero-copy">
          <a className="text-back-link" href="/products/">
            <ArrowLeft size={15} weight="bold" aria-hidden /> Products
          </a>
          <div className="tabtally-brand-line">
            <img src="/products/tabtally/app-icon.png" alt="" />
            <span>TabTally</span>
            <small>Coming soon · Android + iOS</small>
          </div>
          <p className="tabtally-kicker">KOTLIN MULTIPLATFORM · MOBILE AI · PRODUCT SYSTEMS</p>
          <h1 id="tabtally-title">From messy receipt to trustworthy split.</h1>
          <p className="tabtally-hero-lede">
            TabTally is a full product system: native image capture, on-device
            OCR, geometry-aware text reconstruction, strict-schema AI
            extraction, editable review, and fair split calculation in one
            shared Android and iOS experience.
          </p>
          <div className="tabtally-actions">
            <a className="tabtally-primary" href="#engineering">
              Explore the engineering <ArrowRight size={17} weight="bold" aria-hidden />
            </a>
            <a className="tabtally-secondary" href={SUPPORT_URL}>
              Visit Support
            </a>
          </div>
          <div className="tabtally-signals" aria-label="TabTally engineering highlights">
            <span><DeviceMobile size={18} weight="duotone" aria-hidden /> Shared Compose UI</span>
            <span><Eye size={18} weight="duotone" aria-hidden /> On-device OCR</span>
            <span><ShieldCheck size={18} weight="duotone" aria-hidden /> Human-reviewed AI</span>
          </div>
        </div>

        <div className="tabtally-device-stage" aria-label="TabTally running on Android and iOS">
          <div className="device-card device-card-back">
            <span>ANDROID</span>
            <img src="/products/tabtally/android-review.png" alt="TabTally review and assignment screen on Android" />
          </div>
          <div className="device-card device-card-front">
            <span>iOS</span>
            <img src="/products/tabtally/ios-summary.png" alt="TabTally split summary screen on iOS" />
          </div>
          <div className="stage-note">
            <Receipt size={22} weight="duotone" aria-hidden />
            <span>ONE WORKFLOW</span>
            <strong>Capture → review → split → share</strong>
          </div>
        </div>
      </section>

      <section className="tabtally-proof-strip" aria-label="TabTally product facts">
        <div><strong>2</strong><span>native platforms</span></div>
        <div><strong>1</strong><span>shared product core</span></div>
        <div><strong>100%</strong><span>editable before split</span></div>
        <div><strong>0</strong><span>payment processing</span></div>
      </section>

      <section id="engineering" className="tabtally-engineering" aria-labelledby="engineering-title">
        <div className="tabtally-section-heading">
          <p>01 · ENGINEERING STORY</p>
          <h2 id="engineering-title">A receipt is a small systems problem.</h2>
          <span>
            Imperfect images, tightly spaced columns, uncertain extraction,
            shared items, tax, fees, tip, and user trust all meet in one flow.
          </span>
        </div>
        <div className="architecture-grid">
          {architecture.map(({ icon: Icon, ...item }) => (
            <article key={item.number}>
              <div><span>{item.number}</span><Icon size={25} weight="duotone" aria-hidden /></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tabtally-stack" aria-labelledby="stack-title">
        <div>
          <p>02 · SHARED CORE, NATIVE EDGES</p>
          <h2 id="stack-title">Cross-platform without flattening the platforms.</h2>
          <p>
            Business logic, networking, persistence, navigation state, and
            Compose UI live in shared Kotlin. Camera, OCR, message composition,
            and platform storage bindings stay native where the operating
            systems demand it.
          </p>
        </div>
        <div className="stack-map">
          <div className="stack-native">
            <span>ANDROID EDGE</span>
            <strong>Camera · ML Kit · SMS intent</strong>
          </div>
          <div className="stack-core">
            <small>SHARED PRODUCT CORE</small>
            <strong>Kotlin Multiplatform</strong>
            <span>Compose · Ktor · Koin · SQLDelight</span>
          </div>
          <div className="stack-native">
            <span>iOS EDGE</span>
            <strong>Camera · Vision · MessageUI</strong>
          </div>
        </div>
      </section>

      <section className="tabtally-journey" aria-labelledby="journey-title">
        <div className="tabtally-section-heading">
          <p>03 · PRODUCT EXPERIENCE</p>
          <h2 id="journey-title">The complexity stays behind a four-step mental model.</h2>
          <span>Real, sanitized application screens from the Android and iOS release workflow.</span>
        </div>
        <div className="journey-track">
          {journey.map((item) => (
            <article key={item.step}>
              <div className="journey-phone">
                <img src={`/products/tabtally/${item.image}`} alt={`TabTally ${item.title} screen`} />
              </div>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tabtally-control" aria-labelledby="control-title">
        <div className="control-copy">
          <p>04 · RESPONSIBLE PRODUCT BEHAVIOR</p>
          <h2 id="control-title">AI proposes structure. People stay in control.</h2>
          <p>
            Receipt recognition is probabilistic, so TabTally never treats the
            first parse as the final bill. Names, prices, assignments, tip, and
            the receipt total remain visible before calculation.
          </p>
          <ul>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Original receipt images stay out of the AI extraction request.</li>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Receipt-derived text is sent securely to the configured AI provider.</li>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Users can correct every item before calculating.</li>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> TabTally calculates social splits; it does not process payments.</li>
          </ul>
          <a href={PRIVACY_URL}>Read the full privacy policy <ArrowRight size={16} weight="bold" aria-hidden /></a>
        </div>
        <div className="control-visual" aria-hidden="true">
          <div className="control-ring ring-one" />
          <div className="control-ring ring-two" />
          <div className="control-node node-input"><Camera size={24} weight="duotone" /><span>CAPTURE</span></div>
          <div className="control-node node-ocr"><Scan size={24} weight="duotone" /><span>OCR</span></div>
          <div className="control-node node-review"><UsersThree size={24} weight="duotone" /><span>REVIEW</span></div>
          <div className="control-core"><LockKey size={32} weight="duotone" /><strong>HUMAN<br />CONTROL</strong></div>
          <div className="control-node node-share"><ShareNetwork size={24} weight="duotone" /><span>SHARE</span></div>
        </div>
      </section>

      <section className="tabtally-availability">
        <img src="/products/tabtally/app-icon.png" alt="" />
        <div>
          <p>COMING SOON · ANDROID + iOS</p>
          <h2>Built carefully enough to review. Simple enough to use at dinner.</h2>
          <span>
            Store links will appear here when the public release is verified.
            Support and privacy information are available now.
          </span>
        </div>
        <div>
          <a className="tabtally-primary" href={SUPPORT_URL}>TabTally Support</a>
          <a className="tabtally-secondary" href={PRIVACY_URL}>Privacy Policy</a>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
