export type Theme = {
  /** Drives the WebGL ember + mist colour for this chapter. */
  ember: [number, number, number];
  mist: [number, number, number];
  /** CSS accent used by DOM elements inside the chapter. */
  accent: string;
};

export type Credit = {
  label: string;
  value: string;
};

export type Work = {
  title: string;
  role: string;
  body: string;
  stack: string[];
  href?: string;
  hrefLabel?: string;
};

export type Chapter = {
  id: string;
  /** Roman numeral shown on the era card. */
  numeral: string;
  /** Large title on the era card. */
  title: string;
  /** Small line above the title, mirrors the glimpse's place/era stamps. */
  stamp: string;
  /** Era stamp shown bottom-right of the card. */
  era: string;
  /** One-line thesis for the chapter. */
  logline: string;
  theme: Theme;
  /**
   * The photograph used as this chapter's full-bleed plate. It is uploaded as
   * a WebGL texture and re-rendered as a contour schematic mid-chapter, so the
   * frame is part photograph and part diagram at the same time.
   */
  plate: string;
  /** The pattern the schematic pass is meant to expose in that photograph. */
  plateNote: string;
  works: Work[];
  credits: Credit[];
};

export type FieldNote = {
  index: string;
  label: string;
  caption: string;
  plate: string;
};

export const identity = {
  name: "Devi Venkata Sai Sriram Chandra Gurazada",
  shortName: "Sriram Chandra Gurazada",
  titleCard: "GURAZADA",
  subtitle: "Identity, Intelligence & Infrastructure",
  location: "Los Angeles, California",
  email: "ramgurazada1@gmail.com",
  linkedin: "https://linkedin.com/in/gschandra123",
  github: "https://github.com/sriramgurazada",
};

export const prologue = {
  lines: [
    "Every system begins as a question.",
    "Who are you.",
    "And what are you permitted to know.",
  ],
  stamps: ["512 CE", "THRETAYUGA", "2027 CE"],
};

export const chapters: Chapter[] = [
  {
    id: "the-gate",
    numeral: "I",
    stamp: "THE ENTERPRISE PERIMETER",
    title: "The Gate",
    era: "IDENTITY & ACCESS",
    logline:
      "A thousand doors, one keeper. Federated identity at the scale where a single misconfiguration becomes a breach.",
    theme: {
      ember: [1.0, 0.37, 0.12],
      mist: [0.22, 0.09, 0.04],
      accent: "#ff5f1f",
    },
    plate: "/photos/golden-gate.jpg",
    plateNote: "Suspension cables → the geometry of a trusted handshake",
    works: [
      {
        title: "PingFederate & Azure AD Federation",
        role: "IAM Engineering",
        body: "Integrated over 1,000 applications across SAML, OIDC and PKCE flows, delivering single sign-on and multi-factor authentication for workforce and customer identity under federal standards.",
        stack: ["PingFederate", "Azure AD", "SAML", "OIDC", "PKCE", "OAuth"],
      },
      {
        title: "CyberArk Secret Manager Automation",
        role: "Automation",
        body: "Automated credential rotation end to end, cutting password renewal effort by 80% and enabling dynamic secret retrieval for LDAP, JDBC and REST integrations.",
        stack: ["CyberArk", "LDAP", "JDBC", "REST"],
      },
      {
        title: "SAML Certificate Renewal Pipeline",
        role: "Reliability",
        body: "Built tooling that renews SAML signing certificates before expiry, removing a recurring class of outage from every federated integration in the estate.",
        stack: ["PingFederate", "Jenkins", "Python"],
      },
      {
        title: "Observability for Identity",
        role: "Monitoring",
        body: "Instrumented authentication flows with Splunk and Grafana so failed logins, latency spikes and policy regressions surface before users report them.",
        stack: ["Splunk", "Grafana", "Docker"],
      },
    ],
    credits: [
      { label: "Applications Onboarded", value: "1000+" },
      { label: "Renewal Effort Removed", value: "80%" },
      { label: "Platforms", value: "Ping · Azure · CyberArk · Okta" },
    ],
  },
  {
    id: "the-oracle",
    numeral: "II",
    stamp: "THE RETRIEVAL LAYER",
    title: "The Oracle",
    era: "APPLIED INTELLIGENCE",
    logline:
      "Machines that read, retrieve and reason — and the discipline of making them admit what they do not know.",
    theme: {
      ember: [0.35, 0.72, 1.0],
      mist: [0.05, 0.1, 0.24],
      accent: "#5bb8ff",
    },
    plate: "/photos/wing-city-lights.jpg",
    plateNote: "A city from 30,000 feet → a network learning its own shape",
    works: [
      {
        title: "AI Exam Evaluator",
        role: "RAG · OCR",
        body: "An grading system that reads handwritten student scripts with AWS Textract and evaluates them against source material through retrieval-augmented generation, improving grading efficiency by 35%.",
        stack: ["Llama 3.2", "AWS Textract", "RAG", "Python"],
        href: "https://github.com/sriramgurazada/AI-Exam-Evaluator",
        hrefLabel: "Repository",
      },
      {
        title: "Stabilising Retrieval-Augmented LLMs",
        role: "Research Engineering",
        body: "Tuned RAG systems with PEFT and LoRA for a 30% gain in context relevance, lifted BLEU by 20% through hybrid FAISS and BM25 retrieval, and neutralised gender vectors to suppress hallucination and bias.",
        stack: ["LoRA / PEFT", "FAISS", "BM25", "Transformers"],
      },
      {
        title: "PII Leakage Detection & Masking",
        role: "Privacy ML",
        body: "A DeBERTa named-entity model that finds and masks personally identifiable information inside unstructured documents before they ever reach downstream storage.",
        stack: ["DeBERTa", "NER", "PyTorch"],
        href: "https://github.com/sriramgurazada/Masking-of-PII-in-Documents",
        hrefLabel: "Repository",
      },
      {
        title: "Sentiment Analysis at Scale",
        role: "NLP",
        body: "Neural classifiers over Word2Vec embeddings trained on Amazon review corpora, benchmarked across architectures for accuracy and generalisation.",
        stack: ["Word2Vec", "CNN", "scikit-learn"],
        href: "https://github.com/sriramgurazada/Sentimental-Analysis",
        hrefLabel: "Repository",
      },
      {
        title: "Autonomous Travel Planner",
        role: "Agents",
        body: "A tool-using agent that decomposes a travel brief into constraints, queries live sources and returns a defensible day-by-day itinerary.",
        stack: ["LangChain", "Python", "LLM Tools"],
        href: "https://github.com/sriramgurazada/Travel_Agent",
        hrefLabel: "Repository",
      },
    ],
    credits: [
      { label: "Grading Efficiency", value: "+35%" },
      { label: "Context Relevance", value: "+30%" },
      { label: "BLEU Improvement", value: "+20%" },
    ],
  },
  {
    id: "the-archive",
    numeral: "III",
    stamp: "THE PERMANENT RECORD",
    title: "The Archive",
    era: "PUBLISHED RESEARCH",
    logline:
      "Work that had to survive peer review — wildlife seen from impossible distances, health records that cannot be forged.",
    theme: {
      ember: [0.95, 0.72, 0.3],
      mist: [0.16, 0.12, 0.05],
      accent: "#e5b45c",
    },
    plate: "/photos/antelope-canyon.jpg",
    plateNote: "Sandstone strata → time, written down and kept",
    works: [
      {
        title: "Heuristic Zoomed-Image Detection of Wild Animals",
        role: "Computer Vision",
        body: "A convolutional model that identifies wildlife in heavily zoomed and degraded frames at 93.6% accuracy, built to support conservation surveying where clean imagery is a luxury.",
        stack: ["CNN", "OpenCV", "Keras"],
        href: "https://www.irjet.net/archives/V7/i6/IRJET-V7I61073.pdf",
        hrefLabel: "Read the paper",
      },
      {
        title: "Smart Contracts for Hospital Records",
        role: "Blockchain",
        body: "A consortium blockchain for electronic health records so a patient's history follows them between hospitals, secured by cryptographic hashing that makes tampering detectable by construction.",
        stack: ["Consortium Blockchain", "Smart Contracts", "SHA"],
        href: "http://sersc.org/journals/index.php/IJAST/article/view/30660",
        hrefLabel: "Read the paper",
      },
      {
        title: "Term Deposit Subscription Prediction",
        role: "Machine Learning",
        body: "Comparative classification across Random Forest, J48 decision trees and logistic regression, reaching 96% accuracy through hyperparameter tuning and disciplined overfitting control.",
        stack: ["Random Forest", "J48", "Logistic Regression"],
        href: "https://www.irjet.net/archives/V9/i8/IRJET-V9I8135.pdf",
        hrefLabel: "Read the paper",
      },
    ],
    credits: [
      { label: "Peer-Reviewed Papers", value: "03" },
      { label: "Detection Accuracy", value: "93.6%" },
      { label: "Classification Accuracy", value: "96%" },
    ],
  },
  {
    id: "the-forge",
    numeral: "IV",
    stamp: "WORLDS BUILT FROM NOTHING",
    title: "The Forge",
    era: "PRODUCT & PLAY",
    logline:
      "Full systems shipped end to end — hospital floors, event halls, and a playable world bent around time.",
    theme: {
      ember: [0.9, 0.22, 0.35],
      mist: [0.19, 0.04, 0.09],
      accent: "#ff4d6d",
    },
    plate: "/photos/water-wall.jpg",
    plateNote: "Engineered water → a system holding steady under load",
    works: [
      {
        title: "Hospital Management System",
        role: "Full Stack",
        body: "A React front end for appointment booking and clinician search over a Node and GraphQL backend, with MongoDB holding real-time health records for staff across the floor.",
        stack: ["React", "Node.js", "GraphQL", "MongoDB"],
        href: "https://github.com/sriramgurazada/Hospital-Management-System",
        hrefLabel: "Repository",
      },
      {
        title: "Temporal Nexus",
        role: "Game Development",
        body: "A PC game built in Unity and C# at USC, instrumented with an analytics pipeline that fed real player behaviour back into level design across iterations.",
        stack: ["Unity", "C#", "Game Analytics"],
        href: "https://george230310.github.io/526-Gold/index.html",
        hrefLabel: "Play it",
      },
      {
        title: "Event Management Platform",
        role: "Backend",
        body: "A GraphQL service modelling events, registrations and attendee state with a schema designed to keep the client honest.",
        stack: ["GraphQL", "Node.js", "JavaScript"],
        href: "https://github.com/sriramgurazada/Event_Management_System_graphql",
        hrefLabel: "Repository",
      },
    ],
    credits: [
      { label: "Discipline", value: "Front · Back · Engine" },
      { label: "Shipped", value: "Web · Game · API" },
      { label: "Data", value: "MongoDB · GraphQL" },
    ],
  },
  {
    id: "the-ascent",
    numeral: "V",
    stamp: "LOS ANGELES · PRESENT DAY",
    title: "The Ascent",
    era: "2027 CE",
    logline:
      "A master's at USC, cloud systems that scale without supervision, and the next thing already in motion.",
    theme: {
      ember: [0.75, 0.85, 1.0],
      mist: [0.08, 0.11, 0.18],
      accent: "#c9d8f0",
    },
    plate: "/photos/emerald-lake.jpg",
    plateNote: "Treeline and ice → altitude that only arrives slowly",
    works: [
      {
        title: "M.S. Computer Science — University of Southern California",
        role: "Education",
        body: "Graduate study across machine learning, natural language processing and systems, taken alongside production identity engineering rather than instead of it.",
        stack: ["USC", "Machine Learning", "NLP"],
      },
      {
        title: "Cloud & Automation Practice",
        role: "Infrastructure",
        body: "CI/CD for identity configuration and system health checks on AWS, containerised with Docker and orchestrated so that manual intervention becomes the exception.",
        stack: ["AWS", "Docker", "Kubernetes", "Jenkins"],
      },
      {
        title: "Campus Safety Analysis",
        role: "Data Science",
        body: "An analytical study of campus safety incident data, turning raw reporting into patterns that can actually inform decisions.",
        stack: ["Python", "Pandas", "Jupyter"],
        href: "https://github.com/sriramgurazada/usc-campus-safety-analysis",
        hrefLabel: "Repository",
      },
    ],
    credits: [
      { label: "Based In", value: "Los Angeles" },
      { label: "Studying", value: "M.S. Computer Science" },
      { label: "Status", value: "Open to Work" },
    ],
  },
];

export const capabilities = [
  {
    group: "Identity & Access",
    items: ["PingFederate", "Azure AD", "CyberArk", "Okta", "SAML", "OIDC", "OAuth", "MFA", "SSO"],
  },
  {
    group: "Artificial Intelligence",
    items: ["RAG", "LLMs", "PyTorch", "TensorFlow", "Transformers", "LangChain", "FAISS", "spaCy", "YOLO"],
  },
  {
    group: "Languages",
    items: ["Python", "Java", "C", "JavaScript", "TypeScript", "SQL", "GraphQL", "C#"],
  },
  {
    group: "Platform",
    items: ["AWS", "Docker", "Kubernetes", "Jenkins", "MongoDB", "Splunk", "Grafana", "Django", "Node.js"],
  },
];

/** Opening and closing plates, outside the numbered chapters. */
export const heroPlate = "/photos/balloon-flame.jpg";
export const finalePlate = "/photos/chicago-river.jpg";

/**
 * The closing plate is a warm city at night, so the epilogue takes back the
 * opening ember rather than inheriting the cold accent of the last chapter.
 */
export const finaleTheme: Theme = {
  ember: [1.0, 0.68, 0.32],
  mist: [0.14, 0.1, 0.06],
  accent: "#f0a850",
};

/**
 * The editorial interlude. Same idea as the chapters — a real photograph and
 * the pattern hiding inside it — but presented as paired notes rather than
 * full-bleed cinema.
 */
export const fieldNotes: FieldNote[] = [
  {
    index: "01",
    label: "Connections",
    caption: "Bridge cables → mountain contours. The same curve, solved twice.",
    plate: "/photos/golden-gate.jpg",
  },
  {
    index: "02",
    label: "Flow",
    caption: "Water moves. The frame stays still.",
    plate: "/photos/water-wall.jpg",
  },
  {
    index: "03",
    label: "Ignition",
    caption: "Nothing rises without something burning underneath it.",
    plate: "/photos/balloon-flame.jpg",
  },
  {
    index: "04",
    label: "Grid",
    caption: "Every city is a graph, if you get far enough above it.",
    plate: "/photos/wing-city-lights.jpg",
  },
  {
    index: "05",
    label: "Strata",
    caption: "Time, stored as layers, readable by anyone who stops to look.",
    plate: "/photos/antelope-canyon.jpg",
  },
  {
    index: "06",
    label: "Scale",
    caption: "A person, for scale. Always worth including.",
    plate: "/photos/waterfall-hike.jpg",
  },
];

export const fieldNotesIntro = {
  index: "III",
  label: "Field Notes",
  title: "Every place leaves a pattern.",
  subtitle: "A few things I noticed along the way.",
};

/** Photographs of the person rather than the places. */
export const portraits = {
  headshot: "/photos/headshot.jpg",
  usc: "/photos/usc-steps-of-troy.jpg",
  traveler: "/photos/usc-traveler.jpg",
  undergrad: "/photos/undergrad-computer-block.jpg",
  hollywood: "/photos/hollywood-sign.jpg",
};

export const aboutCopy = [
  "I build the parts of a system that people only notice when they fail — the login that has to work at 3am, the pipeline that has to keep a model honest, the certificate that cannot be allowed to expire.",
  "That started in India with research papers and a blockchain for health records, ran through several years of federated identity at enterprise scale, and continues now at USC in Los Angeles.",
  "The photographs are from the same years. I tend to notice structure — cables, strata, grids, flow — which turns out to be the same instinct that makes the engineering work.",
];

/** Where the portrait photographs sit on the timeline. */
export const record = [
  { year: "2020", place: "India", note: "First publications. CNNs for wildlife, blockchain for hospitals.", photo: portraits.undergrad },
  { year: "2021", place: "Enterprise IAM", note: "A thousand applications, federated one integration at a time.", photo: null },
  { year: "2024", place: "Los Angeles", note: "USC. Machine learning, NLP, and a game engine on the side.", photo: portraits.hollywood },
  { year: "2025", place: "Steps of Troy", note: "M.S. Computer Science, University of Southern California.", photo: portraits.usc },
];
