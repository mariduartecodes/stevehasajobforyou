import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Upload as UploadIcon, Loader2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { AuroraBg } from "@/components/AuroraBg";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { extractPdfText } from "@/lib/pdf";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Currículo — Resume Match" },
      { name: "description", content: "Envie seu currículo para iniciar a análise ATS." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const { resumeText, resumeFileName, jobDescription, setResume } = useApp();
  const [text, setText] = useState(resumeText);
  const [fileName, setFileName] = useState(resumeFileName);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      let extracted = "";
      if (file.name.match(/\.pdf$/i)) {
        extracted = await extractPdfText(file);
      } else if (file.name.match(/\.(txt|md)$/i)) {
        extracted = await file.text();
      } else {
        toast.error("Use PDF ou .txt. DOCX em breve — cole como texto por enquanto.");
        return;
      }
      if (extracted.trim().length < 50) {
        toast.error("Não foi possível extrair texto suficiente do arquivo.");
        return;
      }
      setText(extracted);
      setFileName(file.name);
      toast.success(`Arquivo processado: ${file.name}`);
    } catch (e) {
      console.error(e);
      toast.error("Falha ao processar o arquivo.");
    } finally {
      setBusy(false);
    }
  };

  const onContinue = () => {
    if (text.trim().length < 100) {
      toast.error("Conteúdo do currículo muito curto.");
      return;
    }
    if (!jobDescription) {
      toast.error("Adicione uma descrição de vaga primeiro.");
      navigate({ to: "/analyze" });
      return;
    }
    setResume(text.trim(), fileName || "curriculo.txt");
    navigate({ to: "/match" });
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBg />
      <Nav />
      <main className="relative mx-auto max-w-3xl px-6 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3 text-accent" /> Etapa 2 de 3
          </div>
          <h1 className="font-display text-4xl md:text-5xl">
            Seu <span className="text-gradient">currículo</span>.
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Envie seu currículo em PDF ou texto. O processamento é feito localmente antes da análise.
          </p>
        </motion.div>

        <motion.label
          htmlFor="resume-file"
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`glass mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-14 transition-all ${
            drag ? "border-primary glow" : "border-border"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-witch glow">
            {busy ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
            ) : (
              <UploadIcon className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
          <p className="mt-4 font-display text-lg">
            {fileName ? fileName : "Arraste seu currículo aqui"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PDF ou TXT · até ~5MB</p>
          <input
            id="resume-file"
            type="file"
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </motion.label>

        {text && (
          <div className="glass mt-6 rounded-2xl p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Pré-visualização · edite se necessário
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-md bg-input/40 p-4 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onContinue}
            disabled={!text || busy}
            className="inline-flex items-center gap-2 rounded-md bg-witch px-6 py-2.5 text-sm font-medium text-primary-foreground hover-glow disabled:opacity-40"
          >
            Analisar currículo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
