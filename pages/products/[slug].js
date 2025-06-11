import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import ProductDetailed from "@/components/ProductDetailed";
import Container from "@/components/Container";
import { useRouter } from "next/router";
import { fetchProductById, fetchProducts } from "@/firebase/services/firebaseProductsService";
import { fetchCategories } from "@/firebase/services/categoriesService";

export default function ProductSingle({ categories, modalNewProducts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const productData = await fetchProductById(slug);
        console.log(productData, "productData");
        
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="relative">
        <main>
          <Header />
          <NavList />
          <Container>
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </Container>
          <Footer />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <main>
          <Header />
          <NavList />
          <Container>
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-red-500">{error}</p>
            </div>
          </Container>
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="relative">
      <main>
        <Header modalNewProducts={modalNewProducts} categories={categories} />
        <NavList />
        {product && <ProductDetailed product={product} />}
        <Footer />
      </main>
    </div>
  );
}




export async function getServerSideProps() {
  try {
    const [categories, allProducts] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
    ]);

    const last10Products = allProducts.slice(0, 10);

    const newProducts = allProducts.filter((p) => p.is_new).slice(-4);

    const modalNewProducts = allProducts.filter((p) => p.is_new).slice(-6);

    return {
      props: {
        categories,
        products: last10Products,
        newProducts,
        modalNewProducts,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data on server:", error);
    return {
      props: {
        categories: [],
        products: [],
        newProducts: [],
        modalNewProducts: [],
      },
    };
  }
}
