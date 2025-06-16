import React, { useState, useEffect } from "react";
import ActionsProduct from "./ActionsProduct";
import ProductDetailedSliderVersion2 from "./ProductDetailedSliderVersion2";
import ProductDetailedSliderVersion3 from "./ProductDetailedSliderVersion3";
import SliderEmbla from "../EmblaCarouselAdvantage/EmblaCarousel";
import Container from "../Container";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";

function ProductDetailed({ product }) {
  const [allProducts, setAllProducts] = useState([]);
  const images = product.images || [];
  const features = product.features || [];

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const products = await fetchProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadAllProducts();
  }, []);

  return (
    <>
      <Container>
        <div className="w-full flex flex-col md:flex-row gap-3 relative">
          <div className="w-full md:w-[70%]">
            <div className="block md:hidden">
              <ProductDetailedSliderVersion2 images={images} />
            </div>
            <div className="hidden md:block">
              <ProductDetailedSliderVersion3 images={images} />
            </div>
          </div>

          <div className="w-full md:w-[30%]">
            <div className="md:sticky md:top-4">
            
              <ActionsProduct product={product} allProducts={allProducts} />
            </div>
          </div>
        </div>
      </Container>

      <SliderEmbla />
    </>
  );
}

export default ProductDetailed;
