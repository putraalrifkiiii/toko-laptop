import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HERO_IMG } from "@/data/products";

const STATS = [
  { value: "500+", label: "Produk Original" },
  { value: "4.9/5", label: "Rating Pembeli" },
  { value: "100%", label: "Garansi Resmi" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* latar: grid halus + glow merah */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-brand/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-[-15%] h-[400px] w-[400px] rounded-full bg-brand/8 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-2 rounded-sm border border-brand/30 bg-brand/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-brand"
          >
            <Zap className="h-3 w-3" />
            Toko Komputer &amp; Gaming Premium
          </p>
          <h1 className="mt-6 font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-foreground">Performa</span>
            <span className="text-glow-red block text-brand">Tanpa Batas</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Temukan perangkat yang tepat untuk kebutuhan gaming, kreativitas,
            dan produktivitasmu.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/rekomendasi"
              data-testid="hero-cta-rekomendasi"
              className={buttonVariants({
                size: "lg",
                className:
                  "font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
              })}
            >
              <Search className="h-4 w-4" />
              Cari Laptop Terbaik
            </Link>
            <Link
              to="/produk"
              data-testid="hero-cta-produk"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "font-mono text-xs font-bold uppercase tracking-[0.15em]",
              })}
            >
              Jelajahi Produk
            </Link>
          </div>
          <dl className="mt-12 flex gap-8 border-t border-border pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-2xl font-bold text-foreground">
                  {s.value}
                </dd>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="pointer-events-none absolute inset-8 rounded-full bg-brand/20 blur-[90px]" />
          <img
            src={HERO_IMG}
            alt="Gaming laptop premium dengan cahaya merah"
            data-testid="hero-image"
            className="relative w-full rounded-xl border border-border shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-5 left-6 rounded-lg border border-brand/40 bg-black/80 px-4 py-3 backdrop-blur-md"
            data-testid="hero-chip-spec"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Layar
            </p>
            <p className="font-heading text-sm font-bold text-foreground">
              16" QHD+ · 240Hz
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="absolute -top-4 right-6 rounded-lg border border-brand/40 bg-black/80 px-4 py-3 backdrop-blur-md"
            data-testid="hero-chip-spk"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              Rekomendasi SPK
            </p>
            <p className="font-heading text-sm font-bold text-foreground">
              Skor Kecocokan 93%
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
