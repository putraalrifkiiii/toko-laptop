import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import { useCart } from "@/context/CartContext";
import { STOCK_LABEL } from "@/data/products";
import { formatRupiah } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function Cart() {
  const { lines, subtotal, count, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8"
        data-testid="cart-page-empty"
      >
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border py-24 text-center">
          <ShoppingCart className="h-10 w-10 text-zinc-600" />
          <div>
            <p className="font-heading text-xl font-bold uppercase">
              Keranjangmu masih kosong
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Mulai dari rekomendasi SPK atau jelajahi katalog produk kami.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/rekomendasi"
              data-testid="cart-empty-cta-rekomendasi"
              className={buttonVariants({
                className:
                  "font-mono text-xs font-bold uppercase tracking-wider",
              })}
            >
              Coba Rekomendasi SPK
            </Link>
            <Link
              to="/produk"
              data-testid="cart-empty-cta-produk"
              className={buttonVariants({
                variant: "outline",
                className:
                  "font-mono text-xs font-bold uppercase tracking-wider",
              })}
            >
              Jelajahi Produk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8"
      data-testid="cart-page"
    >
      <FadeIn>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          {"// "}Keranjang
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Keranjang Belanja
        </h1>
        <p
          className="mt-2 font-mono text-xs uppercase tracking-wider text-zinc-500"
          data-testid="cart-count-label"
        >
          {count} barang
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3" data-testid="cart-items">
          {lines.map(({ product, qty }) => (
            <div
              key={product.id}
              data-testid={`cart-item-${product.id}`}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <Link to={`/produk/${product.id}`} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-24 rounded-md border border-border object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {product.brand}
                </p>
                <Link
                  to={`/produk/${product.id}`}
                  className="block truncate font-heading text-sm font-bold hover:text-brand"
                  data-testid={`cart-item-name-${product.id}`}
                >
                  {product.name}
                </Link>
                <p className="mt-1 font-mono text-xs text-zinc-400">
                  {formatRupiah(product.price)}
                </p>
                <p
                  className={cn(
                    "mt-1 font-mono text-[10px] uppercase tracking-wider",
                    product.stock === "out"
                      ? "text-zinc-500"
                      : product.stock === "low"
                        ? "text-amber-400"
                        : "text-emerald-400",
                  )}
                >
                  {STOCK_LABEL[product.stock]}
                </p>
              </div>

              <div
                className="flex items-center rounded-md border border-border"
                data-testid={`cart-qty-stepper-${product.id}`}
              >
                <button
                  onClick={() => setQty(product.id, qty - 1)}
                  data-testid={`cart-qty-minus-${product.id}`}
                  aria-label="Kurangi jumlah"
                  className="flex h-9 w-9 items-center justify-center text-zinc-400 hover:text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-9 text-center font-mono text-sm font-bold">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(product.id, qty + 1)}
                  data-testid={`cart-qty-plus-${product.id}`}
                  aria-label="Tambah jumlah"
                  className="flex h-9 w-9 items-center justify-center text-zinc-400 hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <p
                className="w-28 text-right font-heading text-sm font-bold"
                data-testid={`cart-item-subtotal-${product.id}`}
              >
                {formatRupiah(product.price * qty)}
              </p>

              <button
                onClick={() => remove(product.id)}
                data-testid={`cart-item-remove-${product.id}`}
                aria-label={`Hapus ${product.name} dari keranjang`}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-zinc-500 transition-colors hover:border-brand/60 hover:text-brand"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="rounded-lg border border-border bg-card p-6"
            data-testid="cart-summary"
          >
            <h2 className="font-heading text-base font-bold uppercase tracking-wide">
              Ringkasan
            </h2>
            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span
                  className="font-mono text-zinc-200"
                  data-testid="cart-subtotal"
                >
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Ongkos kirim</span>
                <span className="font-mono text-xs text-zinc-500">
                  Dihitung via WhatsApp
                </span>
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
              <span className="font-heading text-sm font-bold uppercase tracking-wide">
                Total Belanja
              </span>
              <span
                className="font-heading text-2xl font-bold text-brand"
                data-testid="cart-total"
              >
                {formatRupiah(subtotal)}
              </span>
            </div>
            <Link
              to="/checkout"
              data-testid="cart-checkout-button"
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-6 w-full font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
              })}
            >
              Lanjut Checkout
            </Link>
            <Link
              to="/produk"
              className="mt-3 block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-brand"
              data-testid="cart-continue-shopping"
            >
              + Lanjut belanja
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
