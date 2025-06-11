import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SlArrowLeft, SlArrowRight, SlPlus } from "react-icons/sl";

const ProductDetailedSliderVersion2 = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const sliderRef = useRef(null);

  //  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalStartIndex, setModalStartIndex] = useState(0);

  const normalizedImages = images
    .map((image) => {
      if (typeof image === "string") {
        return image;
      } else if (image && image.url) {
        return image.url;
      }
      return "";
    })
    .filter((url) => url !== "");

  const getPositionX = (e) =>
    e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

  const handleDragStart = useCallback((e) => {
    const posX = getPositionX(e);
    setStartPos(posX);
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const currentPosition = getPositionX(e);
      const diff = currentPosition - startPos;
      setCurrentTranslate(prevTranslate + diff);
    },
    [isDragging, startPos, prevTranslate]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    const threshold = sliderRef.current.clientWidth * 0.2;

    if (movedBy < -threshold && currentIndex < normalizedImages.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else if (movedBy > threshold && currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    } else {
      setCurrentTranslate(prevTranslate);
    }
  }, [currentTranslate, prevTranslate, currentIndex, normalizedImages.length]);

  useEffect(() => {
    const slideWidth = sliderRef.current.clientWidth;
    const newTranslate = -currentIndex * slideWidth;
    setCurrentTranslate(newTranslate);
    setPrevTranslate(newTranslate);
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === "ArrowRight" &&
        currentIndex < normalizedImages.length - 1
      ) {
        setCurrentIndex((idx) => idx + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((idx) => idx - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, normalizedImages.length]);

  const prev = () => currentIndex > 0 && setCurrentIndex((idx) => idx - 1);
  const next = () =>
    currentIndex < normalizedImages.length - 1 &&
    setCurrentIndex((idx) => idx + 1);

  return (
    <div className="w-full mx-auto md:mb-20 select-none">
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
          {normalizedImages.map((src, i) => (
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
              />
            </div>
          ))}
        </div>

        {currentIndex > 0 && (
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute top-1/2 left-4 -translate-y-1/2  bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full  z-10"
          >
            <SlArrowLeft size={24} />
          </button>
        )}
        {currentIndex < normalizedImages.length - 1 && (
          <button
            onClick={next}
            aria-label="Next"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full  z-10"
          >
            <SlArrowRight size={24} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {normalizedImages.map((src, i) => (
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
      {/* <ProductImageModal
        images={normalizedImages}
        initialIndex={modalStartIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
};

export default ProductDetailedSliderVersion2;
