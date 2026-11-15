import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Download } from "@/components/sections/download";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { RestaurantsMarquee } from "@/components/sections/marquee";
import { Tracking } from "@/components/sections/tracking";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: site.name,
  operatingSystem: "Android",
  applicationCategory: "FoodApplication",
  description: site.description,
  url: site.url,
  offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  areaServed: { "@type": "City", name: "Lagos" },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <RestaurantsMarquee />
        <Tracking />
        <Download />
      </main>
      <Footer />
    </>
  );
}
