import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import ProductsListHeader from "@/components/ProductsList/ProductsListHeader";
import ProductList from "@/components/ProductsList";

export default function Products() {
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
        <Header />
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
