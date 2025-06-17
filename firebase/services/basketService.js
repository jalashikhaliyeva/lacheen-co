import {
  getDatabase,
  ref,
  get,
  set,
  remove,
  push,
  update,
} from "firebase/database";
import { app } from "@/firebase/backendConfig";

/**
 * Adds a product to the user's basket
 * @param {string} userId - The ID of the user
 * @param {Object} product - The product to add to basket
 * @returns {Promise<Object>} Returns the added basket item
 */
export const addToBasket = async (userId, product) => {
  const db = getDatabase(app);
  const basketRef = ref(db, `basket/${userId}/${product.id}`);

  try {
    const basketItem = {
      userId,
      productId: product.id,
      name: product.name,
      price: product.sale ? 
        (parseFloat(product.sellingPrice) - parseFloat(product.sale)).toFixed(2) : 
        product.sellingPrice,
      image: product.images?.[0]?.url || product.images?.[0],
      size: product.selectedSize?.value || product.selectedSize,
      color: product.color?.name || product.baseColor,
      quantity: 1,
      createdAt: new Date().toISOString()
    };

    await set(basketRef, basketItem);
    return { id: product.id, ...basketItem };
  } catch (error) {
    console.error("Error adding to basket:", error);
    throw error;
  }
};

/**
 * Gets all items in the user's basket
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of basket items
 */
export const getBasketItems = async (userId) => {
  const db = getDatabase(app);
  const basketRef = ref(db, `basket/${userId}`);

  try {
    const snapshot = await get(basketRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, item]) => ({
        id,
        ...item
      }));
    }
    return [];
  } catch (error) {
    console.error("Error getting basket items:", error);
    throw error;
  }
};

/**
 * Updates the quantity of an item in the basket
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product
 * @param {number} quantity - The new quantity
 * @returns {Promise<boolean>} Returns true if successful
 */
export const updateQuantity = async (userId, productId, quantity) => {
  const db = getDatabase(app);
  const basketRef = ref(db, `basket/${userId}/${productId}`);

  try {
    await update(basketRef, { quantity });
    return true;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error;
  }
};

/**
 * Removes an item from the basket
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product to remove
 * @returns {Promise<boolean>} Returns true if successful
 */
export const removeFromBasket = async (userId, productId) => {
  const db = getDatabase(app);
  const basketRef = ref(db, `basket/${userId}/${productId}`);

  try {
    await remove(basketRef);
    return true;
  } catch (error) {
    console.error("Error removing from basket:", error);
    throw error;
  }
};

/**
 * Clears all items from the user's basket
 * @param {string} userId - The ID of the user
 * @returns {Promise<boolean>} Returns true if successful
 */
export const clearBasket = async (userId) => {
  const db = getDatabase(app);
  const basketRef = ref(db, `basket/${userId}`);

  try {
    await remove(basketRef);
    return true;
  } catch (error) {
    console.error("Error clearing basket:", error);
    throw error;
  }
}; 