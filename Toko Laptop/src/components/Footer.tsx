import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import {
  SiInstagram,
  SiTiktok,
  SiWhatsapp,
} from "@icons-pack/react-simple-icons";
import { CATEGORIES } from "@/data/products";
import { waLink, SHOP_NAME, SHOP_TAGLINE } from "@/lib/config";

const SOCIALS = [
  {
    label: "WhatsApp",
    href: waLink("Halo TechStore! Saya ingin bertanya tentang produk."),
    Icon: SiWhatsapp,
    testid: "footer-social-whatsapp",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/techstore",
    Icon: SiInstagram,
    testid: "footer-social-instagram",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@techstore",
    Icon: SiTiktok,
    testid: "footer-social-tiktok",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#060608]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
                <Zap className="h-4.5 w-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-heading text-lg font-bold uppercase tracking-wider">
                Tech<span className="text-brand">Store</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Toko komputer dan gaming premium dengan rekomendasi{" "}
              <span className="text-zinc-200">
                Sistem Pendukung Keputusan (SPK)
              </span>{" "}
              — bantu kamu menemukan perangkat yang paling tepat sesuai
              kebutuhan dan prioritas.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, Icon, testid }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  data-testid={testid}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-zinc-400 transition-all hover:border-brand/60 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Belanja
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/kategori/${c.slug}`}
                    className="text-zinc-400 transition-colors hover:text-brand"
                    data-testid={`footer-category-${c.slug}`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Rekomendasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/rekomendasi"
                  className="text-zinc-400 transition-colors hover:text-brand"
                  data-testid="footer-spk-start"
                >
                  Mulai Rekomendasi SPK
                </Link>
              </li>
              <li>
                <Link
                  to="/rekomendasi"
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  Laptop untuk Gaming
                </Link>
              </li>
              <li>
                <Link
                  to="/rekomendasi"
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  Laptop untuk Desain
                </Link>
              </li>
              <li>
                <Link
                  to="/rekomendasi"
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  Metode SAW
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Bantuan
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/keranjang"
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  Cara Pesan
                </Link>
              </li>
              <li>
                <Link
                  to="/promo"
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  Promo Berjalan
                </Link>
              </li>
              <li>
                <a
                  href={waLink("Halo TechStore! Saya butuh bantuan.")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 transition-colors hover:text-brand"
                >
                  Hubungi Kami via WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © 2026 {SHOP_NAME} — {SHOP_TAGLINE}. Semua hak dilindungi.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            Prototype UI · Sistem Pendukung Keputusan
          </p>
        </div>
      </div>
    </footer>
  );
}
