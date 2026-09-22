import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";
import ProductCard from "@/components/ProductCard";
import { FEATURED_IDS, getProduct } from "@/data/products";

export default function FeaturedProducts() {
  const products = FEATURED_IDS.map((id) => getProduct(id)).filter((p) =>
    Boolean(p),
  );

  return (
    <section className="py-16 lg:py-24" data-testid="featured-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Produk Unggulan"
            title="Pilihan Terbaik Minggu Ini"
            sub="Kurasi perangkat dengan performa dan nilai jual terbaik — dipilih tim TechStore."
            action={
              <Link
                to="/produk"
                data-testid="featured-view-all"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "font-mono text-[11px] font-bold uppercase tracking-[0.15em]",
                })}
              >
                Lihat Semua Produk
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <FadeIn key={p!.id} delay={(i % 4) * 0.06}>
              <ProductCard product={p!} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
