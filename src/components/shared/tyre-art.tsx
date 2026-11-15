import { cn } from "@/lib/utils";

/** Tyre render (SVG) shown when TASY has no product photo. */
export function TyreArt({ className }: { className?: string }) {
  const blocks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <svg viewBox="0 0 200 200" className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <radialGradient id="ta-rubber" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#3a3a42" />
          <stop offset="0.7" stopColor="#18181c" />
          <stop offset="1" stopColor="#09090b" />
        </radialGradient>
        <linearGradient id="ta-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="0.5" stopColor="#a9adb5" />
          <stop offset="1" stopColor="#6f747c" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="192" rx="70" ry="6" fill="#0b0b0d" opacity="0.18" />
      <circle cx="100" cy="100" r="88" fill="url(#ta-rubber)" />
      {/* tread blocks */}
      <g fill="#2a2a31">
        {blocks.map((a) => (
          <rect key={a} x="96" y="13" width="8" height="12" rx="1.5" transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="70" fill="none" stroke="#2e2e36" strokeWidth="2" />
      {/* sidewall lettering hint */}
      <circle cx="100" cy="100" r="62" fill="none" stroke="#3b3b44" strokeWidth="3" strokeDasharray="14 9" />
      {/* rim */}
      <circle cx="100" cy="100" r="50" fill="url(#ta-rim)" />
      <circle cx="100" cy="100" r="44" fill="#d9dce1" />
      <g fill="#8a8f97">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d="M95 62 L105 62 L108 88 L92 88 Z" transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="13" fill="url(#ta-rim)" stroke="#6f747c" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="4" fill="#4b5058" />
    </svg>
  );
}
