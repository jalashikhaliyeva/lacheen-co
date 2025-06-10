import React, { useState, useRef, useEffect } from "react";
import Container from "../Container";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { PiHeartLight } from "react-icons/pi";
import { PiHeart } from "react-icons/pi";
import { PiHeartFill } from "react-icons/pi";
import ProductCard from "../ProductCard";
import { useTranslation } from "react-i18next";
import CustomToast from "../CustomToast/CustomToast";

function TrendingNow() {
  const [wishlist, setWishlist] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const { t } = useTranslation();
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
  ];

  const toggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (wishlist.some((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
      setToastProduct(product);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <Container>

      <CustomToast
        show={showToast}
        onClose={closeToast}
        product={toastProduct}
        message={t("wishlist.added")}
        linkText={t("wishlist.access")}
        linkHref="/wishlist"
      />

      <div className="flex flex-col items-center h-full pt-10 mb-14 relative z-0">
        <p className="uppercase font-gilroy text-sm py-5">Women</p>
        <h2 className="font-gilroy text-2xl font-normal">
          {t("trending_now")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full pt-8 px-4 md:px-20">
          {products.map((product) => (
            <div key={product.id} className="relative z-0">
              <ProductCard
                imageHeight={350}
                product={product}
                isInWishlist={wishlist.some((item) => item.id === product.id)}
                onToggleWishlist={(e) => toggleWishlist(product, e)}
              />
            </div>
          ))}
        </div>

        <button
          className="py-2 px-4 mt-7 border cursor-pointer font-gilroy border-neutral-900 text-neutral-800 
                    relative overflow-hidden 
                    hover:text-white 
                    transition-all duration-300
                    hover:border-neutral-900
                    before:content-[''] before:absolute before:top-0 before:left-0 
                    before:w-0 before:h-full before:bg-neutral-900 
                    before:-z-10 before:transition-all before:duration-300
                    hover:before:w-full"
        >
          {t("discover_more")}
        </button>
      </div>
    </Container>
  );
}

export default TrendingNow;
