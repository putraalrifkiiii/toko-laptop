import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NeedKey } from "@/lib/spk";

export interface SpkPick {
  id: string;
  rank: number;
  score: number;
}

interface SpkContextValue {
  need: NeedKey | null;
  picks: SpkPick[] | null;
  save: (need: NeedKey, picks: SpkPick[]) => void;
  clear: () => void;
  /** Kembalikan hasil SPK untuk satu produk (jika termasuk rekomendasi terakhir) */
  pickOf: (id: string) => SpkPick | undefined;
}

const SpkContext = createContext<SpkContextValue | null>(null);
const STORAGE_KEY = "techstore.spk.v1";

interface StoredSpk {
  need: NeedKey;
  picks: SpkPick[];
}

function load(): StoredSpk | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSpk;
    if (!parsed || !Array.isArray(parsed.picks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function SpkProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredSpk | null>(load);

  const save = useCallback((need: NeedKey, picks: SpkPick[]) => {
    const next = { need, picks };
    setState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* abaikan */
    }
  }, []);

  const clear = useCallback(() => {
    setState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* abaikan */
    }
  }, []);

  const value = useMemo<SpkContextValue>(
    () => ({
      need: state?.need ?? null,
      picks: state?.picks ?? null,
      save,
      clear,
      pickOf: (id: string) => state?.picks.find((p) => p.id === id),
    }),
    [state, save, clear],
  );

  return <SpkContext.Provider value={value}>{children}</SpkContext.Provider>;
}

export function useSpk(): SpkContextValue {
  const ctx = useContext(SpkContext);
  if (!ctx) throw new Error("useSpk harus dipakai di dalam SpkProvider");
  return ctx;
}
