import Header from "@/components/Header";
import NavList from "@/components/NavList";
import Footer from "@/components/Footer";
import { useState } from "react";
import dynamic from "next/dynamic";
import ContactDatas from "@/components/ContactDatas";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";
const MapWithNoSSR = dynamic(() => import("@/components/CustomMap"), {
  ssr: false,
});

export default function Contact({ categories, modalNewProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div />

      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList />

        <div className="container mx-auto px-4 py-12">
          <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
            <MapWithNoSSR />
          </div>

          <ContactDatas />
        </div>

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
