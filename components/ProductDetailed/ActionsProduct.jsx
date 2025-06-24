import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaCheckSolid,
  LiaChevronDownSolid,
  LiaChevronUpSolid,
} from "react-icons/lia";
import { PiChatsThin, PiHeart, PiHeartFill } from "react-icons/pi";
import { useAuthClient } from "@/shared/context/AuthContext";
import { addToBasket } from "@/firebase/services/basketService";
import { 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist 
} from "@/firebase/services/firebaseWishlistService";
import CustomToast from "../CustomToast/CustomToast";
import { useBasket } from "@/shared/context/BasketContext";

function ActionsProduct({ product, allProducts }) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthClient();
  const { loadBasketItems } = useBasket();
  const itemPath = router.asPath;
  const phoneNumber = "994517777285";
  const message = `Salam, mən ${itemPath} məhsul ilə maraqlanıram`;
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const getAvailableColors = (product) => {
    const isChild = product.is_child === true || product.is_child === "true";
    const colors = [];
    const colorCodes = new Set();

    if (product.color && product.color.code) {
      colors.push({
        name: product.color.name || "Color",
        code: product.color.code,
        id: product.id,
      });
      colorCodes.add(product.color.code);
    }

    if (!isChild) {
      const children = allProducts.filter((p) => p.parents_id === product.id);

      children.forEach((child) => {
        if (
          child.color &&
          child.color.code &&
          !colorCodes.has(child.color.code)
        ) {
          colors.push({
            name: child.color.name || "Color",
            code: child.color.code,
            id: child.id,
          });
          colorCodes.add(child.color.code);
        }
      });
    } else {
      const parent = allProducts.find((p) => p.id === product.parents_id);

      if (
        parent &&
        parent.color &&
        parent.color.code &&
        !colorCodes.has(parent.color.code)
      ) {
        colors.push({
          name: parent.color.name || "Color",
          code: parent.color.code,
          id: parent.id,
        });
        colorCodes.add(parent.color.code);
      }

      const allSiblings = allProducts.filter(
        (p) => p.parents_id === product.parents_id && p.id !== product.id
      );

      allSiblings.forEach((sibling) => {
        if (
          sibling.color &&
          sibling.color.code &&
          !colorCodes.has(sibling.color.code)
        ) {
          colors.push({
            name: sibling.color.name || "Color",
            code: sibling.color.code,
            id: sibling.id,
          });
          colorCodes.add(sibling.color.code);
        }
      });
    }

    return colors;
  };

  const handleColorClick = (colorId) => {
    if (colorId !== product.id) {
      router.push(`/products/${colorId}`);
    }
  };

  const findVariantByColor = (colorCode) => {
    if (!colorCode) return null;

    // If current product has this color, return it
    if (product.color?.code === colorCode) {
      return product;
    }

    // Check if current product is a child
    if (product.is_child === true || product.is_child === "true") {
      // First check if this color belongs to the parent
      const parent = allProducts.find((p) => p.id === product.parents_id);
      if (parent && parent.color?.code === colorCode) {
        return parent;
      }

      // Then look for siblings with this color
      return allProducts.find(
        (p) =>
          p.parents_id === product.parents_id && p.color?.code === colorCode
      );
    } else {
      // Look for children with this color
      return allProducts.find(
        (p) => p.parents_id === product.id && p.color?.code === colorCode
      );
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Render size options
  const renderSizeOptions = () => {
    if (!product.sizes || product.sizes.length === 0) {
      return (
        <p className="p-2 text-neutral-400 text-center">
          {t("no_sizes_available") || "No sizes available"}
        </p>
      );
    }

    return product.sizes.map((size) => (
      <p
        key={size}
        className={`p-2 cursor-pointer transition-colors duration-100 ${
          selectedSize === size
            ? "bg-neutral-200 text-neutral-900"
            : "hover:bg-neutral-100"
        }`}
        onClick={() => handleSizeSelect(size)}
      >
        {size}
      </p>
    ));
  };

  const handleAddToBasket = async () => {
    if (!user) {
      setToastMessage(t("please_login_first"));
      setShowToast(true);
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      setToastMessage(t("please_select_size"));
      setShowToast(true);
      return;
    }

    try {
      setIsAddingToBasket(true);
      const productWithSize = {
        ...product,
        selectedSize,
      };
      await addToBasket(user.uid, productWithSize);
      await loadBasketItems(); // Reload basket items after adding
      setToastMessage(t("added_to_basket"));
      setShowToast(true);
      router.push("/basket");
    } catch (error) {
      console.error("Error adding to basket:", error);
      setToastMessage(t("error_adding_to_basket"));
      setShowToast(true);
    } finally {
      setIsAddingToBasket(false);
    }
  };

  const closeToast = () => setShowToast(false);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && product.id) {
        try {
          const inWishlist = await isInWishlist(user.uid, product.id);
          setIsInWishlistState(inWishlist);
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        }
      }
    };

    checkWishlistStatus();
  }, [user, product.id]);

  const handleWishlistToggle = async () => {
    if (!user) {
      setToastMessage(t("please_login_first"));
      setShowToast(true);
      router.push("/login");
      return;
    }

    try {
      setIsWishlistLoading(true);
      
      if (isInWishlistState) {
        await removeFromWishlist(user.uid, product.id);
        setIsInWishlistState(false);
        setToastMessage(t("removed_from_wishlist") || "Removed from wishlist");
      } else {
        await addToWishlist(user.uid, product);
        setIsInWishlistState(true);
        setToastMessage(t("added_to_wishlist") || "Added to wishlist");
      }
      
      setShowToast(true);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setToastMessage(t("error_updating_wishlist") || "Error updating wishlist");
      setShowToast(true);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <>
      <CustomToast
        show={showToast}
        onClose={closeToast}
        message={toastMessage}
      />
      <div className="flex flex-col gap-1 md:gap-4 w-full font-gilroy bg-white p-4 md:p-5 border-neutral-200">
        <div className="flex flex-row gap-2 items-center justify-between">
          <h2 className=" uppercase block text-lg md:text-xl text-neutral-800">
            {product.name}
          </h2>
          <h2 className=" uppercase block text-sm md:text-base text-neutral-800">
            {product.barcode}
          </h2>
        </div>

        <div className="block">
          <div className="flex flex-row justify-between">
            {product.sale && parseFloat(product.sale) > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-base line-through  text-neutral-800">
                  {product.sellingPrice} ₼
                </span>
                <span className="text-base font-semibold text-rose-800">
                  {(
                    parseFloat(product.sellingPrice) - parseFloat(product.sale)
                  ).toFixed(2)}{" "}
                  ₼
                </span>
              </div>
            ) : (
              <span className="text-base text-neutral-800">
                {product.sellingPrice} ₼
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2 items-baseline">
            {getAvailableColors(product).map((color) => {
              const isCurrentColor = color.id === product.id;
              const variant = findVariantByColor(color.code);
              const variantImages = variant?.images || [];

              return (
                <div
                  key={color.code}
                  className="relative group"
                  onClick={() => handleColorClick(color.id)}
                  onMouseEnter={() => setHoveredColor(color.code)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  <div
                    className={`p-2.5 cursor-pointer transition-all duration-200`}
                    style={{ backgroundColor: color.code }}
                  />
                  {isCurrentColor && (
                    <div className="absolute bottom-[-4px] left-0 h-0.5 w-full bg-neutral-900" />
                  )}

                  {/* Hover preview */}
                  {hoveredColor === color.code && variantImages.length > 0 && (
                    <div className="absolute z-10 top-full left-0 mt-2 w-32 h-32 bg-white shadow-lg  overflow-hidden">
                      <img
                        src={variantImages[0].url || variantImages[0]}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <p className="text-base font-gilroy text-neutral-800">
              - {product.color?.name || product.baseColor}
            </p>
          </div>
        </div>

        <div className="hidden md:flex w-full bg-amber-50 font-gilroy text-center items-center justify-center">
          <p className="text-sm text-neutral-600 py-1 px-3 text-center">
            {product.description}
          </p>
        </div>

        {/* Desktop size selector */}
        <div className="hidden md:flex border-t border-b border-neutral-400 max-h-[195px] overflow-y-auto flex-col font-gilroy text-neutral-600 py-3">
          {renderSizeOptions()}
        </div>

        {/* Mobile size selector */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={toggleDetails}
              className="text-sm text-neutral-600"
            >
              {showDetails ? t("hide_sizes") : t("show_available_sizes")}
            </button>
            <button onClick={toggleDetails}>
              {showDetails ? (
                <LiaChevronUpSolid size={16} className="text-neutral-600" />
              ) : (
                <LiaChevronDownSolid size={16} className="text-neutral-600" />
              )}
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDetails ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="flex border-t border-b border-neutral-400 max-h-[195px] overflow-y-auto flex-col font-gilroy text-neutral-600 py-3">
              {renderSizeOptions()}
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 w-full flex items-center gap-2">
          <div className="w-[90%]">
            <button
              className="py-2 px-4 w-full border cursor-pointer font-gilroy border-neutral-900 text-neutral-800 
              relative overflow-hidden text-sm md:text-base
              hover:text-white 
              transition-all duration-500
              hover:bg-neutral-900
              hover:border-neutral-900
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedSize || isAddingToBasket}
              onClick={handleAddToBasket}
            >
              {isAddingToBasket
                ? t("adding_to_basket")
                : selectedSize
                ? t("add_to_cart")
                : t("select_size_before_adding_to_basket") || "Select Size"}
            </button>
          </div>
          <button 
            className={`cursor-pointer py-2 px-2 border transition-all duration-200 ${
              isInWishlistState 
                ? "border-black bg-black" 
                : "border-black bg-black hover:border-neutral-500 hover:bg-neutral-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            {isInWishlistState ? (
              <PiHeartFill className="text-2xl text-white" />
            ) : (
              <PiHeart className="text-2xl text-white" />
            )}
          </button>
        </div>

        <div className="hidden text-neutral-800 md:flex mt-4 md:mt-5 flex-col gap-2 text-sm md:text-base">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <div className="flex flex-row gap-2 items-center">
              <PiChatsThin size={26} />
              <p>{t("whatsapp_stock_check")}</p>
            </div>
          </a>
          <div className="flex flex-row gap-2 items-center">
            <LiaCheckSolid size={18} />
            <p> 100 AZN {t("free_shipping_threshold")} </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActionsProduct;
