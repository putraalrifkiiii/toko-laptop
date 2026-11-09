import type { Product } from "@/data/products";
import { LAPTOPS } from "@/data/products";
import {
  alternativePriorities,
  checkConsistency,
  nearestSaatyKey,
  parseSaatyKey,
  priorityVector,
  saatyReciprocalKey,
  type AhpConsistency,
  type AhpMatrix,
} from "@/lib/ahp";

/* ---------------------------------------------------------------------------
 * Mesin SPK TechStore — metode AHP (Analytical Hierarchy Process).
 *
 * Alur:
 *   1. Kebutuhan pengguna (gaming/desain/programming/produktivitas) mengisi
 *      matriks perbandingan berpasangan antar kriteria awal.
 *   2. Pengguna dapat menyempurnakan perbandingan (skala Saaty 1-9 +
 *      kebalikannya, sifat reciprocal, diagonal 1).
 *   3. Bobot kriteria = normalisasi kolom → rata-rata baris (Σ = 1),
 *      diikuti uji konsistensi λmax/CI/CR.
 *   4. Prioritas alternatif per kriteria dihitung AHP dari matriks
 *      perbandingan antar laptop yang diturunkan data spesifikasi
 *      (benefit: v_i/v_j; cost/harga: v_j/v_i).
 *   5. Skor akhir alternatif = Σ (bobot kriteria × prioritas alternatif).
 * ------------------------------------------------------------------------- */

export type NeedKey = "gaming" | "desain" | "programming" | "produktivitas";

/** Bobot awal per kriteria (0-10) — hanya dipakai untuk mengisi matriks AHP awal */
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

/** Urutan kriteria — indeks matriks AHP mengikuti urutan ini */
export const CRITERIA_ORDER = [
  "harga",
  "processor",
  "ram",
  "storage",
  "gpu",
] as const;
export type CriterionKey = (typeof CRITERIA_ORDER)[number];

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

/** Matriks perbandingan berpasangan konsisten dari bobot preset (a_ij = w_i/w_j → CR = 0) */
export function matrixFromWeights(weights: SpkWeights): AhpMatrix {
  const vals = CRITERIA_ORDER.map((k) => Math.max(weights[k], 1e-4));
  return vals.map((vi) => vals.map((vj) => vi / vj));
}

/** Grid key Saaty (input pengguna, ukuran 5x5) → matriks angka (diagonal 1, sel j≠i via key) */
export function matrixFromSaatyGrid(grid: string[][]): AhpMatrix {
  return grid.map((row, i) =>
    row.map((cell, j) => (i === j ? 1 : parseSaatyKey(cell))),
  );
}

/** Grid key Saaty awal dari bobot preset — nilai di-snap ke skala Saaty terdekat */
export function saatyGridFromWeights(weights: SpkWeights): string[][] {
  const m = matrixFromWeights(weights);
  return m.map((row, i) =>
    row.map((v, j) => (i === j ? "1" : nearestSaatyKey(v))),
  );
}

/**
 * Mengubah satu perbandingan (i, j) sekaligus menjaga sifat reciprocal:
 * sel (j, i) otomatis diisi kebalikannya.
 */
export function applySaatyPair(
  grid: string[][],
  i: number,
  j: number,
  key: string,
): string[][] {
  const next = grid.map((row) => [...row]);
  next[i][j] = key;
  next[j][i] = saatyReciprocalKey(key);
  return next;
}

export interface AhpComputation {
  results: SpkResult[];
  /** Bobot kriteria hasil AHP (Σ = 1), urut sesuai CRITERIA_ORDER */
  weights: number[];
  consistency: AhpConsistency;
}

/** Nilai keterbandingan (criterion value) satu laptop untuk tiap kriteria */
function criteriaValues(p: Product): Record<CriterionKey, number> {
  const s = p.spk!;
  return {
    harga: p.price,
    processor: s.cpu,
    ram: ramScore(s.ramGb),
    storage: storageScore(s.storageGb),
    gpu: s.gpu,
  };
}

/**
 * Ranking alternatif dengan AHP penuh:
 *   bobot kriteria dari matriks perbandingan berpasangan (langkah 2-3)
 *   + prioritas alternatif per kriteria dari matriks antar-alternatif (langkah 4).
 */
export function computeAhpRecommendations(
  products: Product[],
  matrix: AhpMatrix,
): AhpComputation {
  const laptops = products.filter((p) => p.category === "laptop" && p.spk);
  const weights = priorityVector(matrix);
  const consistency = checkConsistency(matrix);
  if (laptops.length === 0) {
    return { results: [], weights, consistency };
  }

  // prioritas alternatif per kriteria (AHP dari matriks antar-alternatif)
  const distributive = CRITERIA_ORDER.map((criterion) => {
    const values = laptops.map((p) => criteriaValues(p)[criterion]);
    return alternativePriorities(values, criterion !== "harga");
  });

  // Sintesis IDEAL (ideal mode AHP): tiap vektor prioritas alternatif
  // dinormalisasi terhadap alternatif ideal per kriteria, sehingga skor
  // akhir berada pada rentang 0-100% (alternatif terbaik per kriteria = 1).
  const ideal = distributive.map((vec) => Math.max(...vec, 1e-12));
  const priorities = distributive.map((vec, k) => vec.map((v) => v / ideal[k]));

  const scored = laptops.map((product, idx) => ({
    product,
    score: Math.round(
      CRITERIA_ORDER.reduce(
        (sum, _c, k) => sum + weights[k] * priorities[k][idx],
        0,
      ) * 100,
    ),
    rank: 0,
  }));
  scored.sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  return {
    results: scored.map((r, k) => ({ ...r, rank: k + 1 })),
    weights,
    consistency,
  };
}

/** API kompatibilitas untuk pemanggil lama (pratinjau preset): bobot → matriks konsisten → AHP */
export function computeRecommendations(
  products: Product[],
  weights: SpkWeights,
): SpkResult[] {
  return computeAhpRecommendations(products, matrixFromWeights(weights))
    .results;
}
