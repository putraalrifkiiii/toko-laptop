import { Link } from "react-router-dom";
import { GitCompare, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { useCompare } from "@/context/CompareContext";
import { useSpk } from "@/context/SpkContext";
import { discountPercent, formatRupiah } from "@/lib/config";
import { STOCK_LABEL, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

const STOCK_STYLE: Record<Product["stock"], string> = {
  in: "text-emerald-400",
  low: "text-amber-400",
  out: "text-zinc-500",
};

export default function ProductCard({ product }: { product: Product }) {
  const { contains, toggle } = useCompare();
  const { pickOf } = useSpk();
  const pick = pickOf(product.id);
  const discount = discountPercent(product.price, product.oldPrice);
  const comparing = contains(product.id);

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-brand/50 hover:shadow-glow-red",
      )}
    >
      <Link
        to={`/produk/${product.id}`}
        data-testid={`product-image-link-${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#0a0a0d]"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span
              data-testid={`product-discount-badge-${product.id}`}
              className="rounded-sm bg-brand px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-white shadow-glow-red"
            >
              -{discount}%
            </span>
          )}
          {pick && (
            <span
              data-testid={`product-spk-badge-${product.id}`}
              className="flex items-center gap-1 rounded-sm border border-brand/60 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand backdrop-blur-sm"
            >
              <Trophy className="h-3 w-3" /> SPK #{pick.rank}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {product.brand}
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider",
              STOCK_STYLE[product.stock],
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-current",
                product.stock === "out" && "bg-zinc-600",
              )}
            />
            {STOCK_LABEL[product.stock]}
          </span>
        </div>

        <Link
          to={`/produk/${product.id}`}
          className="outline-none"
          data-testid={`product-name-link-${product.id}`}
        >
          <h3 className="font-heading text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <StarRating value={product.rating} />
          <div className="mt-2 flex items-baseline gap-2">
            <span
              data-testid={`product-price-${product.id}`}
              className="font-heading text-lg font-bold text-foreground"
            >
              {formatRupiah(product.price)}
            </span>
            {product.oldPrice && (
              <span className="font-mono text-xs text-zinc-500 line-through">
                {formatRupiah(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            to={`/produk/${product.id}`}
            data-testid={`product-detail-link-${product.id}`}
            className={buttonVariants({
              variant: "default",
              className:
                "h-8 flex-1 font-mono text-[11px] font-bold uppercase tracking-wider",
            })}
          >
            Lihat Detail
          </Link>
          <button
            data-testid={`product-compare-button-${product.id}`}
            onClick={() => toggle(product.id)}
            aria-label={`Bandingkan ${product.name}`}
            title={comparing ? "Hapus dari perbandingan" : "Bandingkan"}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
                className: "h-8 w-8",
              }),
              comparing && "border-brand/60 text-brand",
            )}
          >
            <GitCompare className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
