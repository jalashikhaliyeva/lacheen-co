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


export const fetchCategories = async () => {
  const db = getDatabase(app);
  const categoriesRef = ref(db, "categories");

  try {
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      const categoriesData = snapshot.val();
      // Convert object to array and include the id
      return Object.entries(categoriesData).map(([id, category]) => ({
        id,
        ...category,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Creates a new category in Firebase
 * @param {Object} categoryData - Category data {name, slug}
 * @returns {Promise<Object>} The created category with id
 */

export const createCategory = async (categoryData) => {
  const db = getDatabase(app);
  const categoriesRef = ref(db, "categories");

  try {
    const newCategoryRef = push(categoriesRef);
    const newCategory = {
      ...categoryData,
      productCount: 0,
      is_active: true, // Default to active
    };
    await set(newCategoryRef, newCategory);
    return { id: newCategoryRef.key, ...newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
/**
 * Updates a category in Firebase
 * @param {string} id - Category ID
 * @param {Object} updatedData - Updated category data
 * @returns {Promise<void>}
 */
export const updateCategory = async (id, updatedData) => {
  const db = getDatabase(app);
  const categoryRef = ref(db, `categories/${id}`);

  try {
    await update(categoryRef, updatedData);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * Deletes a category from Firebase
 * @param {string} id - Category ID to delete
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  const db = getDatabase(app);
  const categoryRef = ref(db, `categories/${id}`);

  try {
    await remove(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

/**
 * Fetches a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category data
 */
export const fetchCategoryById = async (id) => {
  const db = getDatabase(app);
  const categoryRef = ref(db, `categories/${id}`);

  try {
    const snapshot = await get(categoryRef);
    if (snapshot.exists()) {
      return { id, ...snapshot.val() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const toggleCategoryActiveStatus = async (id, isActive) => {
  const db = getDatabase(app);
  const categoryRef = ref(db, `categories/${id}/is_active`);

  try {
    await set(categoryRef, isActive);
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};
