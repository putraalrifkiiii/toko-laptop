/* ---------------------------------------------------------------------------
 * AHP — Analytical Hierarchy Process (Thomas L. Saaty).
 *
 * Implementasi murni (tanpa dependency) untuk mesin SPK TechStore:
 *   1. Matriks perbandingan berpasangan (skala Saaty 1-9 + kebalikannya,
 *      sifat reciprocal, diagonal = 1).
 *   2. Bobot prioritas: normalisasi kolom → rata-rata baris (Σ bobot = 1).
 *   3. Uji konsistensi: λmax → CI → CR dengan Random Index standar.
 *   4. Prioritas alternatif per kriteria: matriks perbandingan berpasangan
 *      antar alternatif yang diturunkan dari data spesifikasi (rasio nilai).
 * ------------------------------------------------------------------------- */

/** Matriks AHP persegi — A[i][j] = kepentingan elemen i relatif terhadap elemen j */
export type AhpMatrix = number[][];

/** Random Index (RI) standar Saaty berdasarkan ukuran matriks n */
export const RANDOM_INDEX: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

/** Skala Saaty 1-9 beserta kebalikannya (key string agar aman dari floating point) */
export const SAATY_SCALE: { key: string; num: number; label: string }[] = [
  { key: "9", num: 9, label: "9 — Ekstrem lebih penting" },
  { key: "8", num: 8, label: "8 — Di antara 7 dan 9" },
  { key: "7", num: 7, label: "7 — Sangat lebih penting" },
  { key: "6", num: 6, label: "6 — Di antara 5 dan 7" },
  { key: "5", num: 5, label: "5 — Lebih penting (kuat)" },
  { key: "4", num: 4, label: "4 — Di antara 3 dan 5" },
  { key: "3", num: 3, label: "3 — Lebih penting" },
  { key: "2", num: 2, label: "2 — Sedikit lebih penting" },
  { key: "1", num: 1, label: "1 — Sama penting" },
  { key: "1/2", num: 0.5, label: "1/2 — Sedikit kurang penting" },
  { key: "1/3", num: 1 / 3, label: "1/3 — Kurang penting" },
  { key: "1/5", num: 0.2, label: "1/5 — Kurang penting (kuat)" },
  { key: "1/7", num: 1 / 7, label: "1/7 — Sangat kurang penting" },
  { key: "1/9", num: 1 / 9, label: "1/9 — Ekstrem kurang penting" },
];

/** "1/3" → 0.333…, "7" → 7 */
export function parseSaatyKey(key: string): number {
  if (key.includes("/")) {
    const [num, den] = key.split("/").map(Number);
    return num / den;
  }
  return Number(key);
}

/** Kebalikan key Saaty: "3" → "1/3", "1/3" → "3", "1" → "1" */
export function saatyReciprocalKey(key: string): string {
  if (key === "1") return "1";
  if (key.includes("/")) return key.split("/")[1];
  return `1/${key}`;
}

/** Key Saaty terdekat untuk sebuah nilai (jarak logaritmik agar 1/3 dan 3 setara) */
export function nearestSaatyKey(value: number): string {
  let best = SAATY_SCALE[0];
  let bestDist = Infinity;
  for (const s of SAATY_SCALE) {
    const dist = Math.abs(Math.log(value) - Math.log(s.num));
    if (dist < bestDist) {
      bestDist = dist;
      best = s;
    }
  }
  return best.key;
}

/** Matriks awal: seluruh sel bernilai 1 (semua kriteria sama penting, diagonal 1) */
export function unitMatrix(n: number): AhpMatrix {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => 1));
}

/** Normalisasi kolom: setiap sel dibagi jumlah kolomnya */
export function normalizeColumns(matrix: AhpMatrix): AhpMatrix {
  const n = matrix.length;
  const colSum = Array.from({ length: n }, (_, j) =>
    matrix.reduce((sum, row) => sum + (row[j] ?? 0), 0),
  );
  return matrix.map((row) =>
    row.map((v, j) => (colSum[j] > 0 ? v / colSum[j] : 0)),
  );
}

/**
 * Bobot prioritas = rata-rata baris dari matriks yang sudah dinormalisasi kolom.
 * Jumlah seluruh bobot = 1.
 */
export function priorityVector(matrix: AhpMatrix): number[] {
  const normalized = normalizeColumns(matrix);
  const n = matrix.length;
  return normalized.map((row) => row.reduce((s, v) => s + v, 0) / n);
}

/** λmax = rata-rata dari (A · w)_i / w_i */
export function lambdaMax(matrix: AhpMatrix, weights: number[]): number {
  const n = matrix.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const aw = matrix[i].reduce((s, v, j) => s + v * weights[j], 0);
    sum += weights[i] > 0 ? aw / weights[i] : 0;
  }
  return sum / n;
}

export interface AhpConsistency {
  n: number;
  lambdaMax: number;
  ci: number;
  ri: number;
  cr: number;
  /** true jika CR ≤ 0,1 (matriks 1x1/2x2 selalu konsisten) */
  consistent: boolean;
  /** true bila n > 10 sehingga RI standar tidak tersedia */
  riUnavailable: boolean;
}

/**
 * Uji konsistensi: CI = (λmax − n) / (n − 1), CR = CI / RI.
 * Matriks berukuran < 3 selalu konsisten. Untuk n > 10 (tanpa RI standar)
 * CR tidak dapat dihitung — konsistensi diestimasi dari CI.
 */
export function checkConsistency(matrix: AhpMatrix): AhpConsistency {
  const n = matrix.length;
  if (n < 3) {
    return {
      n,
      lambdaMax: n,
      ci: 0,
      ri: 0,
      cr: 0,
      consistent: true,
      riUnavailable: false,
    };
  }
  const weights = priorityVector(matrix);
  const lm = lambdaMax(matrix, weights);
  const ci = (lm - n) / (n - 1);
  const ri = RANDOM_INDEX[n];
  if (ri === undefined) {
    return {
      n,
      lambdaMax: lm,
      ci,
      ri: 0,
      cr: 0,
      consistent: ci <= 0.1,
      riUnavailable: true,
    };
  }
  const cr = ci / ri;
  return {
    n,
    lambdaMax: lm,
    ci,
    ri,
    cr,
    consistent: cr <= 0.1,
    riUnavailable: false,
  };
}

/**
 * Matriks perbandingan berpasangan antar ALTERNATIF untuk satu kriteria,
 * diturunkan dari data: a_ij = v_i / v_j (benefit) atau v_j / v_i (cost).
 * Sifat reciprocal terjaga dan a_ij · a_jk = a_ik (konsisten sempurna, CR = 0).
 */
export function ratioMatrix(
  values: number[],
  higherIsBetter: boolean,
): AhpMatrix {
  const safe = values.map((v) => (v > 0 ? v : 1e-9));
  return safe.map((vi, i) =>
    safe.map((vj, j) => {
      if (i === j) return 1;
      return higherIsBetter ? vi / vj : vj / vi;
    }),
  );
}

/** Prioritas alternatif untuk satu kriteria (hasil AHP, Σ = 1) */
export function alternativePriorities(
  values: number[],
  higherIsBetter: boolean,
): number[] {
  return priorityVector(ratioMatrix(values, higherIsBetter));
}
