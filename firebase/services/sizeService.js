// src/services/sizeService.js
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
  
  /**
   * Fetches all sizes from Firebase
   * @returns {Promise<Array>} Array of sizes
   */
  export const fetchSizes = async () => {
    const db = getDatabase(app);
    const sizesRef = ref(db, "sizes");
  
    try {
      const snapshot = await get(sizesRef);
      if (snapshot.exists()) {
        const sizesData = snapshot.val();
        // Convert object to array and include the id
        return Object.entries(sizesData).map(([id, size]) => ({
          id,
          ...size,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching sizes:", error);
      throw error;
    }
  };
  
  /**
   * Creates a new size in Firebase
   * @param {Object} sizeData - Size data {value, is_active}
   * @returns {Promise<Object>} The created size with id
   */
  export const createSize = async (sizeData) => {
    const db = getDatabase(app);
    const sizesRef = ref(db, "sizes");
  
    try {
      const newSizeRef = push(sizesRef);
      const newSize = {
        value: sizeData.value,
        is_active: sizeData.is_active !== undefined ? sizeData.is_active : true,
      };
      await set(newSizeRef, newSize);
      return { id: newSizeRef.key, ...newSize };
    } catch (error) {
      console.error("Error creating size:", error);
      throw error;
    }
  };
  
  /**
   * Updates a size in Firebase
   * @param {string} id - Size ID
   * @param {Object} updatedData - Updated size data
   * @returns {Promise<void>}
   */
  export const updateSize = async (id, updatedData) => {
    const db = getDatabase(app);
    const sizeRef = ref(db, `sizes/${id}`);
  
    try {
      await update(sizeRef, updatedData);
    } catch (error) {
      console.error("Error updating size:", error);
      throw error;
    }
  };
  
  /**
   * Deletes a size from Firebase
   * @param {string} id - Size ID to delete
   * @returns {Promise<void>}
   */
  export const deleteSize = async (id) => {
    const db = getDatabase(app);
    const sizeRef = ref(db, `sizes/${id}`);
  
    try {
      await remove(sizeRef);
    } catch (error) {
      console.error("Error deleting size:", error);
      throw error;
    }
  };
  
  /**
   * Fetches a single size by ID
   * @param {string} id - Size ID
   * @returns {Promise<Object>} Size data
   */
  export const fetchSizeById = async (id) => {
    const db = getDatabase(app);
    const sizeRef = ref(db, `sizes/${id}`);
  
    try {
      const snapshot = await get(sizeRef);
      if (snapshot.exists()) {
        return { id, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching size:", error);
      throw error;
    }
  };
  
  /**
   * Toggles size active status
   * @param {string} id - Size ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<void>}
   */
  export const toggleSizeActiveStatus = async (id, isActive) => {
    const db = getDatabase(app);
    const sizeRef = ref(db, `sizes/${id}/is_active`);
  
    try {
      await set(sizeRef, isActive);
    } catch (error) {
      console.error("Error toggling size status:", error);
      throw error;
    }
  };