import Image from "next/image";
import React, { useState, useRef } from "react";
import { SlArrowLeft, SlArrowRight, SlPlus } from "react-icons/sl";
import ProductImageModal from "./ProductImageModal";
import { FiZoomIn } from 'react-icons/fi';
import { GoPlus } from "react-icons/go";

const ProductDetailedSliderVersion3 = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const sliderRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100, visible: false });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Normalize image URLs to handle both formats
  const normalizedImages = images.map(image => {
    if (typeof image === 'string') {
      return image;
    } else if (image && image.url) {
      return image.url;
    }
    return '';
  }).filter(url => url !== '');

  const openModal = (index) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };

  const handleMouseMove = (e, index) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setCursorPosition(prev => ({ ...prev, visible: false }));
    setHoveredIndex(null);
  };

  return (
    <div className="w-full mx-auto md:mb-20 select-none relative">
      <div className="grid grid-cols-2 gap-0.5">
        {normalizedImages.map((image, index) => (
          <div
            key={index}
            onClick={() => openModal(index)}
            className="cursor-none relative overflow-hidden group"
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={image}
              width={800}
              height={800}
              quality={100}
              priority
              className="object-cover w-full h-full transition-transform duration-300 "
            />
          </div>
        ))}
      </div>

      {/* Custom cursor */}
      <div
        className={`fixed pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50 transition-opacity duration-200 ${
          cursorPosition.visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      >
        <div className="bg-white bg-opacity-80  p-2 flex items-center justify-center">
          <GoPlus className="text-black text-lg" />
        </div>
      </div>

      <ProductImageModal
        images={normalizedImages}
        initialIndex={modalStartIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailedSliderVersion3;