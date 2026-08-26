import { Link } from "@tanstack/react-router";

import { Wordmark } from "./kit";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10 lg:px-10 xl:max-w-7xl">
        <div>
          <Wordmark className="text-[18px]" />
          <p className="mt-1 text-[13px] text-muted-foreground">Shopping for you.</p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-secondary-foreground"
          aria-label="Footer"
        >
          <a href="/#how" className="hover:text-foreground">
            How it works
          </a>
          <Link to="/team" className="hover:text-foreground">
            Team
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <span className="text-muted-foreground">
            © {new Date().getFullYear()} <Wordmark className="text-muted-foreground" />
          </span>
        </nav>
      </div>
    </footer>
  );
}
