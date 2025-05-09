import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState } from "react";
import Footer from "@/components/Footer";
import ProductsListHeader from "@/components/ProductsList/ProductsListHeader";
import ProductList from "@/components/ProductsList";
import ProductDetailed from "@/components/ProductDetailed";
import Container from "@/components/Container";

export default function Products() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [layout, setLayout] = useState("grid2");
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
        <Header />
        <NavList onMenuToggle={setIsMenuOpen} />

       
          <ProductDetailed />
       

        <Footer />
      </main>
    </div>
  );
}
