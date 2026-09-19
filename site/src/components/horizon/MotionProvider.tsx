"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  MODE_KEY,
  MOTION_KEY,
  PAUSED_KEY,
  RESTORED_KEY,
  type Mode,
  type MotionPreference,
} from "@/lib/prefs";

type MotionState = {
  motion: MotionPreference;
  /** True when the visitor has chosen a preference rather than inheriting one. */
  explicit: boolean;
  paused: boolean;
  setMotion: (next: MotionPreference) => void;
  /** Drops back to following the operating system. */
  clearMotion: () => void;
  togglePaused: () => void;
};

const Ctx = createContext<MotionState | null>(null);

const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage is unavailable. The preference still applies for this page.
  }
};

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const OS_REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * The live preferences are the `data-*` attributes on <html>, not React state.
 * The inline boot script writes them before the first paint and the CSS reads
 * them, so React has to treat them as an external store it subscribes to. Any
 * copy kept in useState would be a second source of truth that starts out wrong
 * for the one frame that matters most.
 *
 * Each reader returns a primitive so that useSyncExternalStore can compare
 * snapshots without any caching of its own.
 */
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const announce = () => listeners.forEach((listener) => listener());

const readMotion = (): MotionPreference =>
  document.documentElement.dataset.motion === "reduced" ? "reduced" : "full";
const readPaused = () => document.documentElement.dataset.paused === "true";
const readExplicit = () => {
  const stored = read(MOTION_KEY);
  return stored === "full" || stored === "reduced";
};

// The server has no document and no storage, so it renders the defaults. React
// hydrates against these, then reconciles against the real values immediately.
const serverMotion = (): MotionPreference => "full";
const serverFalse = () => false;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const motion = useSyncExternalStore(subscribe, readMotion, serverMotion);
  const paused = useSyncExternalStore(subscribe, readPaused, serverFalse);
  const explicit = useSyncExternalStore(subscribe, readExplicit, serverFalse);

  /** Follow the operating system for as long as there is no explicit choice. */
  useEffect(() => {
    if (explicit) return;
    const query = window.matchMedia(OS_REDUCED);
    const apply = () => {
      document.documentElement.dataset.motion = query.matches ? "reduced" : "full";
      announce();
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [explicit]);

  /**
   * A hidden tab should not be running decorative loops. Browsers throttle
   * requestAnimationFrame there but keep CSS animations going, so this is not
   * something the platform handles on its own.
   */
  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.hidden =
        document.visibilityState === "hidden" ? "true" : "false";
    };
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, []);

  const setMotion = useCallback((next: MotionPreference) => {
    document.documentElement.dataset.motion = next;
    write(MOTION_KEY, next);
    announce();
  }, []);

  const clearMotion = useCallback(() => {
    write(MOTION_KEY, null);
    document.documentElement.dataset.motion = window.matchMedia(OS_REDUCED).matches
      ? "reduced"
      : "full";
    announce();
  }, []);

  const togglePaused = useCallback(() => {
    const next = !readPaused();
    document.documentElement.dataset.paused = next ? "true" : "false";
    write(PAUSED_KEY, next ? "1" : null);
    announce();
  }, []);

  const value = useMemo(
    () => ({ motion, explicit, paused, setMotion, clearMotion, togglePaused }),
    [motion, explicit, paused, setMotion, clearMotion, togglePaused]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMotion() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useMotion must be used inside MotionProvider");
  return value;
}

/**
 * Records which experience the visitor chose, so the landing page can restore
 * it on a later visit.
 *
 * Choosing the reel also arms the one-shot guard for the rest of this session.
 * That is what keeps the Back button honest: without it, leaving the portfolio
 * for the landing page and then pressing Back would find a portfolio preference
 * and bounce straight forward again. The preference is for the next visit, not
 * for overriding a navigation the visitor just made.
 */
export function rememberMode(mode: Mode) {
  write(MODE_KEY, mode);
  try {
    if (mode === "reel") sessionStorage.setItem(RESTORED_KEY, "1");
    else sessionStorage.removeItem(RESTORED_KEY);
  } catch {
    // Storage is unavailable, so there is no preference to restore anyway.
  }
}
