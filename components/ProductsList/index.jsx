import React, { useState } from "react";
import ProductCard from "../ProductCard";
import ProductCardSingle from "../ProductCardSingle";

function ProductList() {
  const [wishlist, setWishlist] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "Speedy 25",
      price: "150",
      images: ["/images/IMG_2928.jpg", "/images/IMG_2927.jpg"],
    },
    {
      id: 2,
      name: "Speedy 30",
      price: "150",
      images: ["/images/IMG_2931.jpg", "/images/IMG_2932.jpg"],
    },
    {
      id: 3,
      name: "Speedy Bandoulière 25",
      price: "150",
      images: ["/images/IMG_2929.jpg", "/images/IMG_2925.jpg"],
    },
    {
      id: 4,
      name: "Speedy Bandoulière 30",
      price: "150",
      images: ["/images/IMG_2926.jpg", "/images/IMG_2930.jpg"],
    },
  ];

  const toggleWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
      setToastProduct(product);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };
  return (
    <>
      {/* Toast Notification */}
      {showToast && toastProduct && (
        <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
          <div
            className={`bg-white shadow-lg rounded-md h-[120px] flex items-center mx-4 border border-gray-200 w-full max-w-2xl ${
              showToast ? "animate-slide-down" : "animate-slide-up"
            }`}
            onAnimationEnd={() => {
              if (!showToast) {
                setToastProduct(null);
              }
            }}
          >
            {/* Product Image */}
            <div className="h-full w-[120px] relative">
              <Image
                src={toastProduct.images[0]}
                alt={toastProduct.name}
                fill
                className="object-cover object-bottom rounded-l-md"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <p className="font-gilroy text-lg mb-2">
                The item has been added to your wishlist!
              </p>
              <p className="font-gilroy cursor-pointer text-sm text-neutral-700">
                Access your{" "}
                <span className="underline underline-offset-4">wishlist</span>
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={closeToast}
              className="absolute right-4 top-4 p-1 rounded-full cursor-pointer"
              aria-label="Close notification"
            >
              <IoClose className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 w-full pt-8 px-4 md:px-20">
        {products.map((product) => (
          <ProductCardSingle
            imageHeight={350}
            key={product.id}
            product={product}
            isInWishlist={wishlist.some((item) => item.id === product.id)}
            onToggleWishlist={() => toggleWishlist(product)}
          />
        ))}
      </div>
    </>
  );
}

export default ProductList;
