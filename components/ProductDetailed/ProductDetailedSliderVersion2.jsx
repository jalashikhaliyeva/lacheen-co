import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SlArrowLeft, SlArrowRight, SlPlus } from "react-icons/sl";
import ProductImageModal from "./ProductImageModal";

const ProductDetailedSliderVersion2 = () => {
  const images = [
    "/images/13.jpg",
    "/images/14.jpg",
    "/images/15.jpg",
    "/images/16.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const sliderRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  // compute X position from mouse or touch event
  const getPositionX = (e) =>
    e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

  // start dragging
  const handleDragStart = useCallback((e) => {
    const posX = getPositionX(e);
    setStartPos(posX);
    setIsDragging(true);
  }, []);

  // while dragging
  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const currentPosition = getPositionX(e);
      const diff = currentPosition - startPos;
      setCurrentTranslate(prevTranslate + diff);
    },
    [isDragging, startPos, prevTranslate]
  );

  // end drag, snap to slide
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    const threshold = sliderRef.current.clientWidth * 0.2;

    if (movedBy < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else if (movedBy > threshold && currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    } else {
      // snap back
      setCurrentTranslate(prevTranslate);
    }
  }, [currentTranslate, prevTranslate, currentIndex, images.length]);

  // update translate when index changes
  useEffect(() => {
    const slideWidth = sliderRef.current.clientWidth;
    const newTranslate = -currentIndex * slideWidth;
    setCurrentTranslate(newTranslate);
    setPrevTranslate(newTranslate);
  }, [currentIndex]);

  // keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setCurrentIndex((idx) => idx + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((idx) => idx - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, images.length]);

  const prev = () => currentIndex > 0 && setCurrentIndex((idx) => idx - 1);
  const next = () =>
    currentIndex < images.length - 1 && setCurrentIndex((idx) => idx + 1);

  return (
    <div className="w-full mx-auto md:mb-20 select-none">
      {/* Main slider */}
      <div
        className="relative w-full overflow-hidden md:h-[640px] touch-pan-y"
        ref={sliderRef}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(${currentTranslate}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            cursor: isDragging ? "grabbing" : "zoom-in",
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => isDragging && handleDragEnd()}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative min-w-full flex items-center justify-center h-full"
              // onClick={() => {
              //   setModalStartIndex(i);
              //   setIsModalOpen(true);
              // }}
            >
              <Image
                src={src}
                alt={`Product view ${i + 1}`}
                width={500}
                height={600}
                className="object-contain pointer-events-none"
                // onClick={() => {
                //   setModalStartIndex(i);
                //   setIsModalOpen(true);
                // }}
              />
            </div>
          ))}
        </div>

        {/* Nav buttons */}
        {currentIndex > 0 && (
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute top-1/2 left-4 -translate-y-1/2  bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full  z-10"
          >
            <SlArrowLeft size={24} />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button
            onClick={next}
            aria-label="Next"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full  z-10"
          >
            <SlArrowRight size={24} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition ${
              i === currentIndex
                ? "border-neutral-500 "
                : "border-transparent hover:border-neutral-300"
            }`}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              width={64}
              height={64}
              className="object-contain object-bottom"
            />
          </button>
        ))}
      </div>
      <ProductImageModal
        images={images}
        initialIndex={modalStartIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailedSliderVersion2;
