// src/hooks/useSizes.js
import { useState, useEffect } from "react";
import { fetchSizes } from "@/firebase/services/sizeService";

export const useSizes = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSizes = async () => {
      try {
        const sizesData = await fetchSizes();
        // Filter only active sizes and map to get just the values
        const activeSizes = sizesData
          .filter((size) => size.is_active)
          .map((size) => size.value);
        setSizes(activeSizes);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadSizes();
  }, []);

  return { sizes, loading, error };
};
