import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState } from "react";
import Footer from "@/components/Footer";
import BasketSectionContainer from "@/components/BasketSectionContainer";
import Container from "@/components/Container";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Basket({ categories, modalNewProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList />
        <Container>
          <BasketSectionContainer />
        </Container>
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
