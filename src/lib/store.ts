import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MatchResult {
  score: number;
  breakdown: {
    keywords: number;
    formatting: number;
    experience: number;
    technical: number;
    soft: number;
  };
  missingKeywords: string[];
  matchedKeywords: string[];
  insights: string[];
  optimizedResume: OptimizedResume;
}

export interface OptimizedResume {
  name: string;
  headline: string;
  contact: string;
  summary: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  education: { degree: string; school: string; period: string }[];
  extras?: { title: string; items: string[] }[];
}

interface AppState {
  jobDescription: string;
  resumeText: string;
  resumeFileName: string;
  match: MatchResult | null;
  setJobDescription: (s: string) => void;
  setResume: (text: string, name: string) => void;
  setMatch: (m: MatchResult | null) => void;
  reset: () => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      jobDescription: "",
      resumeText: "",
      resumeFileName: "",
      match: null,
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setResume: (resumeText, resumeFileName) => set({ resumeText, resumeFileName }),
      setMatch: (match) => set({ match }),
      reset: () =>
        set({ jobDescription: "", resumeText: "", resumeFileName: "", match: null }),
    }),
    { name: "resume-ritual" },
  ),
);
