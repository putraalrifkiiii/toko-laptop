import type { Product } from "@/data/products";

/* ---------------------------------------------------------------------------
 * Mesin SPK — metode Simple Additive Weighting (SAW).
 * Normalisasi: benefit = nilai / nilai-terbaik; cost = nilai-terbaik / nilai.
 * Skor akhir = Σ(bobot × nilai ternormalisasi) / Σ bobot × 100%.
 * ------------------------------------------------------------------------- */

export type NeedKey = "gaming" | "desain" | "programming" | "produktivitas";

export interface SpkWeights {
  harga: number;
  processor: number;
  ram: number;
  storage: number;
  gpu: number;
}

export interface NeedPreset {
  key: NeedKey;
  label: string;
  desc: string;
  weights: SpkWeights;
}

export interface SpkResult {
  product: Product;
  score: number;
  rank: number;
}

export const NEEDS: NeedPreset[] = [
  {
    key: "gaming",
    label: "Gaming",
    desc: "FPS tinggi, render game lancar",
    weights: { harga: 3, processor: 8, ram: 6, storage: 4, gpu: 10 },
  },
  {
    key: "desain",
    label: "Desain",
    desc: "Editing video, grafis & render",
    weights: { harga: 3, processor: 7, ram: 9, storage: 6, gpu: 8 },
  },
  {
    key: "programming",
    label: "Programming",
    desc: "Multitasking, container & compile cepat",
    weights: { harga: 5, processor: 8, ram: 8, storage: 7, gpu: 3 },
  },
  {
    key: "produktivitas",
    label: "Produktivitas",
    desc: "Kerja & kuliah sehari-hari",
    weights: { harga: 9, processor: 5, ram: 5, storage: 6, gpu: 2 },
  },
];

export const WEIGHT_LABELS: Record<keyof SpkWeights, string> = {
  harga: "Harga",
  processor: "Processor",
  ram: "RAM",
  storage: "Storage",
  gpu: "GPU",
};

export function ramScore(gb: number): number {
  if (gb >= 64) return 100;
  if (gb >= 32) return 92;
  if (gb >= 24) return 85;
  if (gb >= 16) return 75;
  if (gb >= 12) return 60;
  return 50;
}

export function storageScore(gb: number): number {
  if (gb >= 2048) return 100;
  if (gb >= 1024) return 80;
  if (gb >= 512) return 60;
  return 45;
}

function bestOf(values: number[]): number {
  return Math.max(...values, 1);
}

export function computeRecommendations(
  products: Product[],
  weights: SpkWeights,
): SpkResult[] {
  const laptops = products.filter((p) => p.category === "laptop" && p.spk);
  if (laptops.length === 0) return [];

  const bestCpu = bestOf(laptops.map((p) => p.spk!.cpu));
  const bestGpu = bestOf(laptops.map((p) => p.spk!.gpu));
  const bestRam = bestOf(laptops.map((p) => ramScore(p.spk!.ramGb)));
  const bestStorage = bestOf(
    laptops.map((p) => storageScore(p.spk!.storageGb)),
  );
  const minPrice = Math.min(...laptops.map((p) => p.price));

  const totalWeight =
    weights.harga +
    weights.processor +
    weights.ram +
    weights.storage +
    weights.gpu;

  const scored = laptops.map((product) => {
    const s = product.spk!;
    const nCpu = s.cpu / bestCpu;
    const nGpu = s.gpu / bestGpu;
    const nRam = ramScore(s.ramGb) / bestRam;
    const nStorage = storageScore(s.storageGb) / bestStorage;
    const nHarga = product.price > 0 ? minPrice / product.price : 0;

    const weighted =
      weights.harga * nHarga +
      weights.processor * nCpu +
      weights.ram * nRam +
      weights.storage * nStorage +
      weights.gpu * nGpu;

    const score =
      totalWeight > 0 ? Math.round((weighted / totalWeight) * 100) : 0;
    return { product, score, rank: 0 };
  });

  scored.sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  return scored.map((r, i) => ({ ...r, rank: i + 1 }));
}
