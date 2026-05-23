import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, Sparkles } from "lucide-react";
import { Nav } from "@/components/Nav";
import { AuroraBg } from "@/components/AuroraBg";
import { useApp, type OptimizedResume } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor — Resume Match" },
      { name: "description", content: "Refine e exporte seu currículo otimizado para ATS." },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const navigate = useNavigate();
  const { match } = useApp();
  const [resume, setResume] = useState<OptimizedResume | null>(null);

  useEffect(() => {
    if (!match) {
      navigate({ to: "/analyze" });
      return;
    }
    setResume(match.optimizedResume);
  }, [match, navigate]);

  if (!resume) return null;

  const update = <K extends keyof OptimizedResume>(key: K, value: OptimizedResume[K]) =>
    setResume({ ...resume, [key]: value });

  const updateBullet = (expIdx: number, bIdx: number, value: string) => {
    const exp = [...resume.experience];
    exp[expIdx].bullets[bIdx] = value;
    update("experience", exp);
  };

  const addBullet = (i: number) => {
    const exp = [...resume.experience];
    exp[i].bullets.push("");
    update("experience", exp);
  };

  const removeBullet = (i: number, b: number) => {
    const exp = [...resume.experience];
    exp[i].bullets.splice(b, 1);
    update("experience", exp);
  };

  const exportPdf = () => {
    toast.success("Abrindo diálogo de impressão…");
    setTimeout(() => window.print(), 200);
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBg />
      <div className="print:hidden">
        <Nav />
      </div>

      <main className="relative mx-auto max-w-6xl px-6 pt-10 pb-24 print:max-w-none print:px-0 print:pt-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">
              O <span className="text-gradient">editor</span>.
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Ajuste cada detalhe e exporte quando estiver pronto.
            </p>
          </div>
          <button
            onClick={exportPdf}
            className="inline-flex items-center gap-2 rounded-md bg-witch px-5 py-2.5 text-sm font-medium text-primary-foreground hover-glow"
          >
            <Download className="h-4 w-4" /> Exportar PDF
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] print:block">
          {/* Resume preview / editable */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 print:rounded-none print:bg-white print:p-12 print:text-black print:shadow-none"
          >
            <Editable
              value={resume.name}
              onChange={(v) => update("name", v)}
              className="font-display text-3xl print:text-black"
            />
            <Editable
              value={resume.headline}
              onChange={(v) => update("headline", v)}
              className="mt-1 text-sm text-accent print:text-gray-700"
            />
            <Editable
              value={resume.contact}
              onChange={(v) => update("contact", v)}
              className="mt-1 text-xs text-muted-foreground print:text-gray-600"
            />

            <Section title="Resumo">
              <Editable
                multiline
                value={resume.summary}
                onChange={(v) => update("summary", v)}
                className="text-sm leading-relaxed print:text-black"
              />
            </Section>

            <Section title="Competências">
              <Editable
                value={resume.skills.join(", ")}
                onChange={(v) =>
                  update(
                    "skills",
                    v.split(",").map((s) => s.trim()).filter(Boolean),
                  )
                }
                className="text-sm print:text-black"
              />
            </Section>

            <Section title="Experiência">
              <div className="space-y-6">
                {resume.experience.map((e, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Editable
                        value={`${e.role} · ${e.company}`}
                        onChange={(v) => {
                          const exp = [...resume.experience];
                          const [role, ...rest] = v.split("·");
                          exp[i].role = role.trim();
                          exp[i].company = rest.join("·").trim();
                          update("experience", exp);
                        }}
                        className="font-display text-base print:text-black"
                      />
                      <Editable
                        value={e.period}
                        onChange={(v) => {
                          const exp = [...resume.experience];
                          exp[i].period = v;
                          update("experience", exp);
                        }}
                        className="text-xs text-muted-foreground print:text-gray-600"
                      />
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {e.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          className="group flex items-start gap-2 text-sm leading-relaxed"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                          <Editable
                            multiline
                            value={b}
                            onChange={(v) => updateBullet(i, bi, v)}
                            className="flex-1 print:text-black"
                          />
                          <button
                            onClick={() => removeBullet(i, bi)}
                            className="opacity-0 transition-opacity group-hover:opacity-100 print:hidden"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => addBullet(i)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent print:hidden"
                    >
                      <Plus className="h-3 w-3" /> Adicionar item
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Formação">
              <div className="space-y-3">
                {resume.education.map((ed, i) => (
                  <div key={i} className="text-sm print:text-black">
                    <Editable
                      value={`${ed.degree} · ${ed.school}`}
                      onChange={(v) => {
                        const e = [...resume.education];
                        const [degree, ...rest] = v.split("·");
                        e[i].degree = degree.trim();
                        e[i].school = rest.join("·").trim();
                        update("education", e);
                      }}
                      className="font-display"
                    />
                    <Editable
                      value={ed.period}
                      onChange={(v) => {
                        const e = [...resume.education];
                        e[i].period = v;
                        update("education", e);
                      }}
                      className="text-xs text-muted-foreground print:text-gray-600"
                    />
                  </div>
                ))}
              </div>
            </Section>
          </motion.section>

          {/* Sidebar */}
          <aside className="space-y-4 print:hidden">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg">Score ATS</h3>
              <p className="mt-2 font-display text-4xl text-gradient">
                {Math.round(match!.score)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Atualizado da última análise
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-display text-lg">
                <Sparkles className="h-4 w-4 text-accent" /> Palavras-chave ausentes
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {match!.missingKeywords.slice(0, 12).map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Inclua-as de forma natural, apenas onde realmente se aplicam.
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg">Ações rápidas</h3>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {match!.insights.slice(0, 4).map((i, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <style>{`
        @media print {
          body { background: white !important; }
          .grain::before { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 border-b border-border pb-1 font-display text-xs uppercase tracking-widest text-muted-foreground print:border-gray-300 print:text-gray-700">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Editable({
  value,
  onChange,
  className = "",
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      className={`block rounded outline-none focus:bg-card/40 focus:ring-1 focus:ring-ring/40 print:focus:ring-0 ${
        multiline ? "whitespace-pre-wrap" : ""
      } ${className}`}
    >
      {value}
    </span>
  );
}
