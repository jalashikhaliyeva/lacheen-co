import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";
import ProductEditTabs from "@/components/ProductEdit";
import { ProductContext } from "@/shared/context/ProductContext";
import { fetchProductById } from "@/firebase/services/firebaseProductsService";
import ProductCreateTabs from "@/components/ProductCreate";
import Breadcrumbs from "@/components/Breadcrumbs";

function ProductEdit() {
  const router = useRouter();
  const { name } = router.query;
  const { id } = router.query;
  const { setInformationData } = useContext(ProductContext);
  useEffect(() => {
    if (!router.isReady) return;
    // console.log("Router query:", router.query);
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
        <div className="bg-bodyGray h-full pb-20  mt-10">
          <Container>
            <div className="pt-7">
              <Breadcrumbs />
            </div>

            <h1 className="text-2xl font-helvetica font-medium mb-4 text-neutral-800">
              Edit Product
            </h1>

            <ProductCreateTabs />
          </Container>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default ProductEdit;
