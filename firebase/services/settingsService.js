import {
  getDatabase,
  ref,
  get,
  update,
  set,
} from "firebase/database";
import { app } from "@/firebase/backendConfig";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getDatabase(app);
const storage = getStorage(app);

/**
 * Updates the hero section content
 * @param {Object} data - { images: File[], video: File, discountQuantity: string, discountReason: string, discountDescription: string }
 * @returns {Promise<void>}
 */
export const updateHero = async (data) => {
  try {
    // Upload images
    const imageUrls = await Promise.all(
      data.images.map(async (image, index) => {
        const imageRef = storageRef(storage, `settings/hero/image${index + 1}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      })
    );

    // Upload video
    const videoRef = storageRef(storage, 'settings/hero/video');
    await uploadBytes(videoRef, data.video);
    const videoUrl = await getDownloadURL(videoRef);

    // Update database
    const heroRef = ref(db, 'settings/hero');
    await set(heroRef, {
      images: imageUrls,
      video: videoUrl,
      discountQuantity: data.discountQuantity,
      discountReason: data.discountReason,
      discountDescription: data.discountDescription,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating hero section:", error);
    throw error;
  }
};

/**
 * Updates the categories section content
 * @param {Object} data - { images: File[], video: File }
 * @returns {Promise<void>}
 */
export const updateCategories = async (data) => {
  try {
    // Get existing data first
    const existingData = await fetchSectionData('categories') || {};
    let imageUrls = existingData.images || [];
    
    // Handle images
    if (data.images && data.images.length > 0) {
      // Replace only the last image if we have exactly 1 new image
      if (data.images.length === 1 && imageUrls.length >= 1) {
        // Upload new image
        const newImageRef = storageRef(storage, `settings/categories/image2`);
        await uploadBytes(newImageRef, data.images[0]);
        const newImageUrl = await getDownloadURL(newImageRef);
        
        // Keep first existing image, replace second with new one
        imageUrls = [imageUrls[0], newImageUrl];
      } 
      // Replace both images if we have 2 new images
      else if (data.images.length === 2) {
        imageUrls = await Promise.all(
          data.images.map(async (image, index) => {
            const imageRef = storageRef(storage, `settings/categories/image${index + 1}`);
            await uploadBytes(imageRef, image);
            return getDownloadURL(imageRef);
          })
        );
      }
    }

    // Handle video
    let videoUrl = existingData.video || null;
    if (data.video) {
      const videoRef = storageRef(storage, 'settings/categories/video');
      await uploadBytes(videoRef, data.video);
      videoUrl = await getDownloadURL(videoRef);
    }

    // Update database
    const categoriesRef = ref(db, 'settings/categories');
    await set(categoriesRef, {
      images: imageUrls,
      video: videoUrl,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating categories section:", error);
    throw error;
  }
};

/**
 * Updates the attitude section content
 * @param {Object} data - { image: File, video: File }
 * @returns {Promise<void>}
 */
export const updateAttitude = async (data) => {
  try {
    // Get existing data first
    const existingData = await fetchSectionData('attitude') || {};
    
    let imageUrl = existingData.image || null;
    let videoUrl = existingData.video || null;

    // Handle image update
    if (data.image) {
      const imageRef = storageRef(storage, 'settings/attitude/image');
      await uploadBytes(imageRef, data.image);
      imageUrl = await getDownloadURL(imageRef);
    } else if (data.existingImage === null) {
      // This means the existing image was removed
      imageUrl = null;
    }

    // Handle video update
    if (data.video) {
      const videoRef = storageRef(storage, 'settings/attitude/video');
      await uploadBytes(videoRef, data.video);
      videoUrl = await getDownloadURL(videoRef);
    } else if (data.existingVideo === null) {
      // This means the existing video was removed
      videoUrl = null;
    }

    // Update database
    const attitudeRef = ref(db, 'settings/attitude');
    await set(attitudeRef, {
      image: imageUrl,
      video: videoUrl,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating attitude section:", error);
    throw error;
  }
};

/**
 * Fetches all settings data
 * @returns {Promise<Object>} Object containing hero, categories, and attitude data
 */
export const fetchSettings = async () => {
  try {
    const settingsRef = ref(db, 'settings');
    const snapshot = await get(settingsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

/**
 * Fetches a specific section's data
 * @param {string} section - 'hero' | 'categories' | 'attitude'
 * @returns {Promise<Object|null>} Section data or null if not found
 */
export const fetchSectionData = async (section) => {
  try {
    const sectionRef = ref(db, `settings/${section}`);
    const snapshot = await get(sectionRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${section} section:`, error);
    throw error;
  }
}; 