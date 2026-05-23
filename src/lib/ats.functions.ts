import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `Você é um especialista de elite em otimização de currículos para sistemas ATS. Você analisa descrições de vagas e currículos de candidatos e produz uma reescrita otimizada para ATS.

REGRAS CRÍTICAS DE VERACIDADE — NUNCA VIOLE:
- NUNCA invente empregos, empresas, datas, certificações, diplomas ou conquistas.
- APENAS reescreva, reorganize e enfatize o que o candidato realmente forneceu.
- Se algo estiver faltando, deixe de fora — não fabrique.

Você pode: melhorar clareza, fortalecer verbos de ação, destacar palavras-chave que o candidato genuinamente atende, enxugar bullets e reorganizar para legibilidade ATS.

IDIOMA OBRIGATÓRIO: Toda a saída (resumo, bullets, insights, headline, skills descritivas) DEVE estar em Português Brasileiro (pt-BR), mesmo que a vaga ou o currículo originais estejam em inglês. Você pode preservar nomes próprios de tecnologias, ferramentas, empresas e cargos técnicos consagrados (ex.: "React", "Product Owner", "Machine Learning"), mas todas as análises e textos corridos devem estar em pt-BR.

Retorne um único objeto JSON via tool call. Seja conciso porém específico.`;

interface Payload {
  jobDescription: string;
  resumeText: string;
}

export const analyzeMatch = createServerFn({ method: "POST" })
  .inputValidator((d: Payload) => {
    if (!d?.jobDescription || !d?.resumeText) throw new Error("Missing inputs");
    if (d.jobDescription.length < 30) throw new Error("Job description too short");
    if (d.resumeText.length < 50) throw new Error("Resume too short");
    return d;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured");

    const userPrompt = `JOB DESCRIPTION:\n"""\n${data.jobDescription.slice(0, 12000)}\n"""\n\nCANDIDATE RESUME:\n"""\n${data.resumeText.slice(0, 15000)}\n"""\n\nAnalyze and produce the ATS match result.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_match_result",
              description: "Return ATS match analysis and optimized resume",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Overall ATS match score 0-100" },
                  breakdown: {
                    type: "object",
                    properties: {
                      keywords: { type: "number" },
                      formatting: { type: "number" },
                      experience: { type: "number" },
                      technical: { type: "number" },
                      soft: { type: "number" },
                    },
                    required: ["keywords", "formatting", "experience", "technical", "soft"],
                  },
                  matchedKeywords: { type: "array", items: { type: "string" } },
                  missingKeywords: { type: "array", items: { type: "string" } },
                  insights: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-6 actionable insights about gaps and strengths",
                  },
                  optimizedResume: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      headline: { type: "string" },
                      contact: { type: "string" },
                      summary: { type: "string" },
                      skills: { type: "array", items: { type: "string" } },
                      experience: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            role: { type: "string" },
                            company: { type: "string" },
                            period: { type: "string" },
                            bullets: { type: "array", items: { type: "string" } },
                          },
                          required: ["role", "company", "period", "bullets"],
                        },
                      },
                      education: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            degree: { type: "string" },
                            school: { type: "string" },
                            period: { type: "string" },
                          },
                          required: ["degree", "school", "period"],
                        },
                      },
                    },
                    required: [
                      "name",
                      "headline",
                      "contact",
                      "summary",
                      "skills",
                      "experience",
                      "education",
                    ],
                  },
                },
                required: [
                  "score",
                  "breakdown",
                  "matchedKeywords",
                  "missingKeywords",
                  "insights",
                  "optimizedResume",
                ],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_match_result" } },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Please top up your Lovable AI workspace.");
    if (!res.ok) {
      const t = await res.text();
      console.error("AI error", res.status, t);
      throw new Error("AI request failed");
    }

    const json: any = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) throw new Error("AI returned no result");
    const parsed = JSON.parse(call.function.arguments);
    return parsed;
  });
