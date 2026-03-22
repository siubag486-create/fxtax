"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <>
        <div aria-hidden className="h-14 md:h-16" />
        <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground md:px-8">
            PSWK DEV COPYRIGHT
          </div>
        </footer>
      </>
    );
  }

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground md:px-8">
        PSWK DEV COPYRIGHT
      </div>
    </footer>
  );
}
