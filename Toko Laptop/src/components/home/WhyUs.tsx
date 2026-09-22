import { BadgeCheck, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Produk Original",
    desc: "Produk berkualitas dan terpercaya.",
  },
  {
    icon: ShieldCheck,
    title: "Garansi Resmi",
    desc: "Perlindungan untuk produk pilihanmu.",
  },
  {
    icon: Sparkles,
    title: "Rekomendasi Cerdas",
    desc: "Temukan laptop berdasarkan kebutuhan dan prioritas.",
  },
  {
    icon: MessageCircle,
    title: "Konsultasi via WhatsApp",
    desc: "Hubungi kami dengan mudah sebelum membeli.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-16 lg:py-24" data-testid="why-us-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Kenapa TechStore?"
            title="Lebih Dari Sekadar Toko"
            sub="Kami membantu kamu memilih dengan benar — bukan sekadar menjual."
          />
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.07}>
              <div
                data-testid={`why-us-item-${i + 1}`}
                className="group h-full rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-brand/50 hover:shadow-glow-red"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-brand/30 bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-base font-bold uppercase tracking-wide">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
