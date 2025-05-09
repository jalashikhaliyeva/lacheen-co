import Image from "next/image";
import React, { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

function BasketSectionItems() {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const increment = () => {
    setQuantity((q) => q + 1);
  };

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="flex flex-col gap-3 font-gilroy">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex flex-col border border-neutral-300 p-3 md:p-4 "
        >
          {/* Close button */}
          <div className="flex justify-end">
            <TfiClose
              className="text-neutral-400 cursor-pointer hover:text-neutral-600 transition"
              size={18}
              onClick={() => console.log("Remove item")}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Product image */}
            <div className="w-full sm:w-auto cursor-pointer">
              <Image
                src="/images/12.jpg"
                alt="Product Image"
                width={300}
                height={300}
                className="w-full sm:w-40 md:w-52 h-[350px] md:h-48 object-cover object-bottom"
                onClick={() => openModal("/images/12.jpg")}
              />
            </div>

            {/* Name & description */}
            <div className="w-full sm:flex-1 text-center sm:text-left">
              <span className="block text-base md:text-lg font-medium">
                Product Name
              </span>
              <span className="block text-xs md:text-sm text-gray-500 mt-1">
                Product Description - Lorem ipsum dolor sit amet consectetur
                adipisicing elit.
              </span>

              {/* Mobile-only price */}
              <div className="sm:hidden mt-2 text-rose-700 font-semibold text-sm">
                43.4 ₼
              </div>
            </div>

            {/* Quantity selector and price container */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              {/* Quantity selector */}
              <div className="flex items-center font-gilroy">
                <button
                  onClick={decrement}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 flex cursor-pointer items-center justify-center border border-neutral-300  hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <AiOutlineMinus className="text-lg" />
                </button>

                <span className="w-8 text-center text-base">{quantity}</span>

                <button
                  onClick={increment}
                  aria-label="Increase quantity"
                  className="w-8 h-8 flex items-center cursor-pointer justify-center border border-neutral-300  hover:bg-neutral-100 transition"
                >
                  <AiOutlinePlus className="text-lg" />
                </button>
              </div>

              {/* Price (hidden on mobile) */}
              <div className="hidden sm:block text-rose-700 font-semibold text-base whitespace-nowrap">
                43.4 ₼
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-75 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 cursor-pointer right-0 text-white hover:text-gray-300 transition"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <TfiClose size={24} />
            </button>
            <div className="max-w-[90vw] max-h-[90vh] overflow-auto">
              <Image
                src={selectedImage}
                alt="Enlarged product"
                width={800}
                height={800}
                className="object-contain max-w-full max-h-[80vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasketSectionItems;
