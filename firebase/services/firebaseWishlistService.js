import {
  getDatabase,
  ref,
  get,
  set,
  remove,
  push,
} from "firebase/database";
import { app } from "@/firebase/backendConfig";

/**
 * Adds a product to the user's wishlist
 * @param {string} userId - The ID of the user
 * @param {Object} product - The product to add to wishlist
 * @returns {Promise<boolean>} Returns true if successful
 */
export const addToWishlist = async (userId, product) => {
  const db = getDatabase(app);
  const wishlistRef = ref(db, `wishlist/${userId}/${product.id}`);

  try {
    await set(wishlistRef, product);
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

/**
 * Removes a product from the user's wishlist
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product to remove
 * @returns {Promise<boolean>} Returns true if successful
 */
export const removeFromWishlist = async (userId, productId) => {
  const db = getDatabase(app);
  const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);

  try {
    await remove(wishlistRef);
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

/**
 * Gets all products in the user's wishlist
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of wishlist products
 */
export const getWishlist = async (userId) => {
  const db = getDatabase(app);
  const wishlistRef = ref(db, `wishlist/${userId}`);

  try {
    const snapshot = await get(wishlistRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error("Error getting wishlist:", error);
    throw error;
  }
};

/**
 * Checks if a product is in the user's wishlist
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product to check
 * @returns {Promise<boolean>} Returns true if product is in wishlist
 */
export const isInWishlist = async (userId, productId) => {
  const db = getDatabase(app);
  const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);

  try {
    const snapshot = await get(wishlistRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking wishlist:", error);
    throw error;
  }
}; 