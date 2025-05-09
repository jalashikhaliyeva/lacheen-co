import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { PiHeartLight } from "react-icons/pi";
import { PiHeart } from "react-icons/pi";
import { PiHeartFill } from "react-icons/pi";
import style from "./ProductCard.module.css";
function ProductCardSingleFavorites({
  product,
  isInWishlist,
  onToggleWishlist,
  imageHeight = 350,
  imageHeightClass = "h-[350px]",
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef(null);

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

    // Determine swipe direction
    if (translateX > 50 && currentImageIndex > 0) {
      // Swipe right
      setCurrentImageIndex((prev) => prev - 1);
    } else if (
      translateX < -50 &&
      currentImageIndex < product.images.length - 1
    ) {
      // Swipe left
      setCurrentImageIndex((prev) => prev + 1);
    }

    setTranslateX(0);
  };

  const goToNext = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${style.card} relative cursor-pointer aspect-square w-full overflow-hidden ${imageHeightClass}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="absolute inset-0 z-10" />
        <div
          className="relative w-full h-full"
          ref={imageRef}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? "none" : "transform 0.5s ease",
          }}
        >
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} - View ${index + 1}`}
                fill
                priority
                className="object-cover"
                quality={100}
              />
            </div>
          ))}
        </div>

        {product.images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full  transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <SlArrowLeft className="text-neutral-600 text-2xl" />
              </button>
            )}

            {currentImageIndex < product.images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 cursor-pointer  top-1/2 -translate-y-1/2 z-20 p-2 rounded-full  transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <SlArrowRight className="text-neutral-600 text-2xl" />
              </button>
            )}
          </>
        )}

        <button
          className="absolute top-4 cursor-pointer right-4 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
          aria-label="Add to favorites"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
        >
          {isInWishlist ? (
            <PiHeartFill className="text-neutral-600" size={18} />
          ) : (
            <PiHeart className="text-gray-700" size={18} />
          )}
        </button>

        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {product.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-neutral-500 w-2"
                    : "bg-neutral-300 hover:bg-gray-600"
                }`}
                onMouseEnter={() => handleDotHover(index)}
                onClick={() => handleDotHover(index)}
                aria-label={`View image ${index + 1} of ${
                  product.images.length
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-start font-gilroy">
        <h3 className="font-gilroy text-sm md:text-lg">{product.name}</h3>
        <p className="font-gilroy md:text-sm text-xs text-neutral-700">{`${product.price} ₼`}</p>
      </div>
    </div>
  );
}
export default ProductCardSingleFavorites;
