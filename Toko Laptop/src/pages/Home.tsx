import Hero from "@/components/home/Hero";
import BrandStrip from "@/components/home/BrandStrip";
import SpkFeature from "@/components/home/SpkFeature";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import WhyUs from "@/components/home/WhyUs";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <SpkFeature />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <WhyUs />
    </>
  );
}
