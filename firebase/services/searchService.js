import { getDatabase, ref, get } from "firebase/database";
import { app } from "@/firebase/backendConfig";

export const searchProducts = async (query) => {
  const db = getDatabase(app);
  const productsRef = ref(db, "products");
  const categoriesRef = ref(db, "categories");
  const sizesRef = ref(db, "sizes");
  const colorsRef = ref(db, "colors");

  try {
    // Fetch all necessary data
    const [productsSnapshot, categoriesSnapshot, sizesSnapshot, colorsSnapshot] = await Promise.all([
      get(productsRef),
      get(categoriesRef),
      get(sizesRef),
      get(colorsRef)
    ]);

    const products = productsSnapshot.exists() ? Object.values(productsSnapshot.val()) : [];
    const categories = categoriesSnapshot.exists() ? Object.values(categoriesSnapshot.val()) : [];
    const sizes = sizesSnapshot.exists() ? Object.values(sizesSnapshot.val()) : [];
    const colors = colorsSnapshot.exists() ? Object.values(colorsSnapshot.val()) : [];

    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();

    // Filter active products
    const activeProducts = products.filter(product => 
      product.is_active !== false && product.is_active !== "false"
    );

    // Search results
    const results = {
      products: [],
      categories: [],
      sizes: [],
      colors: []
    };

    // Search in categories
    results.categories = categories.filter(category => 
      category.name && category.name.toLowerCase().includes(normalizedQuery) &&
      category.is_active !== false
    );

    // Search in sizes
    results.sizes = sizes.filter(size => 
      size.value && size.value.toLowerCase().includes(normalizedQuery) &&
      size.is_active !== false
    );

    // Search in colors
    results.colors = colors.filter(color => 
      color.name && color.name.toLowerCase().includes(normalizedQuery) &&
      color.is_active !== false
    );

    // Helper function to normalize and extract colors from a product
    const getProductColors = (product) => {
      let productColors = [];
      
      if (Array.isArray(product.colors)) {
        productColors = product.colors
          .filter(color => color != null)
          .map(color => color.toString().toLowerCase().trim());
      } else if (typeof product.colors === 'string' && product.colors.trim()) {
        productColors = [product.colors.toLowerCase().trim()];
      } else if (product.color && typeof product.color === 'string') {
        // Check if there's a singular 'color' field
        productColors = [product.color.toLowerCase().trim()];
      }
      
      return productColors.filter(color => color.length > 0);
    };

    // Helper function to normalize and extract sizes from a product
    const getProductSizes = (product) => {
      let productSizes = [];
      
      if (Array.isArray(product.sizes)) {
        productSizes = product.sizes
          .filter(size => size != null)
          .map(size => size.toString().toLowerCase().trim());
      } else if (typeof product.sizes === 'string' && product.sizes.trim()) {
        productSizes = [product.sizes.toLowerCase().trim()];
      } else if (product.size && typeof product.size === 'string') {
        // Check if there's a singular 'size' field
        productSizes = [product.size.toLowerCase().trim()];
      }
      
      return productSizes.filter(size => size.length > 0);
    };

    // Create a Set to store unique product IDs to avoid duplicates
    const uniqueProductIds = new Set();
    
    // Search in products directly by name, category, size, and color
    const directMatchingProducts = activeProducts.filter(product => {
      const productName = (product.name || '').toLowerCase();
      const productCategory = (product.category || '').toLowerCase();
      const productColors = getProductColors(product);
      const productSizes = getProductSizes(product);

      const matchesName = productName.includes(normalizedQuery);
      const matchesCategory = productCategory.includes(normalizedQuery);
      const matchesSize = productSizes.some(size => size.includes(normalizedQuery));
      const matchesColor = productColors.some(color => color.includes(normalizedQuery));

      return matchesName || matchesCategory || matchesSize || matchesColor;
    });

    // Add direct matching products
    directMatchingProducts.forEach(product => {
      if (product.id) {
        uniqueProductIds.add(product.id);
      }
    });

    // If we have category results, add products from those categories
    if (results.categories.length > 0) {
      const categoryNames = results.categories.map(cat => cat.name.toLowerCase());
      activeProducts.forEach(product => {
        const productCategory = (product.category || '').toLowerCase();
        if (categoryNames.includes(productCategory) && product.id) {
          uniqueProductIds.add(product.id);
        }
      });
    }

    // If we have size results, add products with those sizes
    if (results.sizes.length > 0) {
      const sizeValues = results.sizes.map(size => size.value.toLowerCase());
      activeProducts.forEach(product => {
        const productSizes = getProductSizes(product);
        const hasMatchingSize = productSizes.some(size => sizeValues.includes(size));
        if (hasMatchingSize && product.id) {
          uniqueProductIds.add(product.id);
        }
      });
    }

    // If we have color results, add products with those colors
    if (results.colors.length > 0) {
      const colorNames = results.colors.map(color => color.name.toLowerCase());
      activeProducts.forEach(product => {
        const productColors = getProductColors(product);
        const hasMatchingColor = productColors.some(color => {
          // Try exact match first
          if (colorNames.includes(color)) return true;
          
          // Try partial match (color contains search term or vice versa)
          return colorNames.some(searchColor => 
            color.includes(searchColor) || searchColor.includes(color)
          );
        });
        
        if (hasMatchingColor && product.id) {
          uniqueProductIds.add(product.id);
        }
      });
    }

    // Convert Set back to array of products
    results.products = activeProducts.filter(product => 
      product.id && uniqueProductIds.has(product.id)
    );

    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};