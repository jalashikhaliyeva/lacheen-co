import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";

import { ProductContext } from "@/shared/context/ProductContext";
import { fetchProductById } from "@/firebase/services/firebaseProductsService";
import ProductEditTabs from "@/components/ProductEdit";
import Breadcrumbs from "@/components/Breadcrumbs";

function ProductEdit() {
  const router = useRouter();
  const { name } = router.query;
  const { id } = router.query;
  const { setInformationData } = useContext(ProductContext);
  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready
    // console.log("Router query:", router.query); // Debug the query parameters
    // console.log(id, "id from router");

    if (id) {
      fetchProductById(id)
        .then((productData) => {
          // console.log("Product data retrieved:", productData);
          setInformationData(productData);
        })
        .catch((error) => console.error("Error in fetchProductById:", error));
    }
  }, [router.isReady, id, setInformationData, router.query]);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-bodyGray h-full pb-20 pt-5">
          <Container>
            <div className="pt-7">
              <Breadcrumbs />
            </div>

            <h1 className="text-2xl font-helvetica font-medium mb-4">
              Edit Product
            </h1>
            {/* Optionally, show product name here */}
            {/* {name ? (
              <p className="text-lg">Editing product: {name}</p>
            ) : (
              <p className="text-lg">No product selected.</p>
            )} */}
            <ProductEditTabs />
          </Container>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default ProductEdit;
