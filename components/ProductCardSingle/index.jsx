import React, { useState, useRef } from "react";
import Image from "next/image";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { useRouter } from "next/router";

function ProductCardSingle({
  product,
  isInWishlist,
  onToggleWishlist,
  imageHeightClass = "h-[350px]",
  availableColors = [],
  allProducts = [],
}) {
  const router = useRouter();
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => img.url || img)
      : [product.image || "/fallback.jpg"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const imageRef = useRef(null);

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

  const getCurrentImages = () => {
    if (!hoveredColor) return images;

    const variant = findVariantByColor(hoveredColor);
    if (!variant) return images;

    return Array.isArray(variant.images) && variant.images.length > 0
      ? variant.images.map((img) => img.url || img)
      : [variant.image || "/fallback.jpg"];
  };

  const currentImages = getCurrentImages();

  const handleDotHover = (index) => {
    setCurrentImageIndex(index);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === "touchstart" ? e.touches[0].clientX : e.clientX);
    setTranslateX(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (translateX > 50 && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    } else if (
      translateX < -50 &&
      currentImageIndex < currentImages.length - 1
    ) {
      setCurrentImageIndex((prev) => prev + 1);
    }

    setTranslateX(0);
  };

  const goToNext = () => {
    if (currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleProductClick = () => {
    router.push(`/products/${product.id}`);
  };

  // --- RENDER ---
  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredColor(null);
      }}
      onClick={handleProductClick}
    >
      {/* Image container */}
      <div
        className={`relative cursor-pointer aspect-square w-full overflow-hidden ${imageHeightClass}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {product.sale && (
          <div className="absolute top-4 left-4 z-20  text-rose-700 font-clash px-2 py-1 rounded-md text-sm font-medium">
            -{product.sale}%
          </div>
        )}
        <div
          className="relative w-full h-full"
          ref={imageRef}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? "none" : "transform 0.5s ease",
          }}
        >
          {currentImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} - View ${index + 1}`}
                fill
                className="object-cover"
                quality={100}
              />
            </div>
          ))}
        </div>

        {currentImages.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Previous image"
              >
                <SlArrowLeft className="text-neutral-600 text-2xl" />
              </button>
            )}
            {currentImageIndex < currentImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Next image"
              >
                <SlArrowRight className="text-neutral-600 text-2xl" />
              </button>
            )}
          </>
        )}

        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
          aria-label="Add to favorites"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
        >
          {isInWishlist ? (
            <PiHeartFill className="text-neutral-600 cursor-pointer" size={18} />
          ) : (
            <PiHeart className="text-gray-700 cursor-pointer" size={18} />
          )}
        </button>

        {currentImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {currentImages.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? "bg-neutral-500"
                    : "bg-neutral-300 hover:bg-gray-600"
                }`}
                onMouseEnter={() => handleDotHover(idx)}
                onClick={() => handleDotHover(idx)}
                aria-label={`View image ${idx + 1} of ${currentImages.length}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-start font-gilroy">
        <h3 className="text-sm md:text-lg text-neutral-800">{product.name}</h3>

        <div className="flex items-center gap-2">
          {product.sale ? (
            <>
              <p className="md:text-sm text-xs text-neutral-700 line-through">
                {product.sellingPrice} ₼
              </p>
              <p className="md:text-sm text-xs text-rose-700 font-medium">
                {Math.round(
                  Number(product.sellingPrice) * (1 - Number(product.sale) / 100)
                )}{" "}
                ₼
              </p>
            </>
          ) : (
            <p className="md:text-sm text-xs text-neutral-700">
              {product.sellingPrice} ₼
            </p>
          )}
        </div>

        {availableColors.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {availableColors.map((colObj, i) => (
              <div
                key={i}
                className="w-4 h-4 border cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: colObj.code }}
                title={colObj.name}
                onMouseEnter={() => setHoveredColor(colObj.code)}
                onMouseLeave={() => setHoveredColor(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardSingle;
