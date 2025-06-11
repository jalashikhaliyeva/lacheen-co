import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";
import ProductDetailTable from "@/components/ProductDetailTable";
import Spinner from "@/components/Spinner";
import {
  fetchProductById,
  fetchRelatedProducts,
} from "@/firebase/services/firebaseProductsService";
import Breadcrumbs from "@/components/Breadcrumbs";

function ProductDetailed() {
  const router = useRouter();
  // Expect product id from router.query.
  const { id } = router.query;

  const [productData, setProductData] = useState(null);
  const [otherColors, setOtherColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the product by id.
  useEffect(() => {
    if (!id) return; // Wait until the id is available.
    setLoading(true);
    fetchProductById(id)
      .then((product) => {
        setProductData(product);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // When productData is available, fetch the related products based on the common parent ID.
  useEffect(() => {
    if (!productData) return;
    // Determine the common parent id:
    // • If the product is a child then use its "parents_id" field.
    // • Otherwise (the product is a parent) use its own id.
    const commonParentId = productData.parents_id || productData.id;

    fetchRelatedProducts(commonParentId)
      .then((relatedProducts) => {
        // Remove the currently displayed product from the related list.
        const filtered = relatedProducts.filter(
          (prod) => prod.id !== productData.id
        );
        setOtherColors(filtered);
      })
      .catch((err) => {
        console.error("Error fetching related products:", err);
      });
  }, [productData]);

  // console.log(productData, "productData");
  

  // Render a spinner while loading.
  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <Container>
            <Spinner />
          </Container>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // If there's an error, display the error message.
  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <Container>
            <p>{error}</p>
          </Container>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // If no productData is found, notify the user.
  if (!productData) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <Container>
            <p>No product found.</p>
          </Container>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // Once we have productData, render the detail.
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-bodyGray pt-7">
          <Container>
          <div className="pt-7">
              <Breadcrumbs />
              {/* Your page content goes here */}
            </div>

            {/* <h1 className="text-2xl font-bold mb-4">Product Detailed</h1> */}
            {/* <p className="text-lg mb-4">Product: {productData.name}</p> */}
            <ProductDetailTable
              product={productData}
              otherColors={otherColors}
            />
          </Container>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default ProductDetailed;
