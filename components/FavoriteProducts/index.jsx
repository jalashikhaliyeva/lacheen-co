import React, { useState, useEffect, useRef } from "react";
import ProductCardSingle from "../ProductCardSingle";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { removeFromWishlist } from "@/firebase/services/firebaseWishlistService";
import { useAuthClient } from "@/shared/context/AuthContext";
import { ArrowRight, Heart, Plus } from "lucide-react";
import CustomToast from "../CustomToast/CustomToast";

function FavoriteProducts({ layout, wishlistItems = [], onWishlistUpdate, loading }) {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const ITEMS_PER_PAGE = 8;
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const { t } = useTranslation();
  const { user } = useAuthClient();
  const closeToast = () => setShowToast(false);
  const handleNavigate = () => {
    window.location.href = "/products";
  };
  const toggleWishlist = async (product) => {
    if (!user) {
      setToastMessage(t("wishlist.login_required"));
      setToastProduct(product);
      setShowToast(true);
      return;
    }

    try {
      await removeFromWishlist(user.uid, product.id);
      setToastMessage(t("wishlist.removed"));
      setToastProduct(product);
      setShowToast(true);
      // Update the parent component's wishlist
      if (onWishlistUpdate) {
        onWishlistUpdate(
          wishlistItems.filter((item) => item.id !== product.id)
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setToastMessage(t("wishlist.error"));
      setToastProduct(product);
      setShowToast(true);
    }
  };

  useEffect(() => {
    setVisibleProducts(wishlistItems.slice(0, ITEMS_PER_PAGE));
  }, [wishlistItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !loadingMore &&
          visibleProducts.length < wishlistItems.length
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleProducts, loadingMore, wishlistItems]);

  const loadMoreProducts = () => {
    setLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = wishlistItems.slice(0, endIndex);

      setVisibleProducts(newProducts);
      setPage(nextPage);
      setLoadingMore(false);
    }, 800);
  };

  const getGridClasses = () => {
    switch (layout) {
      case "full":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
      case "grid2":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "grid3":
        return "grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
      default:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  const getImageHeight = () => {
    switch (layout) {
      case "full":
        return 700;
      case "grid2":
        return 450;
      case "grid3":
        return 300;
      default:
        return 450;
    }
  };

  const getImageHeightClasses = () => {
    switch (layout) {
      case "full":
        return "h-[370px] md:h-[500px] lg:h-[700px]";
      case "grid2":
        return "h-[280px] md:h-[400px] lg:h-[450px]";
      case "grid3":
        return "h-[140px] md:h-[300px] lg:h-[300px]";
      default:
        return "h-[230px] md:h-[400px] lg:h-[450px]";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 px-8 relative overflow-hidden">
        {/* Floating hearts animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute text-rose-200 animate-pulse opacity-20
                  ${i === 0 ? "top-10 left-10 w-4 h-4" : ""}
                  ${i === 1 ? "top-20 right-16 w-6 h-6" : ""}
                  ${i === 2 ? "bottom-32 left-20 w-5 h-5" : ""}
                  ${i === 3 ? "bottom-16 right-12 w-4 h-4" : ""}
                  ${i === 4 ? "top-1/3 left-1/2 w-3 h-3" : ""}
                  ${i === 5 ? "bottom-1/2 right-1/3 w-5 h-5" : ""}
                `}
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>

        <div className="text-center z-10">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-rose-700" />
          </div>
          <h3 className="text-2xl  font-medium text-gray-800 mb-3 font-gilroy">
            {t("wishlist.empty")}
          </h3>
          <p className="text-gray-500 mb-8 max-w-md font-gilroy">
            {t("wishlist.empty_description")}
          </p>
          <button
            onClick={handleNavigate}
            className="group  text-rose-700 cursor-pointer px-8 py-3 rounded-full font-gilroy font-medium transform transition-all duration-300 hover:scale-105 "
          >
            {t("wishlist.discover_more")}
            <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomToast
        show={showToast}
        onClose={closeToast}
        product={toastProduct}
        message={toastMessage}
        linkText={t("wishlist.access")}
        linkHref="/wishlist"
      />
      <div
        className={`mb-10 grid ${getGridClasses()} gap-1 w-full pt-8 px-4 md:px-20`}
      >
        {visibleProducts.map((product) => (
          <ProductCardSingle
            imageHeightClass={getImageHeightClasses()}
            imageHeight={getImageHeight()}
            key={product.id}
            product={product}
            isInWishlist={true}
            onToggleWishlist={() => toggleWishlist(product)}
          />
        ))}
      </div>

      {/* Loading indicator */}
      <div
        ref={loaderRef}
        className="flex justify-center items-center p-4 mb-8"
      >
        {loadingMore && visibleProducts.length < wishlistItems.length && (
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
        )}
      </div>
    </>
  );
}

export default FavoriteProducts;
