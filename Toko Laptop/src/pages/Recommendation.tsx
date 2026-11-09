import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Briefcase,
  Check,
  Code,
  Gamepad2,
  Palette,
  RotateCcw,
  Scale,
  ShoppingCart,
  Trophy,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FadeIn from "@/components/FadeIn";
import { useCart } from "@/context/CartContext";
import { useSpk, type SpkPick } from "@/context/SpkContext";
import { toast } from "sonner";
import { LAPTOPS, type Product } from "@/data/products";
import {
  applySaatyPair,
  computeAhpRecommendations,
  CRITERIA_ORDER,
  matrixFromSaatyGrid,
  NEEDS,
  saatyGridFromWeights,
  WEIGHT_LABELS,
  type AhpComputation,
  type NeedKey,
  type SpkResult,
} from "@/lib/spk";
import { SAATY_SCALE } from "@/lib/ahp";
import { formatRupiah } from "@/lib/config";
import { cn } from "@/lib/utils";

const NEED_ICONS: Record<NeedKey, typeof Gamepad2> = {
  gaming: Gamepad2,
  desain: Palette,
  programming: Code,
  produktivitas: Briefcase,
};

/** Seluruh pasangan sel satu-per-satu di atas diagonal matriks 5x5 (10 perbandingan) */
const PAIR_INDICES: [number, number][] = [];
CRITERIA_ORDER.forEach((_ci, i) =>
  CRITERIA_ORDER.forEach((_cj, j) => {
    if (i < j) PAIR_INDICES.push([i, j]);
  }),
);

const fmtNum = (v: number, d = 3) => v.toFixed(d).replace(".", ",");

function ScoreRing({ score, size = 104 }: { score: number; size?: number }) {
  return (
    <div
      data-testid="score-ring"
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#e8202f ${score}%, #232329 0)`,
      }}
    >
      <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-card">
        <span className="font-heading text-lg font-bold text-foreground">
          {score}%
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-500">
          Skor
        </span>
      </div>
    </div>
  );
}

function SpecChips({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.tags.slice(0, 4).map((t) => (
        <span
          key={t}
          className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-zinc-400"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function ChooseButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { add } = useCart();
  const navigate = useNavigate();
  return (
    <button
      data-testid={`result-choose-${product.id}`}
      onClick={() => {
        add(product.id, 1);
        toast.success(`${product.name} dipilih & masuk keranjang`, {
          description: formatRupiah(product.price),
          action: {
            label: "Lihat Keranjang",
            onClick: () => navigate("/keranjang"),
          },
        });
      }}
      className={buttonVariants({
        size: "sm",
        className: cn(
          "font-mono text-[10px] font-bold uppercase tracking-wider",
          className,
        ),
      })}
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      Pilih Laptop
    </button>
  );
}

function DetailButton({ product }: { product: Product }) {
  return (
    <Link
      to={`/produk/${product.id}`}
      data-testid={`result-detail-${product.id}`}
      className={buttonVariants({
        variant: "outline",
        size: "sm",
        className: "font-mono text-[10px] font-bold uppercase tracking-wider",
      })}
    >
      Lihat Detail
    </Link>
  );
}

/** Dropdown satu perbandingan berpasangan (skala Saaty) */
function PairSelect({
  grid,
  i,
  j,
  onChange,
  mobile = false,
}: {
  grid: string[][];
  i: number;
  j: number;
  onChange: (i: number, j: number, key: string) => void;
  mobile?: boolean;
}) {
  return (
    <Select value={grid[i][j]} onValueChange={(v) => onChange(i, j, v)}>
      <SelectTrigger
        size="sm"
        data-testid={`ahp-pair-${CRITERIA_ORDER[i]}-${CRITERIA_ORDER[j]}`}
        aria-label={`Perbandingan ${WEIGHT_LABELS[CRITERIA_ORDER[i]]} terhadap ${WEIGHT_LABELS[CRITERIA_ORDER[j]]}`}
        className={cn(mobile ? "mt-3 w-full" : "w-[88px]")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SAATY_SCALE.map((s) => (
          <SelectItem key={s.key} value={s.key}>
            {mobile ? s.label : s.key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function Recommendation() {
  const {
    picks: storedPicks,
    need: storedNeed,
    save,
    clear: clearStored,
  } = useSpk();
  const [need, setNeed] = useState<NeedKey | null>(storedNeed);
  const [grid, setGrid] = useState<string[][]>(() =>
    saatyGridFromWeights(NEEDS[0].weights),
  );
  const [computation, setComputation] = useState<AhpComputation | null>(null);
  const [showResults, setShowResults] = useState<boolean>(
    () => storedPicks !== null,
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const results: SpkResult[] = useMemo(() => {
    if (storedPicks && storedPicks.length > 0) {
      const fromStorage = storedPicks
        .map((pick: SpkPick) => {
          const product = LAPTOPS.find((p) => p.id === pick.id);
          return product
            ? { product, score: pick.score, rank: pick.rank }
            : null;
        })
        .filter((r): r is SpkResult => Boolean(r));
      if (fromStorage.length > 0) return fromStorage;
    }
    return computation?.results ?? [];
  }, [storedPicks, computation]);

  const currentStep = !need ? 1 : !showResults ? 2 : 3;
  const top = results[0];
  const runnersUp = results.slice(1, 3);
  const rest = results.slice(3);

  const chooseNeed = (key: NeedKey) => {
    setNeed(key);
    const preset = NEEDS.find((n) => n.key === key);
    if (preset) setGrid(saatyGridFromWeights(preset.weights));
  };

  const viewResults = () => {
    if (!need) return;
    const comp = computeAhpRecommendations(LAPTOPS, matrixFromSaatyGrid(grid));
    setComputation(comp);
    save(
      need,
      comp.results
        .slice(0, 5)
        .map((r) => ({ id: r.product.id, rank: r.rank, score: r.score })),
    );
    setShowResults(true);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
  };

  const handlePairChange = (i: number, j: number, key: string) => {
    setGrid((g) => applySaatyPair(g, i, j, key));
  };

  const reset = () => {
    clearStored();
    setNeed(null);
    setComputation(null);
    setShowResults(false);
    setGrid(saatyGridFromWeights(NEEDS[0].weights));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8"
      data-testid="recommendation-page"
    >
      <FadeIn>
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            {"// "}Rekomendasi SPK — Sistem Pendukung Keputusan
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Temukan Laptop yang Paling{" "}
            <span className="text-brand">Cocok Untukmu</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Gunakan rekomendasi berdasarkan kebutuhan dan prioritasmu. Tiga
            langkah singkat, hasil terhitung dengan metode{" "}
            <span className="font-mono text-zinc-300">
              Analytical Hierarchy Process (AHP)
            </span>
            .
          </p>
        </div>
      </FadeIn>

      {/* step indicator */}
      <FadeIn delay={0.05}>
        <ol
          className="mt-10 flex items-center gap-0"
          data-testid="spk-step-indicator"
        >
          {["Kebutuhan", "Prioritas", "Hasil"].map((label, i) => {
            const stepNum = i + 1;
            const done = stepNum < currentStep;
            const active = stepNum === currentStep;
            return (
              <li
                key={label}
                className={cn("flex items-center", i < 2 && "flex-1")}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold transition-colors",
                      done && "border-brand bg-brand text-white",
                      active && "border-brand bg-brand/10 text-brand",
                      !done && !active && "border-border text-zinc-500",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : stepNum}
                  </span>
                  <span
                    className={cn(
                      "hidden font-mono text-[10px] font-semibold uppercase tracking-[0.2em] sm:block",
                      active ? "text-foreground" : "text-zinc-500",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <span
                    className={cn(
                      "mx-3 h-px flex-1",
                      done ? "bg-brand" : "bg-border",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </FadeIn>

      {/* langkah 1 — kebutuhan */}
      <FadeIn delay={0.08}>
        <section className="mt-12" data-testid="spk-step-needs">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
            <span className="text-brand">Langkah 1</span> — Pilih Kebutuhan
            Utama
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {NEEDS.map((n) => {
              const Icon = NEED_ICONS[n.key];
              const selected = need === n.key;
              return (
                <button
                  key={n.key}
                  data-testid={`need-option-${n.key}`}
                  onClick={() => chooseNeed(n.key)}
                  className={cn(
                    "group rounded-lg border p-5 text-left transition-all duration-200",
                    selected
                      ? "border-brand bg-brand/10 shadow-glow-red"
                      : "border-border bg-card hover:border-brand/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border",
                        selected
                          ? "border-brand bg-brand text-white"
                          : "border-border bg-secondary text-brand",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {selected && (
                      <Check
                        className="h-4 w-4 text-brand"
                        data-testid={`need-selected-check-${n.key}`}
                      />
                    )}
                  </div>
                  <p className="mt-4 font-heading text-sm font-bold uppercase tracking-wide">
                    {n.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {n.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* langkah 2 — perbandingan berpasangan kriteria (AHP) */}
      <FadeIn delay={0.1}>
        <section className="mt-12" data-testid="spk-step-weights">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
              <span className="text-brand">Langkah 2</span> — Perbandingan
              Kriteria (Skala Saaty)
            </h2>
            {need && (
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
                data-testid="spk-preset-note"
              >
                Matriks awal diisi otomatis untuk kebutuhan:{" "}
                <span className="text-brand">
                  {NEEDS.find((n) => n.key === need)?.label}
                </span>
              </p>
            )}
          </div>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Bandingkan pentingnya satu kriteria terhadap kriteria lain (skala
            1–9 dan kebalikannya). Nilai di bawah diagonal terisi otomatis
            sebagai kebalikan (reciprocal).
          </p>

          {/* desktop: matriks perbandingan berpasangan */}
          <div
            className="mt-5 hidden overflow-x-auto rounded-lg border border-border bg-card md:block"
            data-testid="ahp-matrix-table"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Kriteria
                  </th>
                  {CRITERIA_ORDER.map((c) => (
                    <th
                      key={c}
                      className="px-3 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
                    >
                      {WEIGHT_LABELS[c]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CRITERIA_ORDER.map((ci, i) => (
                  <tr
                    key={ci}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2.5 font-medium text-zinc-200">
                      {WEIGHT_LABELS[ci]}
                    </td>
                    {CRITERIA_ORDER.map((cj, j) => (
                      <td key={cj} className="px-3 py-2.5">
                        {i === j ? (
                          <span
                            className="font-mono text-xs text-zinc-600"
                            data-testid={`ahp-diagonal-${ci}`}
                          >
                            1
                          </span>
                        ) : i > j ? (
                          <span
                            className="font-mono text-xs text-zinc-500"
                            data-testid={`ahp-reciprocal-${ci}-${cj}`}
                          >
                            {grid[i][j]}
                          </span>
                        ) : (
                          <PairSelect
                            grid={grid}
                            i={i}
                            j={j}
                            onChange={handlePairChange}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile: kartu perbandingan */}
          <div
            className="mt-5 space-y-3 md:hidden"
            data-testid="ahp-pair-cards"
          >
            {PAIR_INDICES.map(([i, j]) => (
              <div
                key={`${i}-${j}`}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-sm">
                  Seberapa penting{" "}
                  <span className="font-semibold text-brand">
                    {WEIGHT_LABELS[CRITERIA_ORDER[i]]}
                  </span>{" "}
                  dibanding{" "}
                  <span className="font-semibold text-zinc-200">
                    {WEIGHT_LABELS[CRITERIA_ORDER[j]]}
                  </span>
                  ?
                </p>
                <PairSelect
                  grid={grid}
                  i={i}
                  j={j}
                  onChange={handlePairChange}
                  mobile
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={viewResults}
              disabled={!need}
              data-testid="spk-view-results-button"
              className={buttonVariants({
                size: "lg",
                className:
                  "font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
              })}
            >
              <Scale className="h-4 w-4" />
              Lihat Rekomendasi
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {need
                ? `${LAPTOPS.length} laptop dianalisis · 5 kriteria · uji konsistensi otomatis`
                : "Pilih kebutuhan utama terlebih dahulu"}
            </p>
          </div>
        </section>
      </FadeIn>

      {/* langkah 3 — hasil */}
      <div ref={resultsRef} className="scroll-mt-24">
        {showResults && results.length > 0 && (
          <FadeIn>
            <section className="mt-16" data-testid="spk-step-results">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                    Laptop yang Paling{" "}
                    <span className="text-brand">Direkomendasikan Untukmu</span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Hasil dihitung dengan metode{" "}
                    <span className="font-mono text-zinc-300">AHP</span>: bobot
                    kriteria dari matriks perbandingan berpasangan + prioritas
                    alternatif dari data spesifikasi.
                  </p>
                </div>
                <button
                  onClick={reset}
                  data-testid="spk-reset-button"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className:
                      "font-mono text-[10px] font-bold uppercase tracking-wider",
                  })}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Ulangi
                </button>
              </div>

              {/* panel konsistensi & bobot hasil AHP */}
              {computation && (
                <div
                  className="mt-6 rounded-lg border border-border bg-card p-5"
                  data-testid="ahp-consistency-panel"
                >
                  <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                    {[
                      {
                        label: "λ maks",
                        value: fmtNum(computation.consistency.lambdaMax),
                      },
                      {
                        label: "CI",
                        value: fmtNum(computation.consistency.ci),
                      },
                      {
                        label: "RI",
                        value: fmtNum(computation.consistency.ri),
                      },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                          {s.label}
                        </p>
                        <p className="mt-1 font-mono text-sm font-bold text-zinc-200">
                          {s.value}
                        </p>
                      </div>
                    ))}
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        CR
                      </p>
                      <p
                        className={cn(
                          "mt-1 font-mono text-sm font-bold",
                          computation.consistency.consistent
                            ? "text-emerald-400"
                            : "text-amber-400",
                        )}
                        data-testid="ahp-cr-value"
                      >
                        {fmtNum(computation.consistency.cr)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-sm border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
                        computation.consistency.consistent
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-400",
                      )}
                      data-testid="ahp-consistency-badge"
                    >
                      {computation.consistency.consistent
                        ? "Matriks Konsisten"
                        : "Tidak Konsisten"}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Bobot kriteria hasil AHP (Σ = 100%)
                    </p>
                    <div
                      className="mt-2 flex flex-wrap gap-2"
                      data-testid="ahp-weights-list"
                    >
                      {CRITERIA_ORDER.map((c, idx) => (
                        <span
                          key={c}
                          className="rounded-sm border border-border bg-secondary px-2 py-1 font-mono text-[11px] text-zinc-300"
                        >
                          {WEIGHT_LABELS[c]}{" "}
                          <span className="font-bold text-brand">
                            {(computation.weights[idx] * 100)
                              .toFixed(1)
                              .replace(".", ",")}
                            %
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* peringatan konsistensi */}
              {computation && !computation.consistency.consistent && (
                <div
                  className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
                  data-testid="ahp-consistency-warning"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <p className="text-sm leading-relaxed text-amber-200">
                    Consistency Ratio (CR) ={" "}
                    {fmtNum(computation.consistency.cr)} lebih dari 0,1 —
                    perbandingan kriteria Anda perlu diperbaiki. Hasil tetap
                    ditampilkan, tetapi keputusan terbaik diperoleh saat CR ≤
                    0,1.
                  </p>
                </div>
              )}

              {/* peringkat #1 */}
              {top && (
                <article
                  data-testid={`result-card-${top.product.id}`}
                  className="relative mt-8 overflow-hidden rounded-xl border border-brand/40 bg-gradient-to-br from-brand/12 via-card to-card p-6 shadow-glow-red sm:p-8"
                >
                  <div className="pointer-events-none absolute -top-20 right-0 h-52 w-96 rounded-full bg-brand/15 blur-[90px]" />
                  <div className="relative grid gap-6 lg:grid-cols-[auto_auto_1fr] lg:items-center">
                    <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                      <span
                        className="font-heading text-6xl font-bold text-brand drop-shadow-[0_0_18px_rgba(232,32,47,0.5)]"
                        data-testid="result-top-rank"
                      >
                        #1
                      </span>
                      <ScoreRing score={top.score} />
                    </div>
                    <Link
                      to={`/produk/${top.product.id}`}
                      data-testid={`result-top-image-link-${top.product.id}`}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <img
                        src={top.product.image}
                        alt={top.product.name}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105 lg:w-72"
                      />
                    </Link>
                    <div>
                      <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
                        <Trophy className="h-3.5 w-3.5" /> Paling
                        Direkomendasikan
                      </p>
                      <h3
                        className="mt-2 font-heading text-2xl font-bold tracking-tight"
                        data-testid="result-top-name"
                      >
                        {top.product.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
                        {top.product.brand} · {formatRupiah(top.product.price)}
                      </p>
                      <div className="mt-4">
                        <SpecChips product={top.product} />
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <DetailButton product={top.product} />
                        <ChooseButton product={top.product} />
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* peringkat #2 dan #3 */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {runnersUp.map((r) => (
                  <article
                    key={r.product.id}
                    data-testid={`result-card-${r.product.id}`}
                    className="flex gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/40"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span className="font-heading text-3xl font-bold text-zinc-400">
                        #{r.rank}
                      </span>
                      <ScoreRing score={r.score} size={72} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="truncate font-heading text-base font-bold"
                        data-testid={`result-name-${r.product.id}`}
                      >
                        {r.product.name}
                      </h3>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                        {r.product.brand} · {formatRupiah(r.product.price)}
                      </p>
                      <div className="mt-3">
                        <SpecChips product={r.product} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <DetailButton product={r.product} />
                        <ChooseButton product={r.product} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* peringkat 4+ */}
              {rest.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  {rest.map((r, i) => (
                    <div
                      key={r.product.id}
                      data-testid={`result-row-${r.product.id}`}
                      className={cn(
                        "flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-accent",
                        i > 0 && "border-t border-border",
                      )}
                    >
                      <span className="font-heading text-xl font-bold text-zinc-500">
                        #{r.rank}
                      </span>
                      <img
                        src={r.product.image}
                        alt=""
                        className="h-12 w-16 rounded-sm object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {r.product.name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          {r.product.brand} · {formatRupiah(r.product.price)}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-bold text-brand">
                        {r.score}%
                      </span>
                      <DetailButton product={r.product} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
