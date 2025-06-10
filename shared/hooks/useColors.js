import { useState, useEffect } from "react";
import { fetchColors } from "@/firebase/services/colorService";

export const useColors = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const colorsData = await fetchColors();
        // Filter only active colors and map to get just the names
        const activeColors = colorsData
          .filter((color) => color.is_active)
          .map((color) => color.name);
        setColors(activeColors);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadColors();
  }, []);

  return { colors, loading, error };
}; 