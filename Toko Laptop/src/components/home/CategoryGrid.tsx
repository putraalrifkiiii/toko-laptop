import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";
import { HOME_TILES, PRODUCTS } from "@/data/products";

function countFor(href: string): number {
  const slug = href.replace("/kategori/", "");
  return PRODUCTS.filter((p) => p.category === slug).length;
}

export default function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24" data-testid="category-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Kategori"
            title="Jelajahi Kategori"
            sub="Dari gaming laptop sampai periferal — semua perangkat premium dalam satu tempat."
          />
        </FadeIn>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {HOME_TILES.map((tile, i) => (
            <FadeIn key={tile.label} delay={i * 0.06}>
              <Link
                to={tile.href}
                data-testid={`category-tile-${tile.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="group relative block h-52 overflow-hidden rounded-lg border border-border transition-all duration-300 hover:border-brand/60 hover:shadow-glow-red sm:h-60"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                    {tile.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    {tile.note}
                  </p>
                </div>
                <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-black/60 text-zinc-300 transition-colors group-hover:border-brand group-hover:text-brand">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
                {tile.href !== "/kategori/komponen" && (
                  <span className="absolute top-3 left-3 rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300 backdrop-blur-sm">
                    {countFor(tile.href)} produk
                  </span>
                )}
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
