import { Link } from "react-router-dom";
import { ArrowRight, Check, SlidersHorizontal, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import { LAPTOPS } from "@/data/products";
import { computeRecommendations, NEEDS } from "@/lib/spk";

const STEPS = [
  {
    num: "01",
    title: "Pilih Kriteria",
    desc: "Tentukan kebutuhan utamamu: gaming, desain, programming, atau produktivitas.",
  },
  {
    num: "02",
    title: "Tentukan Prioritas",
    desc: "Atur bobot prioritas — harga, processor, RAM, storage, dan GPU.",
  },
  {
    num: "03",
    title: "Lihat Rekomendasi",
    desc: "Dapatkan peringkat laptop dengan skor kecocokan tertinggi.",
  },
];

export default function SpkFeature() {
  // pratinjau: hasil metode SAW dengan bobot default "Gaming"
  const preview = computeRecommendations(LAPTOPS, NEEDS[0].weights).slice(0, 3);

  return (
    <section
      className="relative py-16 lg:py-24"
      data-testid="spk-feature-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-xl border border-brand/25 bg-[#0D0D11] p-8 sm:p-10 lg:p-14">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-[720px] -translate-x-1/2 rounded-full bg-brand/12 blur-[110px]" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
                  {"// "}Fitur Utama — Sistem Pendukung Keputusan
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                  Temukan Laptop yang Paling{" "}
                  <span className="text-brand">Cocok Untukmu</span>
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Gunakan rekomendasi berdasarkan kebutuhan dan prioritasmu.
                  Sistem kami menghitung skor kecocokan setiap laptop memakai
                  metode{" "}
                  <span className="font-mono text-zinc-300">
                    Simple Additive Weighting (SAW)
                  </span>
                  .
                </p>

                <ol className="mt-10 grid gap-6 sm:grid-cols-3">
                  {STEPS.map((s, i) => (
                    <li
                      key={s.num}
                      className="relative"
                      data-testid={`spk-step-${i + 1}`}
                    >
                      {i < STEPS.length - 1 && (
                        <span className="absolute top-4 left-full hidden h-px w-6 -translate-x-3 bg-gradient-to-r from-brand/60 to-transparent sm:block" />
                      )}
                      <span className="font-mono text-xl font-bold text-brand">
                        {s.num}
                      </span>
                      <p className="mt-2 flex items-center gap-1.5 font-heading text-sm font-bold uppercase tracking-wide">
                        {s.title}
                        {i < STEPS.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-brand/70" />
                        )}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    to="/rekomendasi"
                    data-testid="spk-cta-start"
                    className={buttonVariants({
                      size: "lg",
                      className:
                        "font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
                    })}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Mulai Rekomendasi
                  </Link>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    <Check className="h-3.5 w-3.5 text-brand" />
                    Gratis · Tanpa registrasi · 5 kriteria
                  </span>
                </div>
              </div>

              {/* kartu pratinjau hasil rekomendasi */}
              <Link
                to="/rekomendasi"
                data-testid="spk-preview-card"
                className="group relative block rounded-lg border border-border bg-black/60 p-6 shadow-glow-red transition-colors hover:border-brand/50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                    Pratinjau Hasil
                  </p>
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-brand">
                    <Trophy className="h-3 w-3" /> Top 3
                  </span>
                </div>
                <ul className="mt-5 space-y-4">
                  {preview.map((r) => (
                    <li
                      key={r.product.id}
                      className="flex items-center gap-3"
                      data-testid={`spk-preview-${r.rank}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-brand/50 font-mono text-xs font-bold text-brand">
                        #{r.rank}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {r.product.name}
                        </span>
                        <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-zinc-800">
                          <span
                            className="block h-full rounded-full bg-brand"
                            style={{ width: `${r.score}%` }}
                          />
                        </span>
                      </span>
                      <span className="font-mono text-sm font-bold text-brand">
                        {r.score}%
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-brand">
                  Coba sekarang — 2 menit selesai
                </p>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
