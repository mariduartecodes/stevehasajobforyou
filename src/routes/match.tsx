import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle, Check, Loader2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { AuroraBg } from "@/components/AuroraBg";
import { ScoreRing } from "@/components/ScoreRing";
import { useApp } from "@/lib/store";
import { analyzeMatch } from "@/lib/ats.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Match Result — Resume Ritual" },
      { name: "description", content: "Your ATS score, gaps and optimized resume." },
    ],
  }),
  component: MatchPage,
});

const BREAKDOWN_LABELS: Record<string, string> = {
  keywords: "Keywords Match",
  formatting: "Formatting",
  experience: "Experience Alignment",
  technical: "Technical Skills",
  soft: "Soft Skills",
};

function MatchPage() {
  const navigate = useNavigate();
  const { jobDescription, resumeText, match, setMatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobDescription || !resumeText) {
      navigate({ to: "/analyze" });
      return;
    }
    if (match) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMatch({ data: { jobDescription, resumeText } });
      setMatch(result as any);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || "Match failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBg />
      <Nav />
      <main className="relative mx-auto max-w-5xl px-6 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" /> Step 3 of 3
          </div>
          <h1 className="font-display text-4xl md:text-5xl">
            The <span className="text-gradient">verdict</span>.
          </h1>
        </motion.div>

        {loading && (
          <div className="glass glow mt-12 flex flex-col items-center justify-center rounded-2xl py-20">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="mt-6 font-display text-xl">Performing the ritual…</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Extracting keywords · scoring alignment · rewriting bullets
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="glass mt-12 rounded-2xl p-8">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <h2 className="mt-3 font-display text-xl">The ritual broke</h2>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={run}
              className="mt-5 rounded-md bg-witch px-5 py-2 text-sm font-medium text-primary-foreground hover-glow"
            >
              Try again
            </button>
          </div>
        )}

        {match && !loading && (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass glow flex flex-col items-center rounded-2xl p-6"
            >
              <ScoreRing value={Math.round(match.score)} />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Overall compatibility
              </p>
              <div className="mt-6 w-full space-y-3">
                {Object.entries(match.breakdown).map(([k, v]) => (
                  <div key={k}>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>{BREAKDOWN_LABELS[k] || k}</span>
                      <span>{Math.round(v as number)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-witch"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 lg:col-span-2"
            >
              <h2 className="font-display text-2xl">Insights</h2>
              <ul className="mt-4 space-y-3">
                {match.insights.map((i, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-foreground/90">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {i}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <KeywordList
                  title="Matched"
                  items={match.matchedKeywords}
                  tone="match"
                />
                <KeywordList
                  title="Missing"
                  items={match.missingKeywords}
                  tone="gap"
                />
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-2">
                <button
                  onClick={run}
                  className="rounded-md border border-border bg-card/40 px-5 py-2 text-sm text-foreground hover:bg-card"
                >
                  Re-run
                </button>
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 rounded-md bg-witch px-5 py-2 text-sm font-medium text-primary-foreground hover-glow"
                >
                  Open editor <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

function KeywordList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "match" | "gap";
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 && (
          <span className="text-xs text-muted-foreground">None</span>
        )}
        {items.map((k) => (
          <span
            key={k}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
              tone === "match"
                ? "border-primary/30 bg-primary/10 text-primary-foreground/90"
                : "border-accent/30 bg-accent/10 text-accent-foreground/90"
            }`}
          >
            {tone === "match" ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
