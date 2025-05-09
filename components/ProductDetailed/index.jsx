import React from "react";
import ActionsProduct from "./ActionsProduct";

import ProductDetailedSliderVersion2 from "./ProductDetailedSliderVersion2";
import ProductDetailedSlider from "./ProductDetailedSlider";
import ProductDetailedSliderVersion3 from "./ProductDetailedSliderVersion3";

function ProductDetailed() {
  const product = {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    description:
      "Experience crystal-clear sound with our noise-cancelling wireless headphones. Featuring 30-hour battery life and premium comfort.",
    images: [
      "/images/products/IMG_1139.jpg",
      "/images/13.jpg",
      "/images/13.jpg",
      "/images/13.jpg",
      "/images/13.jpg",
      "/images/13.jpg",
    ],
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Built-in microphone",
      "Foldable design",
    ],
  };
  return (
    <div className="w-full flex flex-col md:flex-row gap-3">
      <div className="w-full md:w-[70%]">
        {/* version 1  */}
        {/* <ProductDetailedSlider images={product.images} /> */}
        {/* _______________ */}
        {/* version 2  */}
        {/* <ProductDetailedSliderVersion2 images={product.images} /> */}

        {/* _______________ */}
        {/* version 3 */}
        <div className="block md:hidden">
          <ProductDetailedSliderVersion2 images={product.images} />
        </div>

        <div className="hidden md:block">
          <ProductDetailedSliderVersion3 images={product.images} />
        </div>

        {/* _______________ */}
      </div>

      <div className="w-full md:w-[30%]">
        <ActionsProduct />
      </div>
    </div>
  );
}

export default ProductDetailed;
