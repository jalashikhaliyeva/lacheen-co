import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";
import WomenShoesTable from "@/components/ProductsTable";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTranslation } from "react-i18next";

function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryName, setCategoryName] = useState("");
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    fetchProducts()
      .then((productsArray) => {
        setProducts(productsArray);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    if (!products) return;

    let filtered = [...products];
    let filterType = "all";

    if (query.filter === "new") {
      filtered = products.filter((product) => product.is_new === true);
      filterType = "new";
    } else if (query.filter === "notupdated") {
      filtered = products.filter(
        (product) => !product.lastUpdated || product.needsUpdate
      );
      filterType = "notupdated";
    } else if (query.category) {
      filtered = products.filter(
        (product) => product.category_id === query.category
      );
      filterType = `category-${query.category}`;
    }

    setFilteredProducts(filtered);
    setActiveFilter(filterType);
  }, [products, query]);

  if (products === null) {
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

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-bodyGray mt-10">
          <Container>
            <div className="pt-7">
              <Breadcrumbs />
            </div>

            {filteredProducts.length === 0 && activeFilter !== "all" ? (
              <div className="p-8 text-center">
                <h3 className="text-xl font-normal font-gilroy">
                  {activeFilter.startsWith("category")
                    ? t("no_products_found_in_this_category")
                    : t("no_products_found", { filter: activeFilter })}
                </h3>
              </div>
            ) : (
              <WomenShoesTable
                mockProducts={
                  filteredProducts.length > 0 ? filteredProducts : products
                }
                activeFilter={activeFilter}
              />
            )}
          </Container>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Products;
