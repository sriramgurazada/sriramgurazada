let ready = false;
const listeners = new Set<() => void>();

/** Called by the preloader once the page has been handed over to the visitor. */
export function markStageReady() {
  ready = true;
  for (const listener of listeners) listener();
  listeners.clear();
}

/**
 * Runs `callback` when the preloader releases the page, or immediately if that
 * has already happened.
 */
export function onStageReady(callback: () => void) {
  if (ready) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
