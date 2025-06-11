import { useState } from "react";
import Header from "@/components/Header";
import NavList from "@/components/NavList";
import ProfileInformation from "@/components/ProfileInformation";
import Footer from "@/components/Footer";
import { useAuthClient } from "@/shared/context/AuthContext";
import { useRouter } from "next/router";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Profile({ categories, modalNewProducts }) {
  const { user, logout, loading } = useAuthClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { tab } = router.query;

  // mock data for the demo; replace with real fetch later
  const orders = { total: 14, pending: 3, cancelled: 1 };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* simple spinner */}
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

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

        <ProfileInformation
          user={user}
          orders={orders}
          onLogout={logout}
          initialTab={tab || "personal"}
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
