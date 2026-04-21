import { PromoBanner } from "./components/PromoBanner";
import Navbar from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Steps } from "./components/Steps";
import { ShowcaseCarousel } from "./components/ShowcaseCarousel";
import { DemoSection } from "./components/DemoSection";
import { Testimonials } from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <PromoBanner />
      <Navbar />
      <Hero />
      <Steps />
      <ShowcaseCarousel />
      <DemoSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
