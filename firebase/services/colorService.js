// src/services/colorService.js
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
 * Fetches all colors from Firebase
 * @returns {Promise<Array>} Array of colors (each has { id, name, code, is_active })
 */
export const fetchColors = async () => {
  const db = getDatabase(app);
  const colorsRef = ref(db, "colors");

  try {
    const snapshot = await get(colorsRef);
    if (snapshot.exists()) {
      const colorsData = snapshot.val();
      // Convert object to array and include the id
      return Object.entries(colorsData).map(([id, color]) => ({
        id,
        ...color,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
};

/**
 * Creates a new color in Firebase
 * @param {Object} colorData - { name: string, code: string (hex), is_active?: boolean }
 * @returns {Promise<Object>} The created color with id
 */
export const createColor = async (colorData) => {
  const db = getDatabase(app);
  const colorsRef = ref(db, "colors");

  try {
    const newColorRef = push(colorsRef);
    const newColor = {
      name: colorData.name,
      code: colorData.code,
      is_active: colorData.is_active !== undefined ? colorData.is_active : true,
    };
    await set(newColorRef, newColor);
    return { id: newColorRef.key, ...newColor };
  } catch (error) {
    console.error("Error creating color:", error);
    throw error;
  }
};

/**
 * Updates a color in Firebase
 * @param {string} id - Color ID
 * @param {Object} updatedData - Partial color data (e.g. { name, code, is_active })
 * @returns {Promise<void>}
 */
export const updateColor = async (id, updatedData) => {
  const db = getDatabase(app);
  const colorRef = ref(db, `colors/${id}`);

  try {
    await update(colorRef, updatedData);
  } catch (error) {
    console.error("Error updating color:", error);
    throw error;
  }
};

/**
 * Deletes a color from Firebase
 * @param {string} id - Color ID
 * @returns {Promise<void>}
 */
export const deleteColor = async (id) => {
  const db = getDatabase(app);
  const colorRef = ref(db, `colors/${id}`);

  try {
    await remove(colorRef);
  } catch (error) {
    console.error("Error deleting color:", error);
    throw error;
  }
};

/**
 * Fetches a single color by ID
 * @param {string} id - Color ID
 * @returns {Promise<Object|null>} { id, name, code, is_active } or null if not found
 */
export const fetchColorById = async (id) => {
  const db = getDatabase(app);
  const colorRef = ref(db, `colors/${id}`);

  try {
    const snapshot = await get(colorRef);
    if (snapshot.exists()) {
      return { id, ...snapshot.val() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching color:", error);
    throw error;
  }
};

/**
 * Toggles the “active” status of a color
 * @param {string} id - Color ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<void>}
 */
export const toggleColorActiveStatus = async (id, isActive) => {
  const db = getDatabase(app);
  const activeRef = ref(db, `colors/${id}/is_active`);

  try {
    await set(activeRef, isActive);
  } catch (error) {
    console.error("Error toggling color status:", error);
    throw error;
  }
};
