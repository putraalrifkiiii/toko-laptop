import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FadeIn from "@/components/FadeIn";
import { useCart, type CartLine } from "@/context/CartContext";
import { formatRupiah, waLink } from "@/lib/config";

interface CheckoutForm {
  name: string;
  whatsapp: string;
  address: string;
  notes: string;
}

interface OrderSnapshot {
  lines: CartLine[];
  total: number;
  waHref: string;
}

function buildOrderMessage(
  form: CheckoutForm,
  lines: CartLine[],
  total: number,
): string {
  const items = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.product.name}\n   ${l.qty} x ${formatRupiah(l.product.price)} = ${formatRupiah(l.qty * l.product.price)}`,
    )
    .join("\n");
  return [
    "Halo TechStore! Saya ingin memesan:",
    "",
    items,
    "",
    `Total: ${formatRupiah(total)}`,
    "",
    `Nama: ${form.name}`,
    `No. WhatsApp: ${form.whatsapp}`,
    `Alamat: ${form.address}`,
    form.notes.trim() ? `Catatan: ${form.notes.trim()}` : null,
    "",
    "Mohon konfirmasi ketersediaan dan ongkos kirimnya. Terima kasih!",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    whatsapp: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutForm, string>>
  >({});
  const [order, setOrder] = useState<OrderSnapshot | null>(null);

  const set =
    (key: keyof CheckoutForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi";
    const waDigits = form.whatsapp.replace(/\D/g, "");
    if (!waDigits) next.whatsapp = "Nomor WhatsApp wajib diisi";
    else if (waDigits.length < 8) next.whatsapp = "Nomor WhatsApp tidak valid";
    if (!form.address.trim()) next.address = "Alamat pengiriman wajib diisi";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const href = waLink(buildOrderMessage(form, lines, subtotal));
    setOrder({ lines, total: subtotal, waHref: href });
    window.open(href, "_blank", "noopener");
    clear();
  };

  if (order) {
    return (
      <div
        className="mx-auto max-w-2xl px-4 pt-28 pb-20 sm:px-6"
        data-testid="checkout-success"
      >
        <div className="rounded-xl border border-brand/40 bg-card p-10 text-center shadow-glow-red">
          <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
          <h1 className="mt-5 font-heading text-2xl font-bold uppercase tracking-tight">
            Pesanan Dikirim ke WhatsApp
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Detail pesanan sebesar{" "}
            <span className="font-mono font-bold text-zinc-200">
              {formatRupiah(order.total)}
            </span>{" "}
            telah dibuka di WhatsApp. Tim kami akan segera menghubungimu untuk
            konfirmasi dan ongkos kirim.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={order.waHref}
              target="_blank"
              rel="noreferrer"
              data-testid="checkout-success-resend"
              className={buttonVariants({
                className:
                  "font-mono text-xs font-bold uppercase tracking-wider",
              })}
            >
              <SiWhatsapp className="h-4 w-4" />
              Kirim Ulang Pesan
            </a>
            <Link
              to="/"
              data-testid="checkout-success-home"
              className={buttonVariants({
                variant: "outline",
                className:
                  "font-mono text-xs font-bold uppercase tracking-wider",
              })}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8"
        data-testid="checkout-empty"
      >
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border py-24 text-center">
          <MessageCircle className="h-10 w-10 text-zinc-600" />
          <div>
            <p className="font-heading text-xl font-bold uppercase">
              Tidak ada yang bisa di-checkout
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan produk ke keranjang terlebih dahulu.
            </p>
          </div>
          <Link
            to="/produk"
            data-testid="checkout-empty-cta"
            className={buttonVariants({
              className: "font-mono text-xs font-bold uppercase tracking-wider",
            })}
          >
            Jelajahi Produk
          </Link>
        </div>
      </div>
    );
  }

  const fieldClass = (key: keyof CheckoutForm) =>
    errors[key] ? "border-brand/70 focus-visible:ring-brand/40" : undefined;

  return (
    <div
      className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8"
      data-testid="checkout-page"
    >
      <FadeIn>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          {"// "}Checkout Sederhana
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Selesaikan Pesanan
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Isi data berikut — detail pesanan akan dikirim melalui WhatsApp, tanpa
          pembayaran online.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <FadeIn delay={0.05}>
          <form
            onSubmit={submit}
            className="rounded-lg border border-border bg-card p-6 sm:p-8"
            data-testid="checkout-form"
          >
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="checkout-name">Nama</Label>
                <Input
                  id="checkout-name"
                  data-testid="checkout-field-name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Nama lengkap kamu"
                  className={fieldClass("name")}
                />
                {errors.name && (
                  <p
                    className="text-xs text-brand"
                    data-testid="checkout-error-name"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="checkout-whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="checkout-whatsapp"
                  data-testid="checkout-field-whatsapp"
                  value={form.whatsapp}
                  onChange={set("whatsapp")}
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                  className={fieldClass("whatsapp")}
                />
                {errors.whatsapp && (
                  <p
                    className="text-xs text-brand"
                    data-testid="checkout-error-whatsapp"
                  >
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="checkout-address">Alamat</Label>
                <Textarea
                  id="checkout-address"
                  data-testid="checkout-field-address"
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Alamat lengkap pengiriman (jalan, kota, kode pos)"
                  rows={3}
                  className={fieldClass("address")}
                />
                {errors.address && (
                  <p
                    className="text-xs text-brand"
                    data-testid="checkout-error-address"
                  >
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="checkout-notes">
                  Catatan <span className="text-zinc-500">(opsional)</span>
                </Label>
                <Textarea
                  id="checkout-notes"
                  data-testid="checkout-field-notes"
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Contoh: tolong kemas bubble wrap ekstra"
                  rows={2}
                />
              </div>
            </div>
          </form>
        </FadeIn>

        <FadeIn delay={0.1}>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="rounded-lg border border-border bg-card p-6"
              data-testid="checkout-summary"
            >
              <h2 className="font-heading text-base font-bold uppercase tracking-wide">
                Ringkasan Pesanan
              </h2>
              <ul className="mt-5 space-y-4">
                {lines.map(({ product, qty }) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3"
                    data-testid={`checkout-item-${product.id}`}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="h-12 w-14 rounded-sm border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-zinc-200">
                        {product.name}
                      </p>
                      <p className="font-mono text-[10px] text-zinc-500">
                        {qty} x {formatRupiah(product.price)}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-300">
                      {formatRupiah(product.price * qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
                <span className="font-heading text-sm font-bold uppercase tracking-wide">
                  Total
                </span>
                <span
                  className="font-heading text-2xl font-bold text-brand"
                  data-testid="checkout-total"
                >
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={submit}
                data-testid="checkout-submit-button"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "mt-6 w-full font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
                })}
              >
                <SiWhatsapp className="h-4 w-4" />
                Pesan via WhatsApp
              </button>
              <p
                className="mt-4 text-center text-[11px] leading-relaxed text-zinc-500"
                data-testid="checkout-whatsapp-note"
              >
                Setelah menekan tombol, detail pesanan akan dikirim melalui
                WhatsApp untuk proses selanjutnya.
              </p>
            </div>
          </aside>
        </FadeIn>
      </div>
    </div>
  );
}
