import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SlArrowLeft, SlArrowRight, SlPlus } from "react-icons/sl";
import ProductImageModal from "./ProductImageModal";

const ProductDetailedSliderVersion3 = () => {
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

  // Handler to open the modal and set the initial index
  const openModal = (index) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full mx-auto md:mb-20 select-none">
      <div className="grid grid-cols-2 gap-0.5">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openModal(index)}
            className="cursor-pointer"
          >
            <Image
              src={image}
              width={800}
              height={800}
              quality={100}
              priority
              className="object-fill"
            />
          </div>
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

export default ProductDetailedSliderVersion3;
