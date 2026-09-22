import { BRANDS } from "@/data/products";

export default function BrandStrip() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div
      className="overflow-hidden border-y border-border bg-black/40 py-4"
      data-testid="brand-strip"
    >
      <div className="animate-marquee flex w-max items-center gap-10 pr-10">
        {row.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="flex items-center gap-10 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600"
          >
            {brand}
            <span className="text-brand/70">//</span>
          </span>
        ))}
      </div>
    </div>
  );
}
