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

/**
 * Chapter 03. A short, general way of working.
 *
 * Three stages, on purpose. The longer implementation language belongs on the
 * project pages that actually use it, not on the homepage.
 */
export const pipeline = {
  heading: "How it runs.",
  standfirst:
    "A general way of working. Not a claim that every project uses the same architecture.",
  stages: [
    {
      id: "find",
      name: "Find",
      role: "Find information",
      detail: "Get the right material in front of you before you act on it.",
    },
    {
      id: "act",
      name: "Act",
      role: "Take action",
      detail: "Do the work that information actually supports.",
    },
    {
      id: "check",
      name: "Check",
      role: "Check results",
      detail: "See whether it did what it was supposed to.",
    },
  ],
};

export const about = {
  heading: "Grounded. Curious. Still exploring.",
  /** Kept short on purpose. The work pages carry the detail. */
  body: [
    "I am a software engineer in Dallas. I work on shareholder analytics and enterprise search at Goldman Sachs — questions about who owns a company, and the problem of making a very large organisation's own documents findable by the people already allowed to read them.",
    "Before that I spent several years on identity and access management: single sign-on and multi-factor authentication across 200 applications, as one engineer on a team.",
    // TODO: confirm the USC year. Public copy still says 2025; the degree may have been completed in December 2024.
    "I studied computer science at USC and finished in 2025. Before that I was in India, publishing research on computer vision and on health records that cannot be quietly edited.",
    "The photographs are from the same years.",
  ],
};

/**
 * Three frames instead of a timeline.
 *
 * A year-by-year list was the obvious way to present a career and the wrong one:
 * it read as a CV rendered vertically, and the dates were the least interesting
 * thing on the page. The prose above carries the chronology, so these three only
 * have to do what photographs do — put a face and two real moments next to it.
 */
export const portraits = [
  {
    photo: "headshot",
    label: "The engineer",
    caption: "Dallas, currently. Search, retrieval and agents at Goldman Sachs.",
  },
  {
    photo: "usc-steps-of-troy",
    label: "The path",
    caption: "M.S. Computer Science, USC, 2025. On the Steps of Troy, for once holding still.",
  },
  {
    photo: "sunset-dock",
    label: "What comes next",
    caption: "Undecided, which is the point. There is always more of it.",
  },
] as const;

/**
 * Chapter 05. These are interests and directions, labelled as such — not
 * claimed expertise and not a services list.
 */
export const nextHorizon = {
  heading: "Next horizon.",
  standfirst: "Three things I want to keep working on.",
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
    group: "AI & Search",
    items: ["Retrieval", "RAG", "Evaluation", "PyTorch", "Transformers", "LangChain", "FAISS"],
  },
  {
    group: "Software Development",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "GraphQL", "C", "C#"],
  },
  {
    group: "Cloud & Tools",
    items: ["AWS", "Docker", "Kubernetes", "Jenkins", "MongoDB", "Splunk", "Grafana", "Node.js"],
  },
  {
    group: "Identity & Access",
    items: ["PingFederate", "Azure AD", "SAML", "OIDC", "OAuth", "MFA"],
  },
];

/**
 * Homepage and work-index teaser. Not a case study: it is one related area
 * still being built, not three finished products.
 *
 * TODO: what the MCP layer connects to, and which workflows the skills and
 * dynamic workflows currently support.
 */
export const nowBuilding = {
  title: "MCP, skills and dynamic workflows",
  category: "Applied AI",
  status: "Currently building",
  summary: "I’m working with my team on an MCP layer, reusable skills and dynamic workflows for AI tools.",
};

export const contactSection = {
  heading: "Have a project or idea in mind?",
  standfirst: "I’d love to hear about it.",
};
