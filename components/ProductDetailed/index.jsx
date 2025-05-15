import React from "react";
import ActionsProduct from "./ActionsProduct";
import ProductDetailedSliderVersion2 from "./ProductDetailedSliderVersion2";
import ProductDetailedSliderVersion3 from "./ProductDetailedSliderVersion3";
import SliderEmbla from "../EmblaCarouselAdvantage/EmblaCarousel";
import Container from "../Container";

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
    <>
      <Container>
        <div className="w-full flex flex-col md:flex-row gap-3 relative">
          {/* Left column - scrollable content */}
          <div className="w-full md:w-[70%]">
            <div className="block md:hidden">
              <ProductDetailedSliderVersion2 images={product.images} />
            </div>
            <div className="hidden md:block">
              <ProductDetailedSliderVersion3 images={product.images} />
            </div>
          </div>

          {/* Right column - fixed sidebar */}
          <div className="w-full md:w-[30%]">
            <div className="md:sticky md:top-4">
              {" "}
              {/* Added sticky positioning */}
              <ActionsProduct />
            </div>
          </div>
        </div>
      </Container>

      <SliderEmbla />
    </>
  );
}

export default ProductDetailed;
