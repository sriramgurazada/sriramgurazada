/**
 * Typed case records. Every narrative section is optional, so a case with
 * little to say renders as a short, deliberate page rather than a page full of
 * empty headings.
 *
 * Rules this file follows, and should keep following:
 *  - No invented screenshots, links, outcomes, percentages or testimonials.
 *  - A number is only stated where its measurement context can be pointed at.
 *  - `confirmed: false` means the owner still has to check the wording. Those
 *    are listed in the README so they cannot be forgotten.
 */

export type Section = {
  heading: string;
  /** Rendered as paragraphs. */
  body?: string[];
  /** Rendered as a list. Use for decisions and principles. */
  points?: { title?: string; body: string }[];
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  category: string;
  /** Short, honest state. Shown beside the title everywhere. */
  status: string;
  dates: string;
  role: string;
  /** One sentence. The index row and the case header both use it. */
  summary: string;
  /** Two or three words, for the index rows. */
  tags: string[];
  /** Shown on the home page as one of the selected three. */
  featured?: boolean;
  sections: Section[];
  /** What can be shown. Empty means nothing public exists. */
  evidence?: string[];
  limitations?: string[];
  next?: string[];
  links?: ProjectLink[];
  /**
   * Set where the case is thin because the work is not publishable. Rendered
   * as a visible note, so a short page reads as a decision rather than a gap.
   */
  withheld?: string;
  /** False until the owner has confirmed the wording. */
  confirmed: boolean;
};

export const projects: Project[] = [
  {
    slug: "shareholder-analytics",
    title: "Shareholder analytics",
    category: "Applied AI",
    status: "In production",
    dates: "2025 — present",
    role: "Software engineer, Goldman Sachs",
    summary:
      "Answering questions about who owns a company, from filings and market data, with the evidence attached to every answer.",
    tags: ["Agents", "Retrieval", "Evaluation"],
    featured: true,
    sections: [
      {
        heading: "The problem",
        body: [
          "Ownership is a question with a deceptively simple shape. Who holds this company, how much, since when, and what changed this quarter. The data to answer it is spread across regulatory filings, market feeds and internal records that each describe the same institution under a slightly different name, at a slightly different date, with a slightly different idea of what counts as a holding.",
          "So the work is not the question. It is reconciling the sources well enough that the answer means something, and being able to show which document each figure came from.",
        ],
      },
      {
        heading: "What this page is",
        body: [
          "This is internal work on a regulated desk, so what follows is the shape of the problem and the principles I work by. No implementation, no architecture, no numbers, no screenshots.",
        ],
      },
      {
        heading: "How I think about it",
        points: [
          {
            title: "An answer without its source is a rumour",
            body: "Every figure has to carry a path back to the filing or record it came from. In this domain a number nobody can trace is not a weaker answer; it is unusable.",
          },
          {
            title: "Agents are made of steps you can inspect",
            body: "A question gets decomposed into retrieval, reconciliation and reasoning stages, each one observable on its own, because a single opaque call that returns a confident paragraph cannot be debugged or defended.",
          },
          {
            title: "Entity resolution is the actual work",
            body: "Most of the difficulty is deciding that two differently-spelled names, filed in different jurisdictions, are the same holder. Get that wrong and every aggregate above it is wrong in a way that looks fine.",
          },
          {
            title: "Refusing is a supported outcome",
            body: "When the sources disagree or the coverage runs out, saying so beats interpolating. The interesting evaluation cases are the ones where the correct response is that this cannot be answered yet.",
          },
        ],
      },
      {
        heading: "My part in it",
        body: [
          "I work on the retrieval and evaluation side, as one engineer on a team. Nothing here is mine alone.",
        ],
      },
    ],
    withheld:
      "Internal work on a regulated desk. No screenshots, metrics or architecture can be published, so this case is written as context rather than as evidence.",
    limitations: [
      "Nothing here can be independently verified from outside the firm. Read it as how I work, not as a portfolio artefact.",
    ],
    confirmed: false,
  },

  {
    slug: "enterprise-search",
    title: "Enterprise search",
    category: "Search and retrieval",
    status: "In production",
    dates: "2025 — present",
    role: "Software engineer, Goldman Sachs",
    summary:
      "Making a very large firm’s own documents findable by the people already allowed to read them.",
    tags: ["Retrieval", "Evaluation", "Python"],
    featured: true,
    sections: [
      {
        heading: "The problem",
        body: [
          "Past a certain size, the hard part of search stops being ranking. The documents live in a dozen systems that disagree about structure, a good fraction of them change every day, and every result has to respect who is allowed to see what. Meanwhile the queries arriving are questions, not keywords.",
          "None of those are search problems in the textbook sense. They are the reason enterprise search has a reputation.",
        ],
      },
      {
        heading: "What this page is",
        body: [
          "This is internal work, so what follows is the shape of the problem and the principles I work by. The implementation, the metrics and the architecture stay inside the firm.",
        ],
      },
      {
        heading: "How I think about it",
        points: [
          {
            title: "Measure first",
            body: "A retrieval change nobody can evaluate is a guess with extra steps. The evaluation set is the first artefact, not the last.",
          },
          {
            title: "Permissions belong inside retrieval",
            body: "Filtering out results you should never have retrieved is both slower and easier to get subtly wrong than never retrieving them.",
          },
          {
            title: "Keep both retrievers",
            body: "Lexical and semantic matching fail on different queries. Running both and being deliberate about how their results combine beats declaring a winner.",
          },
          {
            title: "An empty answer is an answer",
            body: "When the corpus cannot support a response, the useful behaviour is to say so rather than to produce the most plausible-sounding paragraph available.",
          },
        ],
      },
      {
        heading: "My part in it",
        body: [
          "I work on retrieval and the evaluation around it, as one engineer on a team. Nothing here is mine alone.",
        ],
      },
    ],
    withheld:
      "Internal work. No screenshots, metrics or architecture can be published, so this case is written as context rather than as evidence.",
    limitations: [
      "Nothing here can be independently verified from outside the firm. Read it as how I work, not as a portfolio artefact.",
    ],
    confirmed: false,
  },

  {
    slug: "warranty-wala",
    title: "Warranty Wala",
    category: "Product",
    status: "In development",
    dates: "2026 — present",
    role: "Building it",
    summary: "A side project about product warranties, and the paperwork that comes with them.",
    tags: ["Product", "Side project"],
    featured: true,
    sections: [
      {
        heading: "What it is",
        body: [
          "Warranty Wala is the thing I am building outside work. It is about product warranties — the receipts, the dates, the coverage, and the reliable fact that the one you need is the one you cannot find.",
        ],
      },
      {
        heading: "Why this page is short",
        body: [
          "Because it is not out yet. I would rather describe it properly once than describe it vaguely three times, so there is deliberately nothing to click here.",
          "When there is something to use, this page becomes a real write-up.",
        ],
      },
    ],
    withheld: "In development. The write-up stays thin on purpose until there is something to show.",
    limitations: ["No public build, repository or screenshots yet."],
    next: ["A proper write-up and a link, once it ships."],
    confirmed: false,
  },

  {
    slug: "federated-identity",
    title: "Identity at enterprise scale",
    category: "Platform engineering",
    status: "Shipped",
    dates: "2021 — 2024",
    role: "Identity and access engineer",
    summary:
      "Single sign-on and multi-factor authentication across more than a thousand applications, where one misconfiguration is a breach.",
    tags: ["SAML", "OIDC", "Automation"],
    sections: [
      {
        heading: "The problem",
        body: [
          "A large organisation accumulates applications faster than it can standardise them, and each one arrives wanting to handle its own logins. Every place that happens is a place credentials can leak. The job is to take that responsibility away from all of them without stopping any of them working.",
        ],
      },
      {
        heading: "Scale",
        body: [
          "Over a thousand applications federated onto a central identity provider across SAML, OIDC and PKCE flows, covering both workforce and customer sign-in.",
        ],
      },
      {
        heading: "Decisions worth keeping",
        points: [
          {
            title: "Certificate expiry is a calendar entry, not an incident",
            body: "Signing certificates have a known lifetime. Renewal was built as a pipeline that runs before the date instead of an alert that fires after it, which removed a whole recurring class of outage from every federated integration at once.",
          },
          {
            title: "Nothing holds its own copy of a secret",
            body: "Credential rotation was automated end to end, and integrations were moved to retrieving secrets dynamically over LDAP, JDBC and REST rather than storing them.",
          },
          {
            title: "Instrument the login, not just the server",
            body: "Failed sign-ins, authentication latency and policy regressions went onto dashboards, because an identity problem reaches a user long before it shows up in a server metric.",
          },
        ],
      },
      {
        heading: "Worked with",
        body: ["PingFederate, Azure AD, Okta, CyberArk, Splunk, Grafana, Jenkins, Python and Docker."],
      },
    ],
    limitations: [
      "Enterprise work: the configuration, dashboards and incident history are not mine to publish.",
      "The scale figure is the count of applications onboarded by the team I worked in, not by me alone.",
    ],
    confirmed: true,
  },

  {
    slug: "retrieval-limits",
    title: "Retrieval that knows its limits",
    category: "Applied AI",
    status: "Research",
    dates: "2024 — 2025",
    role: "Self-directed research, USC",
    summary:
      "Tuning retrieval-augmented language models so their confidence tracks what the documents actually support.",
    tags: ["RAG", "LoRA", "FAISS"],
    sections: [
      {
        heading: "The problem",
        body: [
          "A retrieval-augmented model has two ways to be wrong. It can fetch the wrong passage, or it can fetch the right one and then say something the passage does not support. The second is the dangerous one, because it reads as authoritative and cites a real source while doing it.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "Parameter-efficient fine-tuning with LoRA over a hybrid retriever — dense vectors from FAISS alongside BM25 — so that lexical and semantic recall cover each other’s gaps rather than competing.",
          "Separately, an experiment in neutralising gender directions in the embedding space, to see how much of the model’s confident nonsense was coming from the representation rather than from the prompt.",
        ],
      },
      {
        heading: "What I took from it",
        points: [
          {
            body: "Hybrid retrieval is not a hedge. It is the honest response to two methods that fail on different queries.",
          },
          {
            body: "An evaluation set you wrote yourself will flatter you. The failures worth finding are the ones you did not think to write down.",
          },
        ],
      },
    ],
    limitations: [
      "Self-directed research rather than a deployed system. Measurements were on evaluation sets I built myself and should not be read as benchmark results.",
    ],
    confirmed: true,
  },

  {
    slug: "pii-masking",
    title: "Finding personal data before it lands",
    category: "Applied AI",
    status: "Open source",
    dates: "2024",
    role: "Personal project",
    summary:
      "A named-entity model that locates personal information in unstructured documents and masks it at ingestion.",
    tags: ["DeBERTa", "NER", "PyTorch"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Documents arrive full of things you are not allowed to keep: names, account numbers, addresses, dates of birth. A regular expression finds the ones that have a shape and misses every one that does not.",
        ],
      },
      {
        heading: "Approach",
        body: [
          "A DeBERTa named-entity model fine-tuned to tag personal information in free text, with masking applied at ingestion so the unredacted version never reaches storage in the first place.",
        ],
      },
      {
        heading: "The one real decision",
        points: [
          {
            title: "Recall over precision",
            body: "Masking a word that turned out to be harmless costs a reader a moment of confusion. Missing one costs considerably more, so the threshold sits on the cautious side and the review step exists to pull it back.",
          },
        ],
      },
    ],
    links: [
      { label: "Repository", href: "https://github.com/sriramgurazada/Masking-of-PII-in-Documents" },
    ],
    confirmed: true,
  },

  {
    slug: "published-research",
    title: "Three papers",
    category: "Published research",
    status: "Peer reviewed",
    dates: "2020 — 2022",
    role: "Author",
    summary:
      "Wildlife recognised in deliberately bad frames, health records that cannot be quietly edited, and a comparison of classifiers that refuses to pick a favourite.",
    tags: ["Computer vision", "Blockchain", "Classification"],
    sections: [
      {
        heading: "Wildlife in bad frames",
        body: [
          "Conservation surveying does not get clean imagery. The photographs come from a long way off, through heat haze, heavily cropped. This paper trains a convolutional model to identify animals in exactly those frames rather than in tidy ones, and reports 93.6% accuracy on its test set. The measurement context is in the paper, which is the right place for it.",
        ],
      },
      {
        heading: "Health records that cannot be quietly edited",
        body: [
          "A patient’s history should follow them between hospitals, and nobody should be able to alter it afterwards without that being obvious. A consortium blockchain with cryptographic hashing across the record chain makes tampering detectable by construction instead of by audit.",
        ],
      },
      {
        heading: "Which classifier, and why",
        body: [
          "A comparison of random forests, J48 decision trees and logistic regression on term-deposit subscription prediction, with the hyperparameter search and the overfitting controls written down rather than summarised. It reports 96% accuracy; the point of the paper is the comparison, not the number.",
        ],
      },
    ],
    evidence: [
      "All three are published and linked below. Every figure quoted here is stated in the paper it belongs to, with its measurement context.",
    ],
    links: [
      {
        label: "Wildlife detection (IRJET)",
        href: "https://www.irjet.net/archives/V7/i6/IRJET-V7I61073.pdf",
      },
      {
        label: "Hospital records on a consortium chain (IJAST)",
        href: "http://sersc.org/journals/index.php/IJAST/article/view/30660",
      },
      {
        label: "Classifier comparison (IRJET)",
        href: "https://www.irjet.net/archives/V9/i8/IRJET-V9I8135.pdf",
      },
    ],
    confirmed: true,
  },

  {
    slug: "temporal-nexus",
    title: "Temporal Nexus",
    category: "Game",
    status: "Playable",
    dates: "2024",
    role: "Team project, USC",
    summary:
      "A PC game built around bending time, and the analytics pipeline that told us which levels were actually annoying.",
    tags: ["Unity", "C#", "Analytics"],
    sections: [
      {
        heading: "What it is",
        body: [
          "A Unity game made with a team at USC. The mechanic is time. The design problem is that a mechanic which is obvious in your own head is frequently unreadable in someone else’s hands.",
        ],
      },
      {
        heading: "The part that transferred",
        body: [
          "We instrumented it. Every playtest reported where players died, where they backtracked and where they gave up, and level design changed between iterations because of what came back rather than because of what we assumed.",
          "That is the same loop as any other system: ship it, measure it, believe the measurement over your own taste.",
        ],
      },
    ],
    links: [{ label: "Play it", href: "https://george230310.github.io/526-Gold/index.html" }],
    limitations: ["A team project. The engineering credit is shared."],
    confirmed: false,
  },

  {
    slug: "travel-agent",
    title: "A travel planner that shows its reasoning",
    category: "Agents",
    status: "Prototype",
    dates: "2024",
    role: "Personal project",
    summary:
      "A tool-using agent that turns a loose travel brief into a day-by-day itinerary it can defend.",
    tags: ["LangChain", "Agents", "Python"],
    sections: [
      {
        heading: "Why",
        body: [
          "I travel enough to have noticed that planning a trip is a constraint-satisfaction problem in a trench coat. Dates, budget, opening hours, and how far you are willing to drive before it stops being a holiday.",
        ],
      },
      {
        heading: "How",
        body: [
          "The agent decomposes the brief into those constraints, queries live sources for each, and assembles a plan day by day.",
          "The part worth building was not the itinerary. It was making the agent state which constraint each choice was serving, so that a bad plan can be argued with instead of merely regenerated.",
        ],
      },
    ],
    links: [{ label: "Repository", href: "https://github.com/sriramgurazada/Travel_Agent" }],
    limitations: ["A prototype. It has not been used by anybody but me."],
    confirmed: true,
  },
];

/**
 * Smaller builds. Real, linked, and not stretched into case studies they cannot
 * support.
 */
export const alsoBuilt = [
  {
    title: "Hospital management system",
    body: "Appointment booking and clinician search, in React over a Node and GraphQL backend with MongoDB behind it.",
    href: "https://github.com/sriramgurazada/Hospital-Management-System",
  },
  {
    title: "Event management API",
    body: "A GraphQL service modelling events, registrations and attendee state, with a schema strict enough to keep the client honest.",
    href: "https://github.com/sriramgurazada/Event_Management_System_graphql",
  },
  {
    title: "Sentiment analysis at scale",
    body: "Neural classifiers over Word2Vec embeddings on Amazon review corpora, benchmarked across architectures.",
    href: "https://github.com/sriramgurazada/Sentimental-Analysis",
  },
  {
    title: "Campus safety analysis",
    body: "Turning raw incident reporting into patterns that can inform a decision rather than just fill a dashboard.",
    href: "https://github.com/sriramgurazada/usc-campus-safety-analysis",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** The next case to offer at the end of a case study. Wraps around. */
export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
