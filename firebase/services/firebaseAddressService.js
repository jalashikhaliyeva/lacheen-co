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
 * Gets all addresses for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of user addresses
 */
export const getUserAddresses = async (userId) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.addresses || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting addresses:", error);
    throw error;
  }
};

/**
 * Adds a new address for the user
 * @param {string} userId - The ID of the user
 * @param {Object} address - The address object to add
 * @returns {Promise<Array>} Returns updated array of addresses
 */
export const addAddress = async (userId, address) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = snapshot.val();
    const addresses = userData.addresses || [];
    const newAddress = {
      ...address,
      id: push(ref(db, 'temp')).key, // Generate a unique ID
      createdAt: new Date().toISOString()
    };

    const updatedAddresses = [...addresses, newAddress];
    await set(ref(db, `users/${userId}/addresses`), updatedAddresses);
    return updatedAddresses;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

/**
 * Removes an address from the user's addresses
 * @param {string} userId - The ID of the user
 * @param {string} addressId - The ID of the address to remove
 * @returns {Promise<Array>} Returns updated array of addresses
 */
export const removeAddress = async (userId, addressId) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = snapshot.val();
    const addresses = userData.addresses || [];
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

    await set(ref(db, `users/${userId}/addresses`), updatedAddresses);
    return updatedAddresses;
  } catch (error) {
    console.error("Error removing address:", error);
    throw error;
  }
};

/**
 * Updates an existing address
 * @param {string} userId - The ID of the user
 * @param {string} addressId - The ID of the address to update
 * @param {Object} addressData - The updated address data
 * @returns {Promise<Array>} Returns updated array of addresses
 */
export const updateAddress = async (userId, addressId, addressData) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = snapshot.val();
    const addresses = userData.addresses || [];
    const updatedAddresses = addresses.map(addr => 
      addr.id === addressId 
        ? { ...addr, ...addressData, updatedAt: new Date().toISOString() }
        : addr
    );

    await set(ref(db, `users/${userId}/addresses`), updatedAddresses);
    return updatedAddresses;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

/**
 * Sets an address as default
 * @param {string} userId - The ID of the user
 * @param {string} addressId - The ID of the address to set as default
 * @returns {Promise<Array>} Returns updated array of addresses
 */
export const setDefaultAddress = async (userId, addressId) => {
  const db = getDatabase(app);
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = snapshot.val();
    const addresses = userData.addresses || [];
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    await set(ref(db, `users/${userId}/addresses`), updatedAddresses);
    return updatedAddresses;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
}; 