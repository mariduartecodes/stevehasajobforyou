import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `You are an elite ATS resume optimization specialist. You analyze job descriptions and candidate resumes, then produce an ATS-optimized rewrite.

CRITICAL TRUTH RULES — NEVER VIOLATE:
- NEVER invent jobs, companies, dates, certifications, degrees, or accomplishments.
- ONLY reword, restructure, and emphasize what the candidate actually provided.
- If something is missing, leave it out — do not fabricate.

You may: improve clarity, strengthen action verbs, surface keywords that the candidate genuinely matches, tighten bullets, and reorganize for ATS readability.

Return a single JSON object via the tool call. Be concise but specific.`;

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
