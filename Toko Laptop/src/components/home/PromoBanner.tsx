import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import { PROMO_IMG } from "@/data/products";

export default function PromoBanner() {
  return (
    <section className="py-8 lg:py-12" data-testid="promo-banner-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-xl border border-border">
            <img
              src={PROMO_IMG}
              alt="Setup gaming dengan pencahayaan merah"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
            <div className="relative flex min-h-[340px] flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
                {"// "}Promo Spesial
              </p>
              <h2 className="mt-4 max-w-xl font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Upgrade Setup <span className="text-brand">Gaming-mu</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Temukan perangkat yang sesuai dengan kebutuhan dan budgetmu.
              </p>
              <div className="mt-8">
                <Link
                  to="/promo"
                  data-testid="promo-banner-button"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-glow-red",
                  })}
                >
                  Lihat Produk
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
