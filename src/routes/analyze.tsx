import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Nav } from "@/components/Nav";
import { AuroraBg } from "@/components/AuroraBg";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Vaga — Resume Match" },
      { name: "description", content: "Cole a descrição da vaga para iniciar a análise ATS." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const { jobDescription, setJobDescription } = useApp();
  const [text, setText] = useState(jobDescription);

  const onContinue = () => {
    if (text.trim().length < 80) {
      toast.error("Cole uma descrição de vaga mais completa.");
      return;
    }
    setJobDescription(text.trim());
    navigate({ to: "/upload" });
  };

  const onFile = async (f: File) => {
    if (!f.name.match(/\.(txt|md)$/i)) {
      toast.error("Apenas .txt / .md aqui. Cole o texto do PDF.");
      return;
    }
    const t = await f.text();
    setText(t);
    toast.success("Descrição da vaga carregada.");
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBg />
      <Nav />
      <main className="relative mx-auto max-w-3xl px-6 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <Briefcase className="h-3 w-3 text-accent" /> Etapa 1 de 3
          </div>
          <h1 className="font-display text-4xl md:text-5xl">
            A <span className="text-gradient">vaga</span>.
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Cole a descrição completa da vaga. Quanto mais detalhada, mais precisa será a análise.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass mt-8 rounded-2xl p-5"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole a descrição da vaga aqui…"
            rows={14}
            className="w-full resize-none rounded-md bg-input/40 p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="cursor-pointer rounded-md border border-border bg-card/40 px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
              Enviar .txt
              <input
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
            </label>
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-md bg-witch px-6 py-2.5 text-sm font-medium text-primary-foreground hover-glow"
            >
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <p className="mt-4 text-xs text-muted-foreground">
          {text.trim().length} caracteres · recomendado 400+
        </p>
      </main>
    </div>
  );
}
