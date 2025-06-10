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
        <Header />
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
