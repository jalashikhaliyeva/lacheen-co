import React, { useState } from "react";
import { useRouter } from "next/router";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { deleteProduct } from "@/firebase/services/firebaseProductsService";
import DeleteModal from "../DeleteModal";


// ImageSlider component for displaying product images.
function ImageSlider({ images = [] }) {
  if (!Array.isArray(images) || images.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-100">
        <p>No images available.</p>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const getImageUrl = (img) =>
    typeof img === "string" ? img : img.url || "";

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomOrigin({ x: 50, y: 50 });
  };

  const currentImageUrl = getImageUrl(images[currentIndex]);

  return (
    <div className="relative">
      {/* Main image with zoom effect */}
      <div className="overflow-hidden">
        <img
          src={currentImageUrl}
          alt={`Slide ${currentIndex + 1}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}
          className="w-full h-[400px] object-cover transition-transform duration-300 transform hover:scale-110"
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 cursor-pointer bg-gray-200 p-2 rounded-full transform -translate-y-1/2"
      >
        <GrFormPrevious />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 cursor-pointer bg-gray-200 p-2 rounded-full transform -translate-y-1/2"
      >
        <MdNavigateNext />
      </button>

      {/* Thumbnails */}
      <div className="flex justify-center mt-2 space-x-2">
        {images.map((img, index) => {
          const thumbnailUrl = getImageUrl(img);
          return (
            <img
              key={index}
              src={thumbnailUrl}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              className={`w-16 h-16 object-cover cursor-pointer border ${
                index === currentIndex ? "border-blue-500" : "border-transparent"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}


function ProductDetailTable({ product, otherColors = [] }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeFixed = (val, fixed = 2) => {
    const num = parseFloat(val);
    return isNaN(num) ? "N/A" : num.toFixed(fixed);
  };

  const price = parseFloat(product.price);
  const saleVal = parseFloat(product.sale);
  const discountPrice =
    !isNaN(price) && !isNaN(saleVal) && saleVal > 0
      ? price - price * (saleVal / 100)
      : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 my-5 border border-neutral-300 font-gilroy rounded-lg bg-white">
      {/* Header */}
      <div className="mb-6 p-4 relative">
        <h2 className="text-2xl font-bold">
          <span className="text-neutral-700">Product Details for</span>{" "}
          <span className="text-teal-700">{product.name}</span>
        </h2>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div>
            <span className="text-lg text-gray-600 font-medium">Barcode:</span>{" "}
            <span className="text-lg text-gray-800">{product.barcode}</span>
          </div>
          <div>
            <span className="text-lg text-gray-600 font-medium">Category:</span>{" "}
            <span className="text-lg text-gray-800">{product.category}</span>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      {/* … the rest of your two‑column layout (Size Stock, Pricing, Other Colors, ImageSlider) … */}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default ProductDetailTable;