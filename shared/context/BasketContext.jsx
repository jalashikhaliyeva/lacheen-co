import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthClient } from './AuthContext';
import { getBasketItems } from '@/firebase/services/basketService';

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [basketItems, setBasketItems] = useState([]);
  const { user } = useAuthClient();

  useEffect(() => {
    if (user) {
      loadBasketItems();
    }
  }, [user]);

  const loadBasketItems = async () => {
    try {
      const items = await getBasketItems(user.uid);
      setBasketItems(items);
    } catch (error) {
      console.error('Error loading basket items:', error);
    }
  };

  const updateBasketItems = (newItems) => {
    setBasketItems(newItems);
  };

  return (
    <BasketContext.Provider value={{ basketItems, updateBasketItems, loadBasketItems }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
} 