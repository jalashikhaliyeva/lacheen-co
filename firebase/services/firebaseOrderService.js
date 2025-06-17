import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
} from "firebase/database";
import { app } from "@/firebase/backendConfig";
import { sendOrderEmail } from "./emailService";

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

    // Send email notification using EmailJS
    try {
      await sendOrderEmail(newOrder);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error("Error sending order notification email:", emailError);
      // Don't throw the error here to prevent order creation from failing
      // if email sending fails
    }

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

/**
 * Gets order statistics for the dashboard
 * @returns {Promise<Object>} Object containing various order statistics
 */
export const getOrderStatistics = async () => {
  const db = getDatabase(app);
  const ordersRef = ref(db, "all-orders");

  try {
    const snapshot = await get(ordersRef);
    if (!snapshot.exists()) {
      return {
        today: { total: 0, cash: 0, card: 0 },
        yesterday: { total: 0, cash: 0, card: 0 },
        thisMonth: { total: 0, cash: 0, card: 0 },
        lastMonth: { total: 0, cash: 0, card: 0 },
        allTime: { total: 0, cash: 0, card: 0 }
      };
    }

    const allOrders = snapshot.val();
    const orders = Object.values(allOrders).filter(order => order.status !== 'cancelled');
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const stats = {
      today: { total: 0, cash: 0, card: 0 },
      yesterday: { total: 0, cash: 0, card: 0 },
      thisMonth: { total: 0, cash: 0, card: 0 },
      lastMonth: { total: 0, cash: 0, card: 0 },
      allTime: { total: 0, cash: 0, card: 0 }
    };

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const amount = parseFloat(order.payment?.amount || 0);
      const isCard = order.payment?.method === 'card';

      // All time stats
      stats.allTime.total += amount;
      if (isCard) {
        stats.allTime.card += amount;
      } else {
        stats.allTime.cash += amount;
      }

      // This month stats
      if (orderDate >= thisMonth) {
        stats.thisMonth.total += amount;
        if (isCard) {
          stats.thisMonth.card += amount;
        } else {
          stats.thisMonth.cash += amount;
        }
      }

      // Last month stats
      if (orderDate >= lastMonth && orderDate < thisMonth) {
        stats.lastMonth.total += amount;
        if (isCard) {
          stats.lastMonth.card += amount;
        } else {
          stats.lastMonth.cash += amount;
        }
      }

      // Today's stats
      if (orderDate >= today) {
        stats.today.total += amount;
        if (isCard) {
          stats.today.card += amount;
        } else {
          stats.today.cash += amount;
        }
      }

      // Yesterday's stats
      if (orderDate >= yesterday && orderDate < today) {
        stats.yesterday.total += amount;
        if (isCard) {
          stats.yesterday.card += amount;
        } else {
          stats.yesterday.cash += amount;
        }
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw error;
  }
};

/**
 * Gets order counts by status for the dashboard
 * @returns {Promise<Object>} Object containing counts for different order statuses
 */
export const getOrderCounts = async () => {
  const db = getDatabase(app);
  const ordersRef = ref(db, "all-orders");

  try {
    const snapshot = await get(ordersRef);
    if (!snapshot.exists()) {
      return {
        total: 0,
        pending: 0,
        processing: 0,
        cancelled: 0,
        delivered: 0
      };
    }

    const allOrders = snapshot.val();
    const orders = Object.values(allOrders);

    const counts = {
      total: orders.length,
      pending: 0,
      processing: 0,
      cancelled: 0,
      delivered: 0
    };

    orders.forEach(order => {
      switch (order.status) {
        case 'pending':
          counts.pending++;
          break;
        case 'processing':
          counts.processing++;
          break;
        case 'cancelled':
          counts.cancelled++;
          break;
        case 'delivered':
          counts.delivered++;
          break;
        default:
          break;
      }
    });

    return counts;
  } catch (error) {
    console.error("Error fetching order counts:", error);
    throw error;
  }
}; 