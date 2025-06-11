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
 * Removes undefined values from an object recursively
 * @param {Object} obj - The object to clean
 * @returns {Object} The cleaned object
 */
const removeUndefinedValues = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedValues(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, removeUndefinedValues(value)])
    );
  }
  return obj;
};

/**
 * Creates or updates a user profile in the Firebase Realtime Database.
 *
 * @param {string} userId - The unique ID of the user.
 * @param {Object} userData - An object containing the user data to save.
 * @returns {Promise<boolean>} Returns true if the operation was successful.
 */
export const createOrUpdateUserProfile = async (userId, userData) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    const timestamp = new Date().toISOString();
    const cleanedUserData = removeUndefinedValues(userData);

    if (!snapshot.exists()) {
      // Create new user profile
      await set(userRef, {
        ...cleanedUserData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    } else {
      // Update existing user profile
      await update(userRef, {
        ...cleanedUserData,
        updatedAt: timestamp,
      });
    }
    // console.log("User profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw error;
  }
};

/**
 * Fetches a user profile from the Firebase Realtime Database.
 *
 * @param {string} userId - The unique ID of the user.
 * @returns {Promise<Object>} The user profile data.
 */
export const getUserProfile = async (userId) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Updates multiple addresses in the user's profile.
 *
 * @param {string} userId - The unique ID of the user.
 * @param {Array} addresses - The updated array of addresses.
 * @returns {Promise<boolean>} Returns true if the update was successful.
 */
export const updateUserAddresses = async (userId, addresses) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    await update(userRef, {
      addresses,
      updatedAt: new Date().toISOString(),
    });
    console.log("Addresses updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user addresses:", error);
    throw error;
  }
};

/**
 * Adds a new address to the user's profile.
 *
 * @param {string} userId - The unique ID of the user.
 * @param {Object} newAddress - The address data to add.
 * @returns {Promise<Array>} The updated array of addresses.
 */
export const addUserAddress = async (userId, newAddress) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const addresses = userData.addresses || [];

      // If setting as default, unset all other defaults
      if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }

      const addressId = push(ref(db, `users/${userId}/addresses`)).key;
      const updatedAddress = { ...newAddress, id: addressId };
      const updatedAddresses = [...addresses, updatedAddress];

      await update(userRef, {
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString(),
      });

      console.log("Address added successfully");
      return updatedAddresses;
    }
    return null;
  } catch (error) {
    console.error("Error adding user address:", error);
    throw error;
  }
};

/**
 * Deletes an address from the user's profile.
 *
 * @param {string} userId - The unique ID of the user.
 * @param {string} addressId - The ID of the address to delete.
 * @returns {Promise<Array>} The updated array of addresses.
 */
export const deleteUserAddress = async (userId, addressId) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const addresses = userData.addresses || [];
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

      await update(userRef, {
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString(),
      });

      console.log("Address deleted successfully");
      return updatedAddresses;
    }
    return null;
  } catch (error) {
    console.error("Error deleting user address:", error);
    throw error;
  }
};

/**
 * Sets an address as the default address in the user's profile.
 *
 * @param {string} userId - The unique ID of the user.
 * @param {string} addressId - The ID of the address to set as default.
 * @returns {Promise<Array>} The updated array of addresses.
 */
export const setDefaultAddress = async (userId, addressId) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const addresses = userData.addresses || [];

      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      await update(userRef, {
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString(),
      });

      console.log("Default address updated successfully");
      return updatedAddresses;
    }
    return null;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};

/**
 * Fetches all users from the Firebase Realtime Database.
 * @returns {Promise<Array>} Array of user objects with their IDs.
 */
export const getAllUsers = async () => {
  const db = getDatabase(app);
  const usersRef = ref(db, 'users');

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      // Transform the object into an array and add the user ID
      return Object.entries(users).map(([id, userData]) => ({
        id,
        ...userData
      }));
    }
    return [];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}; 