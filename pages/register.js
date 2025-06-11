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
import RegisterForm from "@/components/RegisterForm";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Register({ categories, modalNewProducts }) {
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
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList onMenuToggle={setIsMenuOpen} />
        <RegisterForm />

        <Footer />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [categories, allProducts] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
    ]);

    const last10Products = allProducts.slice(0, 10);

    const newProducts = allProducts.filter((p) => p.is_new).slice(-4);

    const modalNewProducts = allProducts.filter((p) => p.is_new).slice(-6);

    return {
      props: {
        categories,
        products: last10Products,
        newProducts,
        modalNewProducts,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data on server:", error);
    return {
      props: {
        categories: [],
        products: [],
        newProducts: [],
        modalNewProducts: [],
      },
    };
  }
}
