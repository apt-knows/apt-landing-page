import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button, Wordmark } from "./kit";

const nav = [{ href: "/#how", label: "How it works" }];

export function SiteHeader() {
  // The one CTA lives in the hero. The header only offers a way back to it
  // once the hero form has scrolled away (or on pages without it).
  const [showJoin, setShowJoin] = useState(false);

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
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--scrim-chrome)] backdrop-blur-[14px] backdrop-saturate-150">
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
            onClick={() => {
              const anchor = document.getElementById("join");
              if (!anchor) {
                window.location.href = "/#join";
                return;
              }
              window.dispatchEvent(new CustomEvent("apt:join"));
              anchor.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
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
