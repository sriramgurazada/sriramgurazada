/**
 * Visitor preferences that must be resolved before the first paint.
 *
 * There are three, and they are deliberately independent:
 *
 *  - `motion`   Full or Reduced. Defaults to the operating system's
 *               prefers-reduced-motion, which an explicit choice overrides
 *               until it is cleared.
 *  - `paused`   The Pause motion control. Freezes decorative motion where it
 *               is, and survives navigation.
 *  - `mode`     Which of the two experiences the visitor last chose.
 *
 * All three are applied by an inline script rather than by React, because a
 * preference applied after hydration is a preference that was ignored for the
 * first second — which for reduced motion is the second that matters.
 */

export const MOTION_KEY = "horizon.motion";
export const PAUSED_KEY = "horizon.paused";
export const MODE_KEY = "horizon.mode";

export type MotionPreference = "full" | "reduced";
/**
 * `reel` is the landing page at `/`. `portfolio` is the readable site under
 * `/portfolio`. Stored values from before this split do not match either name,
 * so an old visitor simply gets the landing page, which is the right default.
 */
export type Mode = "reel" | "portfolio";

/**
 * Runs before anything renders. Kept small and dependency-free because it ships
 * inline in the document on every route.
 *
 * `try` wraps the storage reads: Safari throws on localStorage in some privacy
 * configurations, and a thrown error here would take the whole document with
 * it. Losing the preference is survivable; losing the page is not.
 */
export const BOOT_SCRIPT = `(function(){
  var d=document.documentElement;
  var motion=null,paused=false;
  try{
    motion=localStorage.getItem(${JSON.stringify(MOTION_KEY)});
    paused=localStorage.getItem(${JSON.stringify(PAUSED_KEY)})==="1";
  }catch(e){}
  if(motion!=="full"&&motion!=="reduced"){
    motion=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full";
  }
  d.dataset.motion=motion;
  d.dataset.paused=paused?"true":"false";
  d.dataset.hidden=document.visibilityState==="hidden"?"true":"false";
})();`;

export const RESTORED_KEY = "horizon.restored";

/**
 * Sends a returning visitor who chose the portfolio straight to it, the way a
 * site restores a theme.
 *
 * Only ever included on the landing document. A first-time visitor has no
 * preference and so always gets the reel — which is also what a crawler sees,
 * since it never runs this.
 *
 * Three guards, each earning its place:
 *  - a hash means the visitor followed a deep link into a specific section, so
 *    honour the link over the preference;
 *  - `replace` keeps the redirect out of the history stack, so Back still goes
 *    where the visitor actually came from rather than bouncing;
 *  - the session flag makes a redirect loop impossible even if the preference
 *    and the destination ever disagree.
 */
export const restoreModeScript = (portfolioHref: string) => `(function(){
  try{
    if(location.hash)return;
    if(sessionStorage.getItem(${JSON.stringify(RESTORED_KEY)}))return;
    if(localStorage.getItem(${JSON.stringify(MODE_KEY)})!=="portfolio")return;
    sessionStorage.setItem(${JSON.stringify(RESTORED_KEY)},"1");
    location.replace(${JSON.stringify(portfolioHref)});
  }catch(e){}
})();`;
