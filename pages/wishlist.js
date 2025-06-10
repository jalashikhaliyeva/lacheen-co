import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState, useEffect, useCallback } from "react";

import Footer from "@/components/Footer";

import FavoriteProducts from "@/components/FavoriteProducts";
import { getWishlist } from "@/firebase/services/firebaseWishlistService";
import { useAuthClient } from "@/shared/context/AuthContext";
import WishlistSection from "@/components/WishlistSection";

export default function Wishlist() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthClient();

  const fetchWishlist = useCallback(async () => {
    if (user) {
      try {
        const items = await getWishlist(user.uid);
        console.log(items, "items");
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
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
        <Header />
        <NavList />
        {!loading && wishlistItems.length > 0 && <WishlistSection wishlistItems={wishlistItems} />}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <FavoriteProducts 
            wishlistItems={wishlistItems} 
            onWishlistUpdate={handleWishlistUpdate}
          />
        )}
        <Footer />
      </main>
    </div>
  );
}
