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
      category.name.toLowerCase().includes(normalizedQuery) &&
      category.is_active !== false
    );

    // Search in sizes
    results.sizes = sizes.filter(size => 
      size.value.toLowerCase().includes(normalizedQuery) &&
      size.is_active !== false
    );

    // Search in colors
    results.colors = colors.filter(color => 
      color.name.toLowerCase().includes(normalizedQuery) &&
      color.is_active !== false
    );

    // Search in products
    results.products = activeProducts.filter(product => {
      const productName = product.name?.toLowerCase() || '';
      const productCategory = product.category?.toLowerCase() || '';
      const productSizes = product.sizes?.map(size => size.toLowerCase()) || [];
      const productColors = product.colors?.map(color => color.toLowerCase()) || [];

      const matchesName = productName.includes(normalizedQuery);
      const matchesCategory = productCategory.includes(normalizedQuery);
      const matchesSize = productSizes.some(size => size.includes(normalizedQuery));
      const matchesColor = productColors.some(color => color.includes(normalizedQuery));

      return matchesName || matchesCategory || matchesSize || matchesColor;
    });

    // If we have color results, also show products with those colors
    if (results.colors.length > 0) {
      console.log('Found colors:', results.colors);
      const colorNames = results.colors.map(color => color.name.toLowerCase());
      console.log('Color names to search for:', colorNames);
      const productsWithColors = activeProducts.filter(product => {
        const productColors = product.colors?.map(color => color.toLowerCase()) || [];
        console.log('Product:', product.name, 'has colors:', productColors);
        const matches = productColors.some(color => colorNames.includes(color));
        console.log('Product matches:', matches);
        return matches;
      });
      
      console.log('Products with matching colors:', productsWithColors);
      
      // Merge with existing product results, removing duplicates
      const allProducts = [...results.products, ...productsWithColors];
      results.products = Array.from(new Map(allProducts.map(item => [item.id, item])).values());
      console.log('Final products after color matching:', results.products);
    }

    // If we have size results, also show products with those sizes
    if (results.sizes.length > 0) {
      const sizeValues = results.sizes.map(size => size.value.toLowerCase());
      const productsWithSizes = activeProducts.filter(product => 
        product.sizes?.some(size => 
          sizeValues.includes(size.toLowerCase())
        )
      );
      
      // Merge with existing product results, removing duplicates
      const allProducts = [...results.products, ...productsWithSizes];
      results.products = Array.from(new Map(allProducts.map(item => [item.id, item])).values());
    }

    // If we have category results, also show products from those categories
    if (results.categories.length > 0) {
      const categoryNames = results.categories.map(cat => cat.name.toLowerCase());
      const productsFromCategories = activeProducts.filter(product => 
        categoryNames.includes(product.category?.toLowerCase())
      );
      
      // Merge with existing product results, removing duplicates
      const allProducts = [...results.products, ...productsFromCategories];
      results.products = Array.from(new Map(allProducts.map(item => [item.id, item])).values());
    }

    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
}; 