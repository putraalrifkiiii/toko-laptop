// import { useMemo, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   Check,
//   Code,
//   Gamepad2,
//   Palette,
//   RotateCcw,
//   ShoppingCart,
//   SlidersHorizontal,
//   Trophy,
// } from "lucide-react";
// import { buttonVariants } from "@/components/ui/button";
// import FadeIn from "@/components/FadeIn";
// import { useCart } from "@/context/CartContext";
// import { useSpk, type SpkPick } from "@/context/SpkContext";
// import { toast } from "sonner";
// import { LAPTOPS, type Product } from "@/data/products";
// import {
//   computeRecommendations,
//   NEEDS,
//   WEIGHT_LABELS,
//   type NeedKey,
//   type SpkResult,
//   type SpkWeights,
// } from "@/lib/spk";
// import { formatRupiah } from "@/lib/config";
// import { cn } from "@/lib/utils";

// const NEED_ICONS: Record<NeedKey, typeof Gamepad2> = {
//   gaming: Gamepad2,
//   desain: Palette,
//   programming: Code,
//   produktivitas: Briefcase,
// };

// const WEIGHT_KEYS = Object.keys(WEIGHT_LABELS) as (keyof SpkWeights)[];

// function ScoreRing({ score, size = 104 }: { score: number; size?: number }) {
//   return (
//     <div
//       data-testid="score-ring"
//       className="relative shrink-0 rounded-full"
//       style={{
//         width: size,
//         height: size,
//         background: `conic-gradient(#e8202f ${score}%, #232329 0)`,
//       }}
//     >
//       <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-card">
//         <span className="font-heading text-lg font-bold text-foreground">
//           {score}%
//         </span>
//         <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-500">
//           Skor
//         </span>
//       </div>
//     </div>
//   );
// }

// function SpecChips({ product }: { product: Product }) {
//   return (
//     <div className="flex flex-wrap gap-1.5">
//       {product.tags.slice(0, 4).map((t) => (
//         <span
//           key={t}
//           className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-zinc-400"
//         >
//           {t}
//         </span>
//       ))}
//     </div>
//   );
// }

// function ChooseButton({
//   product,
//   className,
// }: {
//   product: Product;
//   className?: string;
// }) {
//   const { add } = useCart();
//   const navigate = useNavigate();
//   return (
//     <button
//       data-testid={`result-choose-${product.id}`}
//       onClick={() => {
//         add(product.id, 1);
//         toast.success(`${product.name} dipilih & masuk keranjang`, {
//           description: formatRupiah(product.price),
//           action: {
//             label: "Lihat Keranjang",
//             onClick: () => navigate("/keranjang"),
//           },
//         });
//       }}
//       className={buttonVariants({
//         size: "sm",
//         className: cn(
//           "font-mono text-[10px] font-bold uppercase tracking-wider",
//           className,
//         ),
//       })}
//     >
//       <ShoppingCart className="h-3.5 w-3.5" />
//       Pilih Laptop
//     </button>
//   );
// }

// function DetailButton({ product }: { product: Product }) {
//   return (
//     <Link
//       to={`/produk/${product.id}`}
//       data-testid={`result-detail-${product.id}`}
//       className={buttonVariants({
//         variant: "outline",
//         size: "sm",
//         className: "font-mono text-[10px] font-bold uppercase tracking-wider",
//       })}
//     >
//       Lihat Detail
//     </Link>
//   );
// }

// export default function Recommendation() {
//   const {
//     picks: storedPicks,
//     need: storedNeed,
//     save,
//     clear: clearStored,
//   } = useSpk();
//   const [need, setNeed] = useState<NeedKey | null>(storedNeed);
//   const [weights, setWeights] = useState<SpkWeights>(
//     () =>
//       NEEDS.find((n) => n.key === storedNeed)?.weights ?? {
//         harga: 5,
//         processor: 5,
//         ram: 5,
//         storage: 5,
//         gpu: 5,
//       },
//   );
//   const [showResults, setShowResults] = useState<boolean>(
//     () => storedPicks !== null,
//   );
//   const resultsRef = useRef<HTMLDivElement>(null);

//   const results: SpkResult[] = useMemo(() => {
//     if (storedPicks && storedPicks.length > 0) {
//       const fromStorage = storedPicks
//         .map((pick: SpkPick) => {
//           const product = LAPTOPS.find((p) => p.id === pick.id);
//           return product
//             ? { product, score: pick.score, rank: pick.rank }
//             : null;
//         })
//         .filter((r): r is SpkResult => Boolean(r));
//       if (fromStorage.length > 0) return fromStorage;
//     }
//     if (!showResults) return [];
//     return computeRecommendations(LAPTOPS, weights).slice(0, 5);
//   }, [storedPicks, showResults, weights]);

//   const totalWeight = WEIGHT_KEYS.reduce((sum, k) => sum + weights[k], 0);
//   const currentStep = !need ? 1 : !showResults ? 2 : 3;
//   const top = results[0];
//   const runnersUp = results.slice(1, 3);
//   const rest = results.slice(3);

//   const chooseNeed = (key: NeedKey) => {
//     setNeed(key);
//     const preset = NEEDS.find((n) => n.key === key);
//     if (preset) setWeights(preset.weights);
//   };

//   const viewResults = () => {
//     if (totalWeight === 0 || !need) return;
//     save(
//       need,
//       computeRecommendations(LAPTOPS, weights)
//         .slice(0, 5)
//         .map((r) => ({ id: r.product.id, rank: r.rank, score: r.score })),
//     );
//     setShowResults(true);
//     requestAnimationFrame(() =>
//       resultsRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       }),
//     );
//   };

//   const reset = () => {
//     clearStored();
//     setNeed(null);
//     setShowResults(false);
//     setWeights({ harga: 5, processor: 5, ram: 5, storage: 5, gpu: 5 });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div
//       className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8"
//       data-testid="recommendation-page"
//     >
//       <FadeIn>
//         <div className="max-w-3xl">
//           <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
//             {"// "}Rekomendasi SPK — Sistem Pendukung Keputusan
//           </p>
//           <h1 className="mt-3 font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
//             Temukan Laptop yang Paling{" "}
//             <span className="text-brand">Cocok Untukmu</span>
//           </h1>
//           <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
//             Gunakan rekomendasi berdasarkan kebutuhan dan prioritasmu. Tiga
//             langkah singkat, hasil terhitung dengan metode{" "}
//             <span className="font-mono text-zinc-300">
//               Simple Additive Weighting (SAW)
//             </span>
//             .
//           </p>
//         </div>
//       </FadeIn>

//       {/* step indicator */}
//       <FadeIn delay={0.05}>
//         <ol
//           className="mt-10 flex items-center gap-0"
//           data-testid="spk-step-indicator"
//         >
//           {["Kebutuhan", "Prioritas", "Hasil"].map((label, i) => {
//             const stepNum = i + 1;
//             const done = stepNum < currentStep;
//             const active = stepNum === currentStep;
//             return (
//               <li
//                 key={label}
//                 className={cn("flex items-center", i < 2 && "flex-1")}
//               >
//                 <div className="flex items-center gap-2.5">
//                   <span
//                     className={cn(
//                       "flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold transition-colors",
//                       done && "border-brand bg-brand text-white",
//                       active && "border-brand bg-brand/10 text-brand",
//                       !done && !active && "border-border text-zinc-500",
//                     )}
//                   >
//                     {done ? <Check className="h-3.5 w-3.5" /> : stepNum}
//                   </span>
//                   <span
//                     className={cn(
//                       "hidden font-mono text-[10px] font-semibold uppercase tracking-[0.2em] sm:block",
//                       active ? "text-foreground" : "text-zinc-500",
//                     )}
//                   >
//                     {label}
//                   </span>
//                 </div>
//                 {i < 2 && (
//                   <span
//                     className={cn(
//                       "mx-3 h-px flex-1",
//                       done ? "bg-brand" : "bg-border",
//                     )}
//                   />
//                 )}
//               </li>
//             );
//           })}
//         </ol>
//       </FadeIn>

//       {/* langkah 1 — kebutuhan */}
//       <FadeIn delay={0.08}>
//         <section className="mt-12" data-testid="spk-step-needs">
//           <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
//             <span className="text-brand">Langkah 1</span> — Pilih Kebutuhan
//             Utama
//           </h2>
//           <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             {NEEDS.map((n) => {
//               const Icon = NEED_ICONS[n.key];
//               const selected = need === n.key;
//               return (
//                 <button
//                   key={n.key}
//                   data-testid={`need-option-${n.key}`}
//                   onClick={() => chooseNeed(n.key)}
//                   className={cn(
//                     "group rounded-lg border p-5 text-left transition-all duration-200",
//                     selected
//                       ? "border-brand bg-brand/10 shadow-glow-red"
//                       : "border-border bg-card hover:border-brand/40",
//                   )}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={cn(
//                         "flex h-10 w-10 items-center justify-center rounded-md border",
//                         selected
//                           ? "border-brand bg-brand text-white"
//                           : "border-border bg-secondary text-brand",
//                       )}
//                     >
//                       <Icon className="h-5 w-5" />
//                     </span>
//                     {selected && (
//                       <Check
//                         className="h-4 w-4 text-brand"
//                         data-testid={`need-selected-check-${n.key}`}
//                       />
//                     )}
//                   </div>
//                   <p className="mt-4 font-heading text-sm font-bold uppercase tracking-wide">
//                     {n.label}
//                   </p>
//                   <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
//                     {n.desc}
//                   </p>
//                 </button>
//               );
//             })}
//           </div>
//         </section>
//       </FadeIn>

//       {/* langkah 2 — prioritas */}
//       <FadeIn delay={0.1}>
//         <section className="mt-12" data-testid="spk-step-weights">
//           <div className="flex flex-wrap items-baseline justify-between gap-2">
//             <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
//               <span className="text-brand">Langkah 2</span> — Tentukan Prioritas
//             </h2>
//             {need && (
//               <p
//                 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
//                 data-testid="spk-preset-note"
//               >
//                 Bobot awal diisi otomatis untuk kebutuhan:{" "}
//                 <span className="text-brand">
//                   {NEEDS.find((n) => n.key === need)?.label}
//                 </span>
//               </p>
//             )}
//           </div>
//           <div className="mt-5 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
//             {WEIGHT_KEYS.map((k) => (
//               <div key={k} data-testid={`weight-slider-${k}`}>
//                 <div className="flex items-center justify-between">
//                   <label
//                     htmlFor={`slider-${k}`}
//                     className="text-sm font-medium text-zinc-200"
//                   >
//                     {WEIGHT_LABELS[k]}
//                   </label>
//                   <span className="rounded-sm border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-xs font-bold text-brand">
//                     {weights[k]}/10
//                   </span>
//                 </div>
//                 <input
//                   id={`slider-${k}`}
//                   type="range"
//                   min={0}
//                   max={10}
//                   step={1}
//                   value={weights[k]}
//                   onChange={(e) =>
//                     setWeights((w) => ({ ...w, [k]: Number(e.target.value) }))
//                   }
//                   className="mt-3 w-full"
//                   data-testid={`weight-slider-input-${k}`}
//                   aria-label={`Bobot prioritas ${WEIGHT_LABELS[k]}`}
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 flex flex-wrap items-center gap-4">
//             <button
//               onClick={viewResults}
//               disabled={!need || totalWeight === 0}
//               data-testid="spk-view-results-button"
//               className={buttonVariants({
//                 size: "lg",
//                 className:
//                   "font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
//               })}
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               Lihat Rekomendasi
//             </button>
//             <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
//               {totalWeight === 0
//                 ? "Atur minimal satu bobot prioritas"
//                 : `Total bobot: ${totalWeight} · ${LAPTOPS.length} laptop dianalisis`}
//             </p>
//           </div>
//         </section>
//       </FadeIn>

//       {/* langkah 3 — hasil */}
//       <div ref={resultsRef} className="scroll-mt-24">
//         {showResults && results.length > 0 && (
//           <FadeIn>
//             <section className="mt-16" data-testid="spk-step-results">
//               <div className="flex flex-wrap items-end justify-between gap-4">
//                 <div>
//                   <h2 className="font-heading text-2xl font-bold uppercase tracking-tight sm:text-3xl">
//                     Laptop yang Paling{" "}
//                     <span className="text-brand">Direkomendasikan Untukmu</span>
//                   </h2>
//                   <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
//                     Hasil dihitung dengan metode{" "}
//                     <span className="font-mono text-zinc-300">SAW</span> dari 5
//                     kriteria sesuai bobot prioritas yang kamu tentukan.
//                   </p>
//                 </div>
//                 <button
//                   onClick={reset}
//                   data-testid="spk-reset-button"
//                   className={buttonVariants({
//                     variant: "outline",
//                     size: "sm",
//                     className:
//                       "font-mono text-[10px] font-bold uppercase tracking-wider",
//                   })}
//                 >
//                   <RotateCcw className="h-3.5 w-3.5" />
//                   Ulangi
//                 </button>
//               </div>

//               {/* peringkat #1 */}
//               {top && (
//                 <article
//                   data-testid={`result-card-${top.product.id}`}
//                   className="relative mt-8 overflow-hidden rounded-xl border border-brand/40 bg-gradient-to-br from-brand/12 via-card to-card p-6 shadow-glow-red sm:p-8"
//                 >
//                   <div className="pointer-events-none absolute -top-20 right-0 h-52 w-96 rounded-full bg-brand/15 blur-[90px]" />
//                   <div className="relative grid gap-6 lg:grid-cols-[auto_auto_1fr] lg:items-center">
//                     <div className="flex items-center gap-4 lg:flex-col lg:items-start">
//                       <span
//                         className="font-heading text-6xl font-bold text-brand drop-shadow-[0_0_18px_rgba(232,32,47,0.5)]"
//                         data-testid="result-top-rank"
//                       >
//                         #1
//                       </span>
//                       <ScoreRing score={top.score} />
//                     </div>
//                     <Link
//                       to={`/produk/${top.product.id}`}
//                       data-testid={`result-top-image-link-${top.product.id}`}
//                       className="overflow-hidden rounded-lg border border-border"
//                     >
//                       <img
//                         src={top.product.image}
//                         alt={top.product.name}
//                         className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105 lg:w-72"
//                       />
//                     </Link>
//                     <div>
//                       <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
//                         <Trophy className="h-3.5 w-3.5" /> Paling
//                         Direkomendasikan
//                       </p>
//                       <h3
//                         className="mt-2 font-heading text-2xl font-bold tracking-tight"
//                         data-testid="result-top-name"
//                       >
//                         {top.product.name}
//                       </h3>
//                       <p className="mt-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
//                         {top.product.brand} · {formatRupiah(top.product.price)}
//                       </p>
//                       <div className="mt-4">
//                         <SpecChips product={top.product} />
//                       </div>
//                       <div className="mt-6 flex flex-wrap gap-3">
//                         <DetailButton product={top.product} />
//                         <ChooseButton product={top.product} />
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               )}

//               {/* peringkat #2 dan #3 */}
//               <div className="mt-4 grid gap-4 md:grid-cols-2">
//                 {runnersUp.map((r) => (
//                   <article
//                     key={r.product.id}
//                     data-testid={`result-card-${r.product.id}`}
//                     className="flex gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/40"
//                   >
//                     <div className="flex flex-col items-center gap-3">
//                       <span className="font-heading text-3xl font-bold text-zinc-400">
//                         #{r.rank}
//                       </span>
//                       <ScoreRing score={r.score} size={72} />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3
//                         className="truncate font-heading text-base font-bold"
//                         data-testid={`result-name-${r.product.id}`}
//                       >
//                         {r.product.name}
//                       </h3>
//                       <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
//                         {r.product.brand} · {formatRupiah(r.product.price)}
//                       </p>
//                       <div className="mt-3">
//                         <SpecChips product={r.product} />
//                       </div>
//                       <div className="mt-4 flex flex-wrap gap-2">
//                         <DetailButton product={r.product} />
//                         <ChooseButton product={r.product} />
//                       </div>
//                     </div>
//                   </article>
//                 ))}
//               </div>

//               {/* peringkat 4+ */}
//               {rest.length > 0 && (
//                 <div className="mt-4 overflow-hidden rounded-lg border border-border">
//                   {rest.map((r, i) => (
//                     <div
//                       key={r.product.id}
//                       data-testid={`result-row-${r.product.id}`}
//                       className={cn(
//                         "flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-accent",
//                         i > 0 && "border-t border-border",
//                       )}
//                     >
//                       <span className="font-heading text-xl font-bold text-zinc-500">
//                         #{r.rank}
//                       </span>
//                       <img
//                         src={r.product.image}
//                         alt=""
//                         className="h-12 w-16 rounded-sm object-cover"
//                       />
//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-semibold">
//                           {r.product.name}
//                         </p>
//                         <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
//                           {r.product.brand} · {formatRupiah(r.product.price)}
//                         </p>
//                       </div>
//                       <span className="font-mono text-sm font-bold text-brand">
//                         {r.score}%
//                       </span>
//                       <DetailButton product={r.product} />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           </FadeIn>
//         )}
//       </div>
//     </div>
//   );
// }
