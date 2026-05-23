export function AuroraBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* single subtle pink wash */}
      <div
        className="absolute -top-60 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.55 0.22 350 / 0.18), transparent 70%)",
        }}
      />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      />
    </div>
  );
}
