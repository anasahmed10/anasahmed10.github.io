export type CampusDestinationId =
  | "origin"
  | "self-serve-copy"
  | "connected-vehicle"
  | "scanner-automation"
  | "tabtally"
  | "smartshopper"
  | "hobbies";

export type CampusDestination = {
  id: CampusDestinationId;
  type: "project" | "personal";
  visual:
    | "repair-workshop"
    | "copy-building"
    | "vehicle-garage"
    | "scanner-depot"
    | "receipt-cafe"
    | "shopping-boutique"
    | "maker-lab";
  navLabel: string;
  sceneLabel: string;
  accessibleName: string;
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
  link?: { label: string; href: string; external?: boolean };
};

export const CAMPUS_DESTINATIONS: CampusDestination[] = [
  {
    id: "origin",
    type: "personal",
    visual: "repair-workshop",
    navLabel: "About",
    sceneLabel: "Deer Computer Repairs",
    accessibleName:
      "Visit the Deer Computer Repairs workshop and read Anas Ahmed's origin story",
    kicker: "ABOUT ANAS",
    title: "Technical curiosity with a business edge.",
    summary:
      "At 17, I co-founded Deer Computer Repairs. Fixing, upgrading, and refurbishing PCs taught me to solve technical problems while earning a customer's trust.",
    impact: "Computer repair, customer service, and small-business ownership at 17",
    color: "#ff6f61",
    position: [-10, 0, -5.5],
    approach: [-10, 0, -1.9],
    height: 4.1,
    width: 4.8,
    details: [
      "I started by taking apart Windows PCs, changing software, and learning why machines failed.",
      "Deer Computer Repairs turned that curiosity into real responsibility: diagnose the problem, explain the tradeoffs, and stand behind the work.",
      "At university, mobile development gave me a way to combine software with the physical devices I had always enjoyed working on.",
    ],
    tech: ["PC repair", "Hardware upgrades", "Refurbishment", "Small business"],
  },
  {
    id: "self-serve-copy",
    type: "project",
    visual: "copy-building",
    navLabel: "Self-Serve Copy",
    sceneLabel: "Self-Serve Copy Building",
    accessibleName:
      "Visit the Self-Serve Copy Building and open the enterprise retail case study",
    kicker: "STAPLES · ENTERPRISE ANDROID",
    title: "An all-in-one self-service print, copy, and payment platform.",
    summary:
      "I served as lead architect, working with an external vendor, the UI team, and internal engineering partners to redesign the application for Android 13, replacing its Java and Android 7 foundation with Kotlin.",
    impact: "800+ locations · $0 vendor-technician rollout cost · zero production failures",
    color: "#2f66d0",
    position: [9, 0, -6],
    approach: [9, 0, -2.3],
    height: 5.6,
    width: 5.8,
    details: [
      "I led the architecture across the external vendor, UI team, and internal engineering partners, aligning the redesigned experience with Xerox hardware, payments, store networks, and support requirements.",
      "The full Android 13 redesign improved maintainability and enabled multilingual support plus Google Drive and Dropbox workflows across Xerox self-service devices.",
      "I implemented Apple Pay and Google Pay support within the same retail flow.",
      "During a bank-mandated payment-terminal software update, I helped design a four-stage local upgrade process that brought vendor-technician cost for the rollout to $0. It reached more than 800 locations with zero production failures.",
      "I also built real-time printer status-light monitoring in Splunk so technical teams and management could see issue duration and frequency.",
    ],
    tech: ["Kotlin", "Android 13", "Xerox", "Payments", "PIN pads", "Splunk"],
    link: {
      label: "View enterprise experience",
      href: "/recruiter/#experience",
    },
  },
  {
    id: "connected-vehicle",
    type: "project",
    visual: "vehicle-garage",
    navLabel: "Vehicle App",
    sceneLabel: "Connected Vehicle App Garage",
    accessibleName:
      "Visit the Connected Vehicle App Garage and open the mobile platform case study",
    kicker: "GENERAL MOTORS · MOBILE PLATFORM",
    title: "Platform work for a connected-vehicle companion app.",
    summary:
      "I worked on the delivery and navigation systems around an Android and iOS vehicle companion experience.",
    impact: "Android + iOS visibility · one shared deep-link entry point",
    color: "#4f7ee8",
    position: [0, 0, -10.8],
    approach: [0, 0, -6.8],
    height: 3.9,
    width: 6.2,
    details: [
      "I built a web dashboard that pulled Jenkins pipeline data into a clear view of Android and iOS app-size changes.",
      "I deployed mobile build and release pipelines in Azure DevOps.",
      "I created a Universal Deep Link Handler in React Native to consolidate routing, improve user flow, and make future mobile development easier.",
    ],
    tech: ["React Native", "Jenkins", "Azure DevOps", "Android", "iOS"],
    link: {
      label: "View General Motors experience",
      href: "/recruiter/#experience",
    },
  },
  {
    id: "scanner-automation",
    type: "project",
    visual: "scanner-depot",
    navLabel: "Scanner Automation",
    sceneLabel: "Scanner Automation Depot",
    accessibleName:
      "Visit the Scanner Automation Depot and open the POS automation case study",
    kicker: "STAPLES · AUTOMATION",
    title: "A physical test lane controlled by an Android tablet.",
    summary:
      "I built the company's first Kotlin Android application and used a tablet-hosted local server to connect a barcode scanner with repeatable POS tests.",
    impact: "65 tests · 55% more POS automation · first place",
    color: "#42b883",
    position: [-10, 0, 6],
    approach: [-10, 0, 9.5],
    height: 4.8,
    width: 5.4,
    details: [
      "The greenfield application paired Jetpack Compose and MVVM with Coroutines, LiveData, and NanoHttpd.",
      "Physical scan events flowed through a local tablet server into repeatable POS checkpoints.",
      "The project automated 65 test cases, increased POS automation by 55%, and won first place in the 2025 company hackathon.",
    ],
    tech: ["Kotlin", "Jetpack Compose", "MVVM", "NanoHttpd", "Barcode scanners"],
    link: {
      label: "Read the automation case study",
      href: "/recruiter/#featured-systems",
    },
  },
  {
    id: "tabtally",
    type: "project",
    visual: "receipt-cafe",
    navLabel: "TabTally",
    sceneLabel: "TabTally Receipt Café",
    accessibleName:
      "Visit the TabTally Receipt Cafe and open the receipt-splitting product story",
    kicker: "PERSONAL PRODUCT · KOTLIN MULTIPLATFORM",
    title: "From a messy receipt to a trustworthy split.",
    summary:
      "I designed and built a Kotlin Multiplatform product that turns receipt capture, OCR, reviewed AI extraction, item assignment, and bill splitting into one clear flow.",
    impact: "Shared Android + iOS product · editable before calculation",
    color: "#ffbf3f",
    position: [9.5, 0, 6],
    approach: [9.5, 0, 9.6],
    height: 4.2,
    width: 5.4,
    details: [
      "ML Kit on Android and Apple Vision on iOS recognize receipt text on device.",
      "Shared geometry reconstruction repairs weak rows before strict-schema extraction through Groq.",
      "People review names, prices, assignments, tip, and totals before deterministic shared logic calculates the split.",
      "Compose Multiplatform, Ktor, Koin, and SQLDelight support one product across both platforms.",
    ],
    tech: ["Kotlin Multiplatform", "Compose", "ML Kit", "Vision", "Groq", "SQLDelight"],
    link: { label: "Explore TabTally", href: "/products/tabtally/" },
  },
  {
    id: "smartshopper",
    type: "project",
    visual: "shopping-boutique",
    navLabel: "SmartShopper",
    sceneLabel: "SmartShopper AI Boutique",
    accessibleName:
      "Visit the SmartShopper AI Boutique and open the AI shopping assistant project",
    kicker: "PERSONAL AI · SHOPPING RESEARCH",
    title: "Shopping research that explains the tradeoffs.",
    summary:
      "I designed and deployed a custom AI shopping assistant that researches products and generates personalized recommendations based on budget, material, fit, style, seller reputation, ratings, review volume, and retailer availability.",
    impact: "Budget-to-premium comparisons · purchase-ready links · reusable across 5+ categories",
    color: "#27b8a6",
    position: [12.6, 0, 0],
    approach: [14.2, 0, 3.1],
    height: 4.9,
    width: 4.6,
    details: [
      "The workflow asks targeted clarifying questions before researching products, so each recommendation is grounded in the shopper's actual constraints.",
      "It compares budget, mid-tier, and premium options, provides purchase-ready links, and explains the value tradeoffs across recommendations.",
      "The reusable instruction system adapts its research to clothing, electronics, home improvement, cookware, hardware, and other shopping categories.",
    ],
    tech: ["Custom GPT", "Prompt Engineering", "Web Research"],
    link: {
      label: "Open SmartShopper",
      href: "https://chatgpt.com/g/g-6a4be8c0f2ac8191a2e34a57b52f46ee-smartshopper",
      external: true,
    },
  },
  {
    id: "hobbies",
    type: "personal",
    visual: "maker-lab",
    navLabel: "Hobbies",
    sceneLabel: "Maker & Game Lab",
    accessibleName:
      "Visit the Maker and Game Lab and read about Anas Ahmed's hobbies",
    kicker: "HOBBIES · MAKING AND PLAY",
    title: "I still like learning with my hands.",
    summary:
      "Outside work, I spend time with 3D printing and dabble in Godot game design, especially the feel and physics of platformers.",
    impact: "3D printing · Godot · platformer physics",
    color: "#9b6ce0",
    position: [0, 0, 11],
    approach: [0, 0, 7.4],
    height: 4.5,
    width: 5.2,
    details: [
      "3D printing gives me a direct loop between a digital model and a physical result.",
      "Godot is where I experiment with movement, collision, momentum, and the small details that make platforming feel good.",
      "Both hobbies keep the same curiosity that started with taking apart PCs at 17.",
    ],
    tech: ["3D printing", "Godot", "Game design", "Platformer physics"],
  },
];

export const FEATURED_PROJECTS = CAMPUS_DESTINATIONS.filter(
  (destination) => destination.type === "project",
);
