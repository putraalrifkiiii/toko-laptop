import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PackageSearch, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  PRODUCTS,
  type CategorySlug,
} from "@/data/products";
import { cn } from "@/lib/utils";

type SortKey = "populer" | "harga-asc" | "harga-desc" | "rating";

const SORT_LABELS: Record<SortKey, string> = {
  populer: "Paling Populer",
  "harga-asc": "Harga Terendah",
  "harga-desc": "Harga Tertinggi",
  rating: "Rating Tertinggi",
};

const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[];

export default function Products({
  mode,
}: {
  mode: "all" | "category" | "promo";
}) {
  const { slug } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = (params.get("urut") as SortKey) || "populer";

  const categorySlug =
    mode === "category" ? (slug as CategorySlug | undefined) : undefined;
  const isValidCategory =
    mode === "all" || CATEGORIES.some((c) => c.slug === categorySlug);

  const title =
    mode === "promo"
      ? "Promo Spesial"
      : mode === "category" && isValidCategory
        ? CATEGORY_LABEL[categorySlug!]
        : "Semua Produk";

  const subtitle =
    mode === "promo"
      ? "Potongan harga berjalan untuk perangkat pilihan — stok terbatas."
      : q
        ? `Hasil pencarian untuk “${q}”`
        : "Jelajahi seluruh katalog perangkat premium TechStore.";

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (mode === "promo")
      list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
    if (mode === "category" && isValidCategory)
      list = list.filter((p) => p.category === categorySlug);
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          CATEGORY_LABEL[p.category].toLowerCase().includes(needle),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "harga-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "harga-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    }
    return sorted;
  }, [mode, categorySlug, isValidCategory, q, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div
      className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8"
      data-testid="products-page"
    >
      <FadeIn>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          {"// "}
          {mode === "promo" ? "Promo" : "Katalog"}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div
            className="relative w-full sm:w-72"
            data-testid="products-search-wrapper"
          >
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              data-testid="products-search-input"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Cari produk atau brand..."
              className="pl-9"
            />
          </div>

          <Select value={sort} onValueChange={(v) => setParam("urut", v)}>
            <SelectTrigger
              className="w-48"
              data-testid="products-sort-select"
              aria-label="Urutkan produk"
            >
              <SelectValue>{SORT_LABELS[sort]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {SORT_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span
            className="ml-auto font-mono text-xs text-zinc-500"
            data-testid="products-count"
          >
            {filtered.length} produk
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div
          className="mt-6 flex flex-wrap gap-2"
          data-testid="products-category-chips"
        >
          <Link
            to="/produk"
            className={cn(
              "rounded-sm border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors",
              mode === "all"
                ? "border-brand/60 bg-brand/10 text-brand"
                : "border-border text-zinc-400 hover:border-brand/50 hover:text-foreground",
            )}
          >
            Semua
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/kategori/${c.slug}`}
              data-testid={`products-chip-${c.slug}`}
              className={cn(
                "rounded-sm border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors",
                mode === "category" && c.slug === categorySlug
                  ? "border-brand/60 bg-brand/10 text-brand"
                  : "border-border text-zinc-400 hover:border-brand/50 hover:text-foreground",
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </FadeIn>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i, 8) * 0.04}>
              <ProductCard product={p} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div
          className="mt-16 flex flex-col items-center gap-4 rounded-lg border border-dashed border-border py-16 text-center"
          data-testid="products-empty-state"
        >
          <PackageSearch className="h-10 w-10 text-zinc-600" />
          <div>
            <p className="font-heading font-bold uppercase">
              Tidak ada produk yang cocok
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba kata kunci lain atau jelajahi semua kategori.
            </p>
          </div>
          <Link
            to="/produk"
            className="font-mono text-xs font-bold uppercase tracking-wider text-brand hover:underline"
            data-testid="products-empty-reset"
          >
            Reset pencarian
          </Link>
        </div>
      )}
    </div>
  );
}
