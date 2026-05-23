import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Wand2, FileCheck2, Brain } from "lucide-react";
import { Nav } from "./Nav";
import { AuroraBg } from "./AuroraBg";

const features = [
  {
    icon: Brain,
    title: "Semantic Matching",
    body: "Our AI reads the vacancy and your resume like a seasoned recruiter — surfacing real overlap, not surface keywords.",
  },
  {
    icon: Target,
    title: "ATS Score",
    body: "A live breakdown of keywords, formatting, experience, technical and soft-skill alignment.",
  },
  {
    icon: Wand2,
    title: "Truthful Rewrite",
    body: "We rewrite, never invent. Your facts — sharpened, restructured, optimized to pass parsers.",
  },
  {
    icon: FileCheck2,
    title: "ATS-Safe Export",
    body: "Clean, monochromatic PDF templates engineered for flawless parsing.",
  },
];

const steps = [
  { n: "01", t: "Paste the job", d: "Drop the vacancy description. We extract stack, seniority, must-haves." },
  { n: "02", t: "Upload your resume", d: "PDF, DOCX or text. We parse experience, skills, projects." },
  { n: "03", t: "Witness the ritual", d: "AI matches, scores and rewrites — optimized for the bots and the humans." },
];

export function HeroSection() {
  return (
    <div className="relative min-h-screen">
      <AuroraBg />
      <Nav />

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-28 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" />
            AI-powered resume rituals
          </div>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            Beat the <span className="text-gradient">ATS.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Your resume deserves better than rejection bots. Transform it into an
            ATS weapon — calibrated for every role you actually want.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2 rounded-md bg-witch px-6 py-3 text-sm font-medium text-primary-foreground hover-glow"
            >
              Start Matching
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/upload"
              className="rounded-md border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur hover:bg-card"
            >
              Upload Resume
            </Link>
          </motion.div>

          {/* score preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mx-auto mt-16 w-full max-w-md"
          >
            <div className="glass glow rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    ATS Score
                  </p>
                  <p className="mt-1 font-display text-4xl text-gradient">87%</p>
                </div>
                <ScoreRing value={87} />
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  ["Keywords", 92],
                  ["Experience", 86],
                  ["Technical Skills", 89],
                  ["Formatting", 95],
                ].map(([label, v]) => (
                  <div key={label as string}>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>{label}</span>
                      <span>{v}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-witch"
                        style={{ width: `${v as number}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-3xl md:text-4xl">
          A studio for your <span className="text-gradient">career artifact</span>.
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Four sharp tools, woven into one ritual.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
              className="glass hover-glow rounded-xl p-5"
            >
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-display text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-3xl md:text-4xl">How the ritual works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <span className="font-display text-3xl text-gradient">{s.n}</span>
              <h3 className="mt-3 font-display text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 pb-32">
        <div className="glass glow relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-aurora)" }}
          />
          <h2 className="font-display text-3xl md:text-5xl">
            Ready to <span className="text-gradient">transmute</span> your resume?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Five minutes. One resume. Infinitely better odds.
          </p>
          <Link
            to="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-witch px-7 py-3 text-sm font-medium text-primary-foreground hover-glow"
          >
            Begin the ritual <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="relative border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        Resume Ritual · crafted for modern careers
      </footer>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} stroke="oklch(0.22 0.04 295)" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke="url(#g)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.25 305)" />
          <stop offset="100%" stopColor="oklch(0.7 0.28 350)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
