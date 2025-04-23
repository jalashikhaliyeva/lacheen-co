import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState } from "react";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import Citate from "@/components/Citate";
import SliderEmbla from "@/components/EmblaCarouselAdvantage/EmblaCarousel";
import VideoSection from "@/components/VideoSection";
import VideoandImage from "@/components/VideoandImage";
import TrendingNow from "@/components/TrendingNow";
import Footer from "@/components/Footer";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-45 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "100px" }}
      />

      <main>
        <Header />
        <NavList onMenuToggle={setIsMenuOpen} />
        <Hero />
        <CategorySection />
        <Citate />
        <SliderEmbla />
        {/* <VideoSection /> */}
        <VideoandImage />
        <TrendingNow />
        <Footer />
      </main>
    </div>
  );
}
