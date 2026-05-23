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
          stroke="oklch(0.22 0.04 295)"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.25 305)" />
            <stop offset="100%" stopColor="oklch(0.7 0.28 350)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl text-gradient">{value}%</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ATS</div>
      </div>
    </div>
  );
}
