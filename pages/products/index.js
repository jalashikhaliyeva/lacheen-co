import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import ProductsListHeader from "@/components/ProductsList/ProductsListHeader";
import ProductList from "@/components/ProductsList";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Products({ categories, modalNewProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [layout, setLayout] = useState("grid2");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    color: [],
    size: [],
    price: [],
    category: [],
  });
  const router = useRouter();

  useEffect(() => {
    const { category } = router.query;
    setSelectedCategory(category || null);
  }, [router.query]);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="relative">
      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList />
        <ProductsListHeader
          layout={layout}
          setLayout={setLayout}
          selectedCategory={selectedCategory}
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
        <ProductList 
          layout={layout} 
          selectedCategory={selectedCategory}
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
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

