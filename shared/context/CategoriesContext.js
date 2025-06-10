// contexts/CategoriesContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories } from '@/firebase/services/categoriesService';

const CategoriesContext = createContext();

export function CategoriesProvider({ children, initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(!initialCategories.length);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialCategories.length) {
      loadCategories();
    }
  }, [initialCategories.length]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    categories,
    loading,
    error,
    refetch: loadCategories
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}