/**
 * Public profile. Everything here is a plain fact about the owner and is meant
 * to be edited by hand; nothing else in the codebase hard-codes any of it.
 */

export const identity = {
  name: "Devi Venkata Sai Sriram Chandra Gurazada",
  /** The name used everywhere in public. */
  shortName: "Sriram Gurazada",
  /** The raw-mode title card, which wants one word. */
  titleCard: "GURAZADA",
  role: "Software engineer",
  location: "Dallas, Texas",
  employer: "Goldman Sachs",
};

/**
 * Only real destinations belong here. A contact action with no destination is
 * omitted from the layout rather than rendered as a dead link — see the README
 * for what is still missing.
 */
export const contact = {
  email: "ramgurazada1@gmail.com",
  linkedin: "https://linkedin.com/in/gschandra123",
  github: "https://github.com/sriramgurazada",
  /** No public résumé URL yet, so no résumé button. */
  resume: null as string | null,
};

export const contactLinks = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { label: "LinkedIn", value: "in/gschandra123", href: contact.linkedin },
  { label: "GitHub", value: "sriramgurazada", href: contact.github },
];

export const hero = {
  headline: "Curiosity, engineered.",
  lines: ["Software engineer in Dallas.", "Building useful systems. Exploring what comes next."],
};

export const about = {
  heading: "My path.",
  /** Kept short on purpose. The work pages carry the detail. */
  body: [
    "I am a software engineer in Dallas. I work on search and retrieval at Goldman Sachs — the problem of making a very large organisation's own documents findable by the people already allowed to read them.",
    "Before that I spent several years on federated identity, which is the unglamorous business of making sure a thousand applications all agree about who you are. It teaches you to care about the failure modes first.",
    "I studied computer science at USC and finished in 2025. Before that I was in India, publishing research on computer vision and on health records that cannot be quietly edited.",
    "The photographs are from the same years. I notice structure — cables, contours, grids, flow — which turns out to be the same instinct that makes the engineering work.",
  ],
};

export type Milestone = {
  year: string;
  place: string;
  note: string;
  /** A photograph, where one exists for that milestone. */
  photo: "undergrad-computer-block" | "hollywood-sign" | "usc-steps-of-troy" | null;
};

export const path: Milestone[] = [
  {
    year: "2020",
    place: "India",
    note: "Undergraduate in computer science, and the first three papers.",
    photo: "undergrad-computer-block",
  },
  {
    year: "2021",
    place: "Enterprise identity",
    note: "A thousand applications, federated one integration at a time.",
    photo: null,
  },
  {
    year: "2023",
    place: "Los Angeles",
    note: "USC. Machine learning, natural language processing, and a game engine on the side.",
    photo: "hollywood-sign",
  },
  {
    year: "2025",
    place: "Steps of Troy",
    note: "M.S. Computer Science, University of Southern California.",
    photo: "usc-steps-of-troy",
  },
  {
    year: "2026",
    place: "Dallas",
    note: "Search and retrieval at Goldman Sachs.",
    photo: null,
  },
];

/**
 * Chapter 05. These are interests and directions, labelled as such — not
 * claimed expertise and not a services list.
 */
export const nextHorizon = {
  heading: "Next horizon.",
  standfirst: "Three things I want to keep working on. Interests, not credentials.",
  interests: [
    {
      title: "Search and retrieval",
      body: "The part of the problem nobody demos: knowing which of your million documents is the one, and being able to prove it was.",
    },
    {
      title: "AI you can actually depend on",
      body: "Systems whose confidence tracks the evidence, and that say so when the evidence runs out. Evaluation before cleverness.",
    },
    {
      title: "Agents that do real work",
      body: "Tool-using agents held to the same bar as any other software: observable, interruptible, and able to explain which constraint a decision was serving.",
    },
  ],
};

export const capabilities = [
  {
    group: "Search & AI",
    items: ["Retrieval", "RAG", "Evaluation", "PyTorch", "Transformers", "LangChain", "FAISS", "spaCy"],
  },
  {
    group: "Identity & access",
    items: ["PingFederate", "Azure AD", "Okta", "CyberArk", "SAML", "OIDC", "OAuth", "MFA"],
  },
  {
    group: "Languages",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "GraphQL", "C", "C#"],
  },
  {
    group: "Platform",
    items: ["AWS", "Docker", "Kubernetes", "Jenkins", "MongoDB", "Splunk", "Grafana", "Node.js"],
  },
];

export const contactSection = {
  heading: "Have a problem worth building for?",
  standfirst: "Let’s talk. I read everything that arrives, and I answer the ones that are about the work.",
};
