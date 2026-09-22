import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  Minus,
  Monitor,
  Plus,
  ShoppingCart,
  Trophy,
} from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { useCart } from "@/context/CartContext";
import { useSpk } from "@/context/SpkContext";
import { toast } from "sonner";
import {
  CATEGORY_LABEL,
  getProduct,
  PRODUCTS,
  STOCK_LABEL,
  type Product,
} from "@/data/products";
import { discountPercent, formatRupiah, waLink } from "@/lib/config";
import { cn } from "@/lib/utils";

const SPEC_ICONS = [
  { label: "Processor", Icon: Cpu },
  { label: "GPU", Icon: CircuitBoard },
  { label: "RAM", Icon: MemoryStick },
  { label: "Storage", Icon: HardDrive },
  { label: "Layar", Icon: Monitor },
];

const STOCK_STYLE: Record<Product["stock"], string> = {
  in: "text-emerald-400",
  low: "text-amber-400",
  out: "text-zinc-500",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProduct(id) : undefined;
  const navigate = useNavigate();
  const { add } = useCart();
  const { pickOf, need } = useSpk();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-32 text-center">
        <p className="font-heading text-2xl font-bold uppercase">
          Produk tidak ditemukan
        </p>
        <p className="text-sm text-muted-foreground">
          Produk yang kamu cari tidak tersedia di katalog.
        </p>
        <Link
          to="/produk"
          data-testid="detail-notfound-back"
          className={buttonVariants({
            variant: "outline",
            className: "mt-2 font-mono text-xs uppercase tracking-wider",
          })}
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const pick = pickOf(product.id);
  const discount = discountPercent(product.price, product.oldPrice);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);
  const soldOut = product.stock === "out";

  const addToCart = () => {
    add(product.id, qty);
    toast.success(`${product.name} ditambahkan ke keranjang`, {
      description: `${qty} x ${formatRupiah(product.price)}`,
      action: {
        label: "Lihat Keranjang",
        onClick: () => navigate("/keranjang"),
      },
    });
  };

  const detailWa = waLink(
    `Halo TechStore! Saya tertarik dengan ${product.name} (${formatRupiah(product.price)}). Apakah stoknya masih tersedia?`,
  );

  return (
    <div
      className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8"
      data-testid="product-detail-page"
    >
      {/* breadcrumb */}
      <nav
        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        data-testid="detail-breadcrumb"
      >
        <Link to="/" className="hover:text-brand">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/kategori/${product.category}`} className="hover:text-brand">
          {CATEGORY_LABEL[product.category]}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-zinc-300">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* galeri */}
        <FadeIn>
          <div>
            <div
              className="relative overflow-hidden rounded-xl border border-border bg-[#0a0a0d]"
              data-testid="detail-gallery-main"
            >
              <img
                src={product.gallery[activeImage] ?? product.image}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
              />
              {discount > 0 && (
                <span
                  className="absolute top-4 left-4 rounded-sm bg-brand px-2 py-1 font-mono text-xs font-bold text-white shadow-glow-red"
                  data-testid="detail-discount-badge"
                >
                  -{discount}%
                </span>
              )}
            </div>
            <div
              className="mt-3 flex gap-3"
              data-testid="detail-gallery-thumbs"
            >
              {product.gallery.map((src, i) => (
                <button
                  key={src + i}
                  data-testid={`detail-thumb-${i}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Lihat foto ${i + 1}`}
                  className={cn(
                    "overflow-hidden rounded-md border transition-all",
                    i === activeImage
                      ? "border-brand shadow-glow-red"
                      : "border-border opacity-60 hover:opacity-100",
                  )}
                >
                  <img src={src} alt="" className="h-16 w-20 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* info */}
        <FadeIn delay={0.08}>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
                {product.brand}
              </span>
              {pick && (
                <span
                  data-testid="detail-spk-badge"
                  className="flex items-center gap-1.5 rounded-sm border border-brand/50 bg-brand/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand"
                >
                  <Trophy className="h-3 w-3" />
                  Rekomendasi SPK #{pick.rank} · Skor {pick.score}%
                </span>
              )}
            </div>

            <h1
              className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              data-testid="detail-name"
            >
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <StarRating value={product.rating} />
              <span
                className="text-xs text-muted-foreground"
                data-testid="detail-reviews"
              >
                {product.reviews} ulasan
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider",
                  STOCK_STYLE[product.stock],
                )}
                data-testid="detail-stock"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {STOCK_LABEL[product.stock]}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-border py-5">
              <span
                className="font-heading text-4xl font-bold text-foreground"
                data-testid="detail-price"
              >
                {formatRupiah(product.price)}
              </span>
              {product.oldPrice && (
                <span className="font-mono text-sm text-zinc-500 line-through">
                  {formatRupiah(product.oldPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="font-mono text-xs font-bold text-brand">
                  Hemat {formatRupiah(product.oldPrice! - product.price)}
                </span>
              )}
            </div>

            {pick && (
              <p
                className="mt-4 rounded-md border border-brand/25 bg-brand/5 px-4 py-3 text-xs leading-relaxed text-zinc-300"
                data-testid="detail-spk-note"
              >
                Laptop ini termasuk{" "}
                <span className="font-semibold text-brand">
                  hasil rekomendasi SPK
                </span>
                {need ? ` untuk kebutuhan ${need}` : ""} berdasarkan kriteria
                dan prioritas yang kamu pilih.{" "}
                <Link
                  to="/rekomendasi"
                  className="underline underline-offset-2 hover:text-brand"
                >
                  Lihat peringkat lengkap
                </Link>
              </p>
            )}

            {/* spesifikasi ringkas */}
            <div
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
              data-testid="detail-quick-specs"
            >
              {SPEC_ICONS.map(({ label, Icon }) => {
                const value = product.specs.find(
                  (s) => s.label === label,
                )?.value;
                if (!value) return null;
                return (
                  <div
                    key={label}
                    className="rounded-md border border-border bg-card p-3"
                  >
                    <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      <Icon className="h-3 w-3 text-brand" />
                      {label}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-zinc-200">
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div
              className="mt-8 flex flex-wrap items-center gap-3"
              data-testid="detail-cta-row"
            >
              <div
                className="flex items-center rounded-md border border-border"
                data-testid="detail-qty-stepper"
              >
                <button
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                  data-testid="detail-qty-minus"
                  aria-label="Kurangi jumlah"
                  className="flex h-11 w-10 items-center justify-center text-zinc-400 hover:text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  className="w-10 text-center font-mono text-sm font-bold"
                  data-testid="detail-qty-value"
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((n) => Math.min(99, n + 1))}
                  data-testid="detail-qty-plus"
                  aria-label="Tambah jumlah"
                  className="flex h-11 w-10 items-center justify-center text-zinc-400 hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={soldOut}
                data-testid="detail-add-to-cart"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "flex-1 font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red sm:flex-none",
                })}
              >
                <ShoppingCart className="h-4 w-4" />
                {soldOut ? "Stok Habis" : "Tambah ke Keranjang"}
              </button>
              <a
                href={detailWa}
                target="_blank"
                rel="noreferrer"
                data-testid="detail-buy-whatsapp"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "flex-1 font-mono text-xs font-bold uppercase tracking-[0.15em] sm:flex-none",
                })}
              >
                <SiWhatsapp className="h-4 w-4" />
                Beli via WhatsApp
              </a>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* deskripsi & spesifikasi */}
      <FadeIn delay={0.1}>
        <div className="mt-14">
          <Tabs defaultValue="deskripsi">
            <TabsList data-testid="detail-tabs">
              <TabsTrigger value="deskripsi">Deskripsi</TabsTrigger>
              <TabsTrigger value="spesifikasi">Spesifikasi Lengkap</TabsTrigger>
            </TabsList>
            <TabsContent
              value="deskripsi"
              className="mt-6 max-w-3xl"
              data-testid="detail-description"
            >
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                {product.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] tracking-wide text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TabsContent>
            <TabsContent
              value="spesifikasi"
              className="mt-6"
              data-testid="detail-full-specs"
            >
              <div className="max-w-2xl overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Komponen</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.specs.map((s) => (
                      <TableRow key={s.label}>
                        <TableCell className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                          {s.label}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-200 sm:text-sm">
                          {s.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </FadeIn>

      {/* produk serupa */}
      {related.length > 0 && (
        <div className="mt-16" data-testid="detail-related">
          <h2 className="font-heading text-xl font-bold uppercase tracking-tight">
            Produk Serupa
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
