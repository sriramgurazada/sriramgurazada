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
 * Chapter 03. How a question becomes a defensible answer.
 *
 * This replaced a year-by-year timeline, which said where the owner had been
 * without saying what he does. These are the stages that actually recur across
 * the retrieval and agent work, described generically: no employer's
 * architecture is being disclosed by writing down that retrieval comes before
 * reasoning.
 *
 * `detail` is the line that earns the stage its place — a specific failure it
 * exists to prevent, rather than a restatement of its own name.
 */
export const pipeline = {
  heading: "How a question becomes an answer.",
  standfirst:
    "The same six stages keep showing up, whether the thing being built is a search box or an agent. Most of the engineering is in the last two.",
  stages: [
    {
      id: "ingest",
      name: "Ingest",
      role: "Documents arrive",
      detail:
        "Permissions are attached here, at the door. Anything that treats access as a filter applied later has already retrieved something it should not have.",
    },
    {
      id: "retrieve",
      name: "Retrieve",
      role: "Millions become a handful",
      detail:
        "Lexical and semantic matching fail on different questions, so both run and their disagreement is treated as information rather than noise.",
    },
    {
      id: "ground",
      name: "Ground",
      role: "Every claim keeps its source",
      detail:
        "A figure that cannot be traced back to the document it came from is not a weaker answer. It is an unusable one.",
    },
    {
      id: "reason",
      name: "Reason",
      role: "The agent plans and calls tools",
      detail:
        "Decomposed into steps that can each be inspected, because one opaque call returning a confident paragraph cannot be debugged or defended.",
    },
    {
      id: "verify",
      name: "Verify",
      role: "Check before it ships",
      detail:
        "Held against an evaluation set written to catch the failures nobody thought of, since the cases you invent yourself will flatter you.",
    },
    {
      id: "observe",
      name: "Observe",
      role: "Watch it in production",
      detail:
        "Retrieval quality drifts as the corpus moves underneath it. Without this stage you find out from a user, months late.",
    },
  ],
};

export const about = {
  heading: "Grounded. Curious. Still exploring.",
  /** Kept short on purpose. The work pages carry the detail. */
  body: [
    "I am a software engineer in Dallas. I work on shareholder analytics and enterprise search at Goldman Sachs — questions about who owns a company, and the problem of making a very large organisation's own documents findable by the people already allowed to read them.",
    "Before that I spent several years on federated identity, which is the unglamorous business of making sure a thousand applications all agree about who you are. It teaches you to care about the failure modes first.",
    "I studied computer science at USC and finished in 2025. Before that I was in India, publishing research on computer vision and on health records that cannot be quietly edited.",
    "The photographs are from the same years. I notice structure — cables, contours, grids, flow — which turns out to be the same instinct that makes the engineering work.",
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
