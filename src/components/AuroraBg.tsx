export function AuroraBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full animate-pulse-glow"
        style={{ background: "radial-gradient(closest-side, oklch(0.55 0.27 305 / 0.45), transparent)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(closest-side, oklch(0.6 0.28 350 / 0.4), transparent)",
          animationDelay: "1.5s",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(closest-side, oklch(0.5 0.22 290 / 0.35), transparent)",
          animationDelay: "3s",
        }}
      />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
