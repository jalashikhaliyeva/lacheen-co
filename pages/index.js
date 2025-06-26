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
import { fetchSectionData } from "@/firebase/services/settingsService";

export default function Home({
  categories,
  products,
  newProducts,
  modalNewProducts,
  heroSettings,
  categoriesSettings,
  attitudeSettings,
}) {
  const { user } = useAuthClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList onMenuToggle={setIsMenuOpen} />
        <Hero heroSettings={heroSettings} />
        <CategorySection
          categories={categories}
          categoriesSettings={categoriesSettings}
        />
        <Citate />
        <SliderEmbla products={products} />
        <VideoandImage attitudeSettings={attitudeSettings} />
        <TrendingNow products={newProducts} />
        <Footer />
      </main>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  try {
    const [
      categories,
      allProducts,
      heroSettings,
      categoriesSettings,
      attitudeSettings,
    ] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
      fetchSectionData("hero"),
      fetchSectionData("categories"),
      fetchSectionData("attitude"),
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
        heroSettings: heroSettings || null,
        categoriesSettings: categoriesSettings || null,
        attitudeSettings: attitudeSettings || null,
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
        heroSettings: null,
        categoriesSettings: null,
        attitudeSettings: null,
      },
    };
  }
}
