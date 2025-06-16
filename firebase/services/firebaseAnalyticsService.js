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
 * Records a page view in Firebase
 * @param {string} pagePath - The path of the page being viewed
 * @returns {Promise<void>}
 */
export const recordPageView = async (pagePath) => {
  const db = getDatabase(app);
  const viewsRef = ref(db, "page-views");
  
  try {
    const newViewRef = push(viewsRef);
    await set(newViewRef, {
      path: pagePath,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error recording page view:", error);
  }
};

/**
 * Gets page view statistics for the dashboard
 * @returns {Promise<Object>} Object containing page view statistics by month
 */
export const getPageViewStatistics = async () => {
  const db = getDatabase(app);
  const viewsRef = ref(db, "page-views");

  try {
    const snapshot = await get(viewsRef);
    if (!snapshot.exists()) {
      return {};
    }

    const allViews = snapshot.val();
    const views = Object.values(allViews);
    
    // Group views by month
    const monthlyViews = {};
    
    views.forEach(view => {
      const date = new Date(view.timestamp);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyViews[monthKey]) {
        monthlyViews[monthKey] = 0;
      }
      monthlyViews[monthKey]++;
    });

    return monthlyViews;
  } catch (error) {
    console.error("Error fetching page view statistics:", error);
    throw error;
  }
}; 