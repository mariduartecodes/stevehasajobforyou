import { motion } from "framer-motion";

export function ScoreRing({ value, size = 160 }: { value: number; size?: number }) {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="oklch(0.16 0.02 350)"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="oklch(0.68 0.22 350)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl text-gradient">{value}%</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ATS</div>
      </div>
    </div>
  );
}
