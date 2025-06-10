import {
  getDatabase,
  ref,
  get,
  update,
  push,
  set,
  remove,
} from "firebase/database";
import { app } from "@/firebase/backendConfig";

export const fetchProducts = async () => {
  const db = getDatabase(app);
  const productsRef = ref(db, "products");

  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const fetchedProducts = snapshot.val();
      console.log(fetchedProducts, "fetchedProducts");
      return fetchedProducts ? Object.values(fetchedProducts) : [];
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
};

/**
 * Updates a product in the Firebase Realtime Database.
 *
 * @param {string} id - The unique ID of the product to update.
 * @param {Object} updatedData - An object containing the product fields to update.
 * @returns {Promise<boolean>} Returns true if the update was successful.
 */
export const updateProduct = async (id, updatedData) => {
  const db = getDatabase(app);
  const productRef = ref(db, `products/${id}`);

  try {
    await update(productRef, updatedData);
    console.log("Product updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Creates a new product in the Firebase Realtime Database.
 *
 * @param {Object} productData - An object containing the product data.
 *                              If an `id` field is provided, it will be used;
 *                              otherwise, a new unique key is generated.
 * @returns {Promise<Object>} Returns the product data, including the unique id.
 */
export const createProduct = async (productData) => {
  const db = getDatabase(app);
  const productsRef = ref(db, "products");

  try {
    if (productData.id) {
      const productRef = ref(db, `products/${productData.id}`);
      await set(productRef, productData);
    } else {
      const newProductRef = push(productsRef);
      productData.id = newProductRef.key;
      await set(newProductRef, productData);
    }
    console.log("Product created successfully");
    return productData;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Fetches a single product from the Firebase Realtime Database by its ID.
 *
 * @param {string} id - The unique product ID.
 * @returns {Promise<Object>} The product data.
 */
export const fetchProductById = async (id) => {
  const db = getDatabase(app);
  const productRef = ref(db, `products/${id}`);

  try {
    const snapshot = await get(productRef);
    console.log(snapshot, "snapshot fetch product by id");
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

/**
 * Fetches related products based on a common parent ID.
 *
 * This function returns the parent product (if it exists) and all child products
 * that have a "parents_id" matching the commonParentId.
 *
 * @param {string} commonParentId - The id that all related products share.
 * @returns {Promise<Array>} An array of related products.
 */
export const fetchRelatedProducts = async (commonParentId) => {
  const db = getDatabase(app);
  const productsRef = ref(db, "products");

  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const allProducts = Object.values(snapshot.val());
      const relatedProducts = allProducts.filter(
        (prod) =>
          prod.id === commonParentId || prod.parents_id === commonParentId
      );
      return relatedProducts;
    } else {
      console.log("No products available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

/**
 * Deletes a product from the Firebase Realtime Database by its ID.
 *
 * @param {string} id - The unique ID of the product to delete.
 * @returns {Promise<boolean>} Returns true if the deletion was successful.
 */
export const deleteProduct = async (id) => {
  const db = getDatabase(app);
  const productRef = ref(db, `products/${id}`);

  try {
    await remove(productRef);
    console.log("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Deletes multiple products from the Firebase Realtime Database.
 *
 * @param {Array<string>} ids - An array of product IDs to delete.
 * @returns {Promise<boolean>} Returns true if all deletions were successful.
 */
export const deleteMultipleProducts = async (ids) => {
  const db = getDatabase(app);
  // Create an updates object where each product path is set to null to delete it.
  const updates = {};
  ids.forEach((id) => {
    updates[`products/${id}`] = null;
  });

  try {
    await update(ref(db), updates);
    console.log("Multiple products deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categorySlug) => {
  const db = getDatabase(app);
  const productsRef = ref(db, "products");

  try {
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) {
      console.log("🚫 Heç bir məhsul yoxdur.");
      return [];
    }

    const allProductsObj = snapshot.val();
    const allProducts = Object.values(allProductsObj);

    const slugToNameNormalized = categorySlug
      .replace(/-/g, " ")
      .trim()
      .toLowerCase();

    const filteredProducts = allProducts.filter((product) => {
      if (!product.category || typeof product.category !== "string") {
        return false;
      }

      const productCategoryNormalized = product.category.trim().toLowerCase();

      const matchesCategory =
        productCategoryNormalized === slugToNameNormalized;

      const isActive =
        product.is_active === false || product.is_active === "false"
          ? false
          : true;

      return matchesCategory && isActive;
    });

    console.log(
      `🛒 Category slug="${categorySlug}" üçün tapılan filtrlənmiş məhsullar:`,
      filteredProducts
    );
    return filteredProducts;
  } catch (error) {
    console.error(
      `❌ Error fetching products for category slug="${categorySlug}":`,
      error
    );
    throw error;
  }
};

export const fetchProductsByFilter = async (filter) => {
  const db = getDatabase(app);
  const productsRef = ref(db, "products");

  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const allProducts = Object.values(snapshot.val());

      let filteredProducts = [];

      switch (filter) {
        case "new":
          filteredProducts = allProducts.filter(
            (product) => product.is_new === true && product.is_active === true
          );
          break;
        case "special":
          filteredProducts = allProducts.filter(
            (product) => product.sale > 0 && product.is_active === true
          );
          break;
        default:
          filteredProducts = allProducts.filter(
            (product) => product.is_active === true
          );
      }

      console.log(`Products with filter "${filter}":`, filteredProducts);
      return filteredProducts;
    } else {
      console.log("No products available");
      return [];
    }
  } catch (error) {
    console.error(`Error fetching products with filter "${filter}":`, error);
    throw error;
  }
};
