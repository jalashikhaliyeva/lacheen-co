import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState, useEffect, useCallback } from "react";

import Footer from "@/components/Footer";

import FavoriteProducts from "@/components/FavoriteProducts";
import { getWishlist } from "@/firebase/services/firebaseWishlistService";
import { useAuthClient } from "@/shared/context/AuthContext";
import WishlistSection from "@/components/WishlistSection";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

export default function Wishlist({ categories, modalNewProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthClient();

  const fetchWishlist = useCallback(async () => {
    if (user) {
      try {
        const items = await getWishlist(user.uid);
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleWishlistUpdate = (updatedItems) => {
    setWishlistItems(updatedItems);
  };

  return (
    <div className="relative">
      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />

        <NavList />
        {!loading && wishlistItems.length > 0 && (
          <WishlistSection wishlistItems={wishlistItems} />
        )}
        <FavoriteProducts
          wishlistItems={wishlistItems}
          onWishlistUpdate={handleWishlistUpdate}
          loading={loading}
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
