import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Nav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const links = [
    { to: "/analyze", label: "Analyze" },
    { to: "/upload", label: "Upload" },
    { to: "/match", label: "Match" },
    { to: "/editor", label: "Editor" },
  ];
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-witch glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg tracking-wide">
            Resume <span className="text-gradient">Ritual</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "text-foreground bg-card/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/analyze"
          className="hidden rounded-md bg-witch px-4 py-2 text-sm font-medium text-primary-foreground hover-glow md:inline-flex"
        >
          Start Matching
        </Link>
      </div>
    </header>
  );
}
