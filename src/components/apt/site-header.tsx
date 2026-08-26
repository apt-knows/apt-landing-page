import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button, requestJoin, Wordmark } from "./kit";

const nav = [{ href: "/#how", label: "How it works" }];

export function SiteHeader() {
  // The one CTA lives in the hero. The header only offers a way back to it
  // once the hero form has scrolled away (or on pages without it).
  const [showJoin, setShowJoin] = useState(false);

  // The scrim, blur, and hairline only appear once content scrolls under
  // the header — at the top of the page there is nothing to separate.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("join");
    if (!target) {
      setShowJoin(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setShowJoin(!entry.isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-chrome sticky top-0 z-50" data-scrolled={scrolled}>
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:h-16 sm:px-8 lg:px-10 xl:max-w-7xl">
        <Link to="/" className="shrink-0 text-[18px] sm:text-[20px]">
          <Wordmark />
          <span className="sr-only">apt home</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-7">
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[14px] text-secondary-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/team"
              className="text-[14px] text-secondary-foreground transition-colors hover:text-foreground"
            >
              Team
            </Link>
          </nav>

          <Button
            variant="agent"
            aria-hidden={!showJoin}
            tabIndex={showJoin ? undefined : -1}
            onClick={requestJoin}
            className={cn(
              "min-h-9 px-4 text-[13px] transition-opacity duration-[240ms]",
              !showJoin && "pointer-events-none opacity-0",
            )}
          >
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Join the waitlist</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
