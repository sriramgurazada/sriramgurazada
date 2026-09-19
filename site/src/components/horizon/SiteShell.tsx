import { MotionProvider } from "@/components/horizon/MotionProvider";
import SiteHeader from "@/components/horizon/SiteHeader";
import SiteFooter from "@/components/horizon/SiteFooter";

/**
 * Chrome shared by every readable route.
 *
 * A component rather than a route-group layout, because `not-found.tsx` sits
 * outside any group and would otherwise render without navigation — which is
 * the one page where a visitor most needs it.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-route focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-basalt"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </MotionProvider>
  );
}
