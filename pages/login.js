import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
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
import LoginForm from "@/components/LoginForm";

export default function Login() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
   

      <main>
        <Header />
        <NavList  />
        <LoginForm />
        <Footer />
      </main>
    </div>
  );
}
