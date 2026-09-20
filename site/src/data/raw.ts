/**
 * Raw mode: the same career, told as a five-chapter reel.
 *
 * The facts here are the facts in identity.ts and projects.ts — this file is the
 * cinematic register of the same material, not a second set of claims. When
 * something changes about the work, it changes in both.
 */
import type { PhotoSlug } from "@/data/photos";
import { photos } from "@/data/photos";
import { identity } from "@/data/identity";

export { identity };

export type Theme = {
  /** Drives the WebGL ember + mist colour for this chapter. */
  ember: [number, number, number];
  mist: [number, number, number];
  /** CSS accent used by DOM elements inside the chapter. */
  accent: string;
};

export type Credit = { label: string; value: string };

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
  numeral: string;
  title: string;
  /** Small line above the title, mirroring an on-screen place stamp. */
  stamp: string;
  era: string;
  logline: string;
  theme: Theme;
  /**
   * The photograph used as this chapter's full-bleed plate. It is uploaded as a
   * WebGL texture and re-rendered as a contour schematic mid-chapter, so the
   * frame is part photograph and part diagram at the same time.
   */
  plate: PhotoSlug;
  /** The pattern the schematic pass is meant to expose in that photograph. */
  plateNote: string;
  works: Work[];
  credits: Credit[];
};

/** Raw mode's subtitle card. The readable site states the role plainly instead. */
export const rawSubtitle = "Search, Intelligence & Infrastructure";

export const prologue = {
  lines: [
    "Every system begins as a question.",
    "What do you know.",
    "And how would you find it again.",
  ],
  stamps: ["512 CE", "THRETAYUGA", "2026 CE"],
};

export const chapters: Chapter[] = [
  {
    id: "the-oracle",
    numeral: "I",
    stamp: "THE RETRIEVAL LAYER",
    title: "The Oracle",
    era: "SEARCH & APPLIED AI",
    logline:
      "Machines that read, retrieve and reason — and the discipline of making them admit what they do not know.",
    theme: { ember: [0.35, 0.72, 1.0], mist: [0.05, 0.1, 0.24], accent: "#5bb8ff" },
    plate: "wing-city-lights",
    plateNote: "A city from 30,000 feet → an index learning its own shape",
    works: [
      {
        title: "Enterprise Search",
        role: "Goldman Sachs",
        body: "Making a very large firm's own documents findable by the people already allowed to read them.",
        stack: ["Retrieval", "Evaluation", "Python"],
      },
      {
        title: "Shareholder Analytics",
        role: "Goldman Sachs",
        body: "Answering questions about who owns a company, from filings and market data, with the evidence attached to every answer.",
        stack: ["Agents", "Retrieval", "Evaluation"],
      },
      {
        title: "MCP, skills and dynamic workflows",
        role: "Currently building",
        body: "I’m working with my team on an MCP layer, reusable skills and dynamic workflows for AI tools.",
        stack: ["MCP", "Skills", "Workflows"],
      },
      {
        title: "Retrieval That Knows Its Limits",
        role: "Research Engineering",
        body: "Parameter-efficient tuning with LoRA over a hybrid retriever — dense vectors beside BM25 — so lexical and semantic recall cover each other's gaps instead of competing. Plus an experiment in neutralising gender directions in the embedding space, to see how much confident nonsense came from the representation rather than the prompt.",
        stack: ["LoRA / PEFT", "FAISS", "BM25", "Transformers"],
      },
      {
        title: "PII Leakage Detection & Masking",
        role: "Privacy ML",
        body: "A DeBERTa named-entity model that finds personal information inside unstructured documents and masks it at ingestion, so the unredacted version never reaches storage.",
        stack: ["DeBERTa", "NER", "PyTorch"],
        href: "https://github.com/sriramgurazada/Masking-of-PII-in-Documents",
        hrefLabel: "Repository",
      },
      {
        title: "Autonomous Travel Planner",
        role: "Agents",
        body: "A tool-using agent that decomposes a travel brief into constraints, queries live sources, and states which constraint each choice was serving — so a bad plan can be argued with rather than merely regenerated.",
        stack: ["LangChain", "Python", "LLM Tools"],
        href: "https://github.com/sriramgurazada/Travel_Agent",
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
    ],
    credits: [
      { label: "Now Working On", value: "Enterprise Search" },
      { label: "Retrieval", value: "Dense + Lexical" },
      { label: "Discipline", value: "Measure Before Tuning" },
    ],
  },
  {
    id: "the-gate",
    numeral: "II",
    stamp: "THE ENTERPRISE PERIMETER",
    title: "The Gate",
    era: "IDENTITY & ACCESS",
    logline:
      "Worked on single sign-on and multi-factor authentication across 200 applications.",
    theme: { ember: [1.0, 0.37, 0.12], mist: [0.22, 0.09, 0.04], accent: "#ff5f1f" },
    plate: "golden-gate",
    plateNote: "Suspension cables → the geometry of a trusted handshake",
    works: [
      {
        title: "Identity and access management",
        role: "IAM Engineering",
        body: "Worked on single sign-on and multi-factor authentication across 200 applications, as one engineer on a team. The count is the team's, not mine alone.",
        stack: ["PingFederate", "Azure AD", "SAML", "OIDC", "PKCE"],
      },
      {
        title: "Certificate Renewal Pipeline",
        role: "Reliability",
        body: "Signing certificates have a known lifetime, so renewal became a pipeline that runs before the date instead of an alert that fires after it. One recurring class of outage, removed from every federated integration at once.",
        stack: ["PingFederate", "Jenkins", "Python"],
      },
      {
        title: "Observability for Identity",
        role: "Monitoring",
        body: "Authentication flows instrumented so that failed logins, latency and policy regressions surface on a dashboard rather than in a support queue.",
        stack: ["Splunk", "Grafana", "Docker"],
      },
    ],
    credits: [
      { label: "Applications", value: "200" },
      { label: "Platforms", value: "Ping · Azure" },
      { label: "Class of Outage Removed", value: "Certificate Expiry" },
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
    theme: { ember: [0.95, 0.72, 0.3], mist: [0.16, 0.12, 0.05], accent: "#e5b45c" },
    plate: "antelope-canyon",
    plateNote: "Sandstone strata → time, written down and kept",
    works: [
      {
        title: "Heuristic Zoomed-Image Detection of Wild Animals",
        role: "Computer Vision",
        body: "Conservation surveying does not get clean imagery. A convolutional model trained to identify wildlife in heavily zoomed and degraded frames rather than in tidy ones, at 93.6% accuracy on its test set.",
        stack: ["CNN", "OpenCV", "Keras"],
        href: "https://www.irjet.net/archives/V7/i6/IRJET-V7I61073.pdf",
        hrefLabel: "Read the paper",
      },
      {
        title: "Smart Contracts for Hospital Records",
        role: "Blockchain",
        body: "A consortium blockchain for electronic health records, so a patient's history follows them between hospitals and any later alteration to it is detectable by construction rather than by audit.",
        stack: ["Consortium Blockchain", "Smart Contracts", "SHA"],
        href: "http://sersc.org/journals/index.php/IJAST/article/view/30660",
        hrefLabel: "Read the paper",
      },
      {
        title: "Term Deposit Subscription Prediction",
        role: "Machine Learning",
        body: "Comparative classification across random forests, J48 decision trees and logistic regression, reaching 96% accuracy with the hyperparameter search and the overfitting controls written down rather than summarised.",
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
    stamp: "PROJECTS AND EXPERIMENTS",
    title: "The Forge",
    era: "PRODUCT & PLAY",
    logline:
      "Full systems shipped end to end — hospital floors, event halls, a playable world bent around time, and one thing still in the fire.",
    theme: { ember: [0.9, 0.22, 0.35], mist: [0.19, 0.04, 0.09], accent: "#ff4d6d" },
    plate: "water-wall",
    plateNote: "Engineered water → a system holding steady under load",
    works: [
      {
        title: "Warranty Wala",
        role: "In Development",
        body: "The thing being built outside work: product warranties, and the paperwork that comes with them.",
        stack: ["Product", "Side Project"],
      },
      {
        title: "Temporal Nexus",
        role: "Game Development",
        body: "A PC game built in Unity at USC, instrumented so every playtest reported where players died, backtracked and gave up. Level design changed because of what came back, not because of what the team assumed.",
        stack: ["Unity", "C#", "Game Analytics"],
        href: "https://george230310.github.io/526-Gold/index.html",
        hrefLabel: "Play it",
      },
      {
        title: "Hospital Management System",
        role: "Full Stack",
        body: "A React front end for appointment booking and clinician search over a Node and GraphQL backend, with MongoDB holding records for staff across the floor.",
        stack: ["React", "Node.js", "GraphQL", "MongoDB"],
        href: "https://github.com/sriramgurazada/Hospital-Management-System",
        hrefLabel: "Repository",
      },
      {
        title: "Event Management Platform",
        role: "Backend",
        body: "A GraphQL service modelling events, registrations and attendee state, with a schema strict enough to keep the client honest.",
        stack: ["GraphQL", "Node.js", "JavaScript"],
        href: "https://github.com/sriramgurazada/Event_Management_System_graphql",
        hrefLabel: "Repository",
      },
    ],
    credits: [
      { label: "Discipline", value: "Front · Back · Engine" },
      { label: "Shipped", value: "Web · Game · API" },
      { label: "In The Fire", value: "Warranty Wala" },
    ],
  },
  {
    id: "the-ascent",
    numeral: "V",
    stamp: "DALLAS · PRESENT DAY",
    title: "The Ascent",
    era: "2026 CE",
    logline: "Working on search tools at Goldman Sachs in Dallas.",
    theme: { ember: [0.75, 0.85, 1.0], mist: [0.08, 0.11, 0.18], accent: "#c9d8f0" },
    plate: "emerald-lake",
    plateNote: "Treeline and ice → altitude that only arrives slowly",
    works: [
      {
        title: "M.S. Computer Science — University of Southern California",
        role: "Completed 2025",
        body: "Graduate study across machine learning, natural language processing and systems, taken alongside production engineering rather than instead of it.",
        stack: ["USC", "Machine Learning", "NLP"],
      },
      {
        title: "Software Engineer — Goldman Sachs",
        role: "Dallas, Texas",
        body: "Search and retrieval: the problem of making a very large organisation's own documents findable, with evaluation built before the tuning and permissions handled inside retrieval rather than after it.",
        stack: ["Retrieval", "Evaluation", "Python"],
      },
      {
        title: "Cloud & Automation Practice",
        role: "Infrastructure",
        body: "CI/CD for configuration and system health checks on AWS, containerised with Docker and orchestrated so that manual intervention becomes the exception.",
        stack: ["AWS", "Docker", "Kubernetes", "Jenkins"],
      },
    ],
    credits: [
      { label: "Based In", value: "Dallas, Texas" },
      { label: "Studied", value: "M.S. Computer Science, USC" },
      { label: "Working On", value: "Search & Retrieval" },
    ],
  },
];

/** Opening and closing plates, outside the numbered chapters. */
export const heroPlate: PhotoSlug = "balloon-flame";
export const finalePlate: PhotoSlug = "chicago-river";

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
 * The editorial interlude. The captions come from the photograph records, so
 * raw mode and the readable site never describe the same picture differently.
 */
export const fieldNoteSlugs: PhotoSlug[] = [
  "dallas-bridge",
  "water-wall",
  "balloon-flame",
  "wing-city-lights",
  "antelope-canyon",
  "waterfall-hike",
];

export const fieldNotes = fieldNoteSlugs.map((slug, i) => ({
  index: String(i + 1).padStart(2, "0"),
  label: photos[slug].label,
  caption: photos[slug].caption,
  plate: slug,
}));

export const fieldNotesIntro = {
  index: "III",
  label: "Field Notes",
  title: "Every place leaves a pattern.",
  subtitle: "A few things I noticed along the way.",
};

export const aboutCopy = [
  "I build the parts of a system that people only notice when they fail — the login that has to work at 3am, the retrieval that has to admit when the corpus cannot answer, the certificate that cannot be allowed to expire.",
  "That started in India with research papers and a blockchain for health records, ran through several years of identity and access management, went through a master's at USC, and continues now in Dallas on search.",
  "The photographs are from the same years.",
];
