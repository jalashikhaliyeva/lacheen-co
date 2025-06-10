// pages/index.js (Updated Home Page)
import { useState } from "react";
import Header from "@/components/Header";
import NavList from "@/components/NavList";
import Hero from "@/components/Hero";
// import HeroV1 from "@/components/Hero-v1";
import CategorySection from "@/components/CategorySection";
import Citate from "@/components/Citate";
import SliderEmbla from "@/components/EmblaCarouselAdvantage/EmblaCarousel";
// import VideoSection from "@/components/VideoSection";
import VideoandImage from "@/components/VideoandImage";
import TrendingNow from "@/components/TrendingNow";
import Footer from "@/components/Footer";
import { useAuthClient } from "@/shared/context/AuthContext";
import { fetchCategories } from "@/firebase/services/categoriesService";

export default function Home({ categories }) {
  const { user } = useAuthClient();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <main>
        <Header />
        <NavList onMenuToggle={setIsMenuOpen}  />
        <Hero />
        {/* <HeroV1 /> */}
        <CategorySection  categories={categories}/>
        <Citate />
        <SliderEmbla />
        <VideoandImage />
        <TrendingNow />
        <Footer />
      </main>
    </div>
  );
}

// Server-side props for SEO and performance
export async function getServerSideProps() {
  try {
    const categories = await fetchCategories();
    
    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.error("Failed to fetch categories on server:", error);
    
    return {
      props: {
        categories: [],
      },
    };
  }
}

// Alternative: Static Generation (if categories don't change often)
/*
export async function getStaticProps() {
  try {
    const categories = await fetchCategories();
    
    return {
      props: {
        categories,
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error("Failed to fetch categories on server:", error);
    
    return {
      props: {
        categories: [],
      },
      revalidate: 60 // Retry after 1 minute if failed
    };
  }
}
*/