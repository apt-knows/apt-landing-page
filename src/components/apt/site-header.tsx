import { Link } from "@tanstack/react-router";

import { LinkButton, Wordmark } from "./kit";

const nav = [
  { href: "/#how", label: "How it works" },
  { href: "/#app", label: "The app" },
  { href: "/#team", label: "Team" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--scrim-chrome)] backdrop-blur-[14px] backdrop-saturate-150">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link to="/" className="shrink-0 text-[20px]">
          <Wordmark />
          <span className="sr-only">apt home</span>
        </Link>

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
        </nav>

        <LinkButton
          href="#early-access"
          variant="solid"
          className="shrink-0 whitespace-nowrap px-4 text-[14px] sm:px-5 sm:text-[15px]"
        >
          Get early access
        </LinkButton>
      </div>

    </header>
  );
}
