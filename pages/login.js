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
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Login({ categories, modalNewProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
   

      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList  />
        <LoginForm />
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
