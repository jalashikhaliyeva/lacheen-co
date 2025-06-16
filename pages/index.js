// pages/index.js
import { useState } from "react";
import Header from "@/components/Header";
import NavList from "@/components/NavList";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import Citate from "@/components/Citate";
import SliderEmbla from "@/components/EmblaCarouselAdvantage/EmblaCarousel";
import VideoandImage from "@/components/VideoandImage";
import TrendingNow from "@/components/TrendingNow";
import Footer from "@/components/Footer";
import { useAuthClient } from "@/shared/context/AuthContext";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Home({
  categories,
  products,
  newProducts,       
  modalNewProducts,  
}) {
  const { user } = useAuthClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories}  />
        <NavList onMenuToggle={setIsMenuOpen} />
        <Hero />
        <CategorySection categories={categories} />
        <Citate />
        <SliderEmbla products={products} />
        <VideoandImage />
        <TrendingNow products={newProducts} />
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
