"use client";

import { useRef } from "react";

/**
 * Builds a value once and keeps it for the lifetime of the component.
 *
 * Shader uniform objects are GPU state that has to be mutated every frame,
 * which is exactly what `useMemo` results are not allowed to be. A ref is the
 * honest container for that: the value is stable, and mutating it is expected.
 */
export function useConst<T>(factory: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = factory();
  }
  // This is React's documented lazy-initialisation pattern for refs. The value
  // is created exactly once and never participates in rendering, so reading it
  // here cannot cause a missed update.
  // eslint-disable-next-line react-hooks/refs
  return ref.current;
}
