import React, { useState, useEffect, useRef } from "react";
import ProductCardSingle from "../ProductCardSingle";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import Toast from "@/components/Toast";
import { useTranslation } from "react-i18next";

function FavoriteProducts({ layout }) {
  const [wishlist, setWishlist] = useState([]);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const ITEMS_PER_PAGE = 8;
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const { t } = useTranslation();
  const closeToast = () => setShowToast(false);

  const toggleWishlist = (product) => {
    // … add/remove logic …
    setToastProduct(product);
    setShowToast(true);
  };
  const products = [
    {
      id: 1,
      name: "Speedy 25",
      price: "150",
      images: ["/images/IMG_2928.jpg", "/images/IMG_2927.jpg"],
    },
    {
      id: 2,
      name: "Speedy 30",
      price: "150",
      images: ["/images/IMG_2931.jpg", "/images/IMG_2932.jpg"],
    },
    {
      id: 3,
      name: "Speedy Bandoulière 25",
      price: "150",
      images: ["/images/IMG_2929.jpg", "/images/IMG_2925.jpg"],
    },
    {
      id: 4,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 5,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 6,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 1,
      name: "Speedy 25",
      price: "150",
      images: ["/images/IMG_2928.jpg", "/images/IMG_2927.jpg"],
    },
    {
      id: 2,
      name: "Speedy 30",
      price: "150",
      images: ["/images/IMG_2931.jpg", "/images/IMG_2932.jpg"],
    },
    {
      id: 3,
      name: "Speedy Bandoulière 25",
      price: "150",
      images: ["/images/IMG_2929.jpg", "/images/IMG_2925.jpg"],
    },
    {
      id: 4,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 5,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 6,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 1,
      name: "Speedy 25",
      price: "150",
      images: ["/images/IMG_2928.jpg", "/images/IMG_2927.jpg"],
    },
    {
      id: 2,
      name: "Speedy 30",
      price: "150",
      images: ["/images/IMG_2931.jpg", "/images/IMG_2932.jpg"],
    },
    {
      id: 3,
      name: "Speedy Bandoulière 25",
      price: "150",
      images: ["/images/IMG_2929.jpg", "/images/IMG_2925.jpg"],
    },
    {
      id: 4,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 5,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
    {
      id: 6,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
  ];
  useEffect(() => {
    setVisibleProducts(products.slice(0, ITEMS_PER_PAGE));
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !loading &&
          visibleProducts.length < products.length
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
  }, [visibleProducts, loading]);
  const loadMoreProducts = () => {
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = products.slice(0, endIndex);

      setVisibleProducts(newProducts);
      setPage(nextPage);
      setLoading(false);
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
        return 700; // full-width
      case "grid2":
        return 450; //  2-column grid
      case "grid3":
        return 300; // S for 3-column grid
      default:
        return 450; // Default medium height
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

  return (
    <>
      <Toast
        show={showToast}
        onClose={closeToast}
        product={toastProduct}
        message={t("wishlist.added")}
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
            isInWishlist={wishlist.some((item) => item.id === product.id)}
            onToggleWishlist={() => toggleWishlist(product)}
          />
        ))}
      </div>

      {/* Loading indicator */}
      <div
        ref={loaderRef}
        className="flex justify-center items-center p-4 mb-8"
      >
        {loading && visibleProducts.length < products.length && (
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
        )}
      </div>
    </>
  );
}

export default FavoriteProducts;
