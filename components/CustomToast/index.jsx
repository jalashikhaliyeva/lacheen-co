import React, { useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

const CustomToast = ({
  show,
  onClose,
  product,
  message = "Item added to wishlist",
  linkText = "View wishlist",
  linkHref = "/wishlist",
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show || !product) return null;

  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
      <div
        className={`bg-white shadow-lg rounded-md h-[120px] flex items-center mx-4 border border-gray-200 w-full max-w-2xl ${
          show ? "animate-slide-down" : "animate-slide-up"
        }`}
        onAnimationEnd={() => {
          if (!show) onClose();
        }}
      >
        <div className="h-full w-[120px] relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-bottom rounded-l-md"
          />
        </div>

        <div className="flex-1 p-6 flex flex-col justify-center">
          <p className="font-gilroy text-sm md:text-lg mb-2">{message}</p>
          <a
            href={linkHref}
            className="font-gilroy text-xs md:text-sm text-neutral-700 underline underline-offset-4 cursor-pointer"
          >
            {linkText}
          </a>
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full cursor-pointer"
          aria-label="Close notification"
        >
          <IoClose className="text-gray-600 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
