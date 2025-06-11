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

function TrendingInitSearch({ newProducts }) {
  const useFlex = newProducts.length < 6;
  const { t } = useTranslation();
  const [wishlist, setWishlist] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  const toggleWishlist = (product) => {
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
      {/* Toast Notification */}
      <CustomToast
        show={showToast}
        onClose={closeToast}
        product={toastProduct}
        message={t("wishlist.added")}
        linkText={t("wishlist.access")}
        linkHref="/wishlist"
      />

      <div className="flex flex-col items-center  h-full pt-3 mb-14">
        <p className="uppercase font-gilroy text-sm py-5">
          {t("you_might_also_like")}
        </p>

        <div
          className={`
        pt-2 px-4 md:px-20 gap-4
        ${
          useFlex
            ? "flex flex-wrap justify-center"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        }
      `}
        >
          {newProducts.map((product) => (
            <ProductCard
              key={product.id}
              imageHeight={240}
              product={product}
              isInWishlist={wishlist.some((i) => i.id === product.id)}
              onToggleWishlist={() => toggleWishlist(product)}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default TrendingInitSearch;
