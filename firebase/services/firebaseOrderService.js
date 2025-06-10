import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
} from "firebase/database";
import { app } from "@/firebase/backendConfig";

/**
 * Creates a new order in Firebase
 * @param {Object} orderData - The order data including user info, items, and delivery details
 * @returns {Promise<Object>} The created order with id
 */
export const createOrder = async (orderData) => {
  const db = getDatabase(app);
  const ordersRef = ref(db, "all-orders");

  try {
    const newOrderRef = push(ordersRef);
    const newOrder = {
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    await set(newOrderRef, newOrder);
    return { id: newOrderRef.key, ...newOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Fetches all orders for a specific user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of user orders
 */
export const getUserOrders = async (userId) => {
  const db = getDatabase(app);
  const ordersRef = ref(db, "all-orders");

  try {
    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
      const allOrders = snapshot.val();
      // Filter orders by userId and convert to array with IDs
      const userOrders = Object.entries(allOrders)
        .filter(([_, order]) => order.userId === userId)
        .map(([id, order]) => ({
          id,
          ...order
        }));
      return userOrders;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Updates the status of an order
 * @param {string} orderId - The ID of the order to update
 * @param {string} newStatus - The new status to set
 * @returns {Promise<boolean>} Returns true if successful
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const db = getDatabase(app);
  const orderRef = ref(db, `all-orders/${orderId}`);

  try {
    await update(orderRef, { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}; 