/**
 * Decides which living frame is allowed to animate.
 *
 * At most one frame moves at a time. The rule is simply "the frame that is most
 * on screen", but applied on every intersection callback that would flap
 * between two frames every few pixels while scrolling past the boundary between
 * them, so the decision is debounced: a frame has to stay the most visible one
 * for the length of the handoff before it takes over.
 *
 * Frames default to inactive, which means a frame with no JavaScript, a frame
 * that has scrolled away and a frame during the initial paint all behave the
 * same way — as the static photograph they are built on.
 */

type Entry = { element: HTMLElement; ratio: number };

const entries = new Map<HTMLElement, Entry>();
let observer: IntersectionObserver | null = null;
let handoff: number | null = null;

/**
 * A frame has to be at least this visible to be a candidate. Below it, a frame
 * barely poking into the viewport could take the slot from one the visitor is
 * actually looking at.
 */
const MIN_RATIO = 0.35;
const HANDOFF_MS = 180;

function apply() {
  handoff = null;
  let winner: Entry | null = null;
  for (const entry of entries.values()) {
    if (entry.ratio >= MIN_RATIO && (!winner || entry.ratio > winner.ratio)) winner = entry;
  }
  for (const entry of entries.values()) {
    entry.element.dataset.active = String(entry === winner);
  }
}

function schedule() {
  if (handoff !== null) return;
  handoff = window.setTimeout(apply, HANDOFF_MS);
}

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        const entry = entries.get(record.target as HTMLElement);
        if (entry) entry.ratio = record.intersectionRatio;
      }
      schedule();
    },
    // A spread of thresholds rather than one: the winner is chosen by
    // comparing ratios, so the ratios have to actually update as a frame
    // crosses the viewport.
    { threshold: [0, 0.2, 0.35, 0.5, 0.7, 0.9, 1] }
  );
  return observer;
}

export function registerFrame(element: HTMLElement) {
  entries.set(element, { element, ratio: 0 });
  const active = ensureObserver();
  active.observe(element);

  return () => {
    active.unobserve(element);
    entries.delete(element);
    if (entries.size === 0) {
      active.disconnect();
      observer = null;
    }
    schedule();
  };
}
