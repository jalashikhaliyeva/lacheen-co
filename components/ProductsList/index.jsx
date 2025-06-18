import React, { useState, useEffect, useRef, useMemo } from "react";
import ProductCardSingle from "../ProductCardSingle";
import { useTranslation } from "react-i18next";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsByFilter,
} from "@/firebase/services/firebaseProductsService";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
} from "@/firebase/services/firebaseWishlistService";
import { useAuthClient } from "@/shared/context/AuthContext";
import { useCategories } from "@/shared/context/CategoriesContext";
import CustomToast from "../CustomToast/CustomToast";

function ProductList({
  layout,
  selectedCategory,
  onFilterChange,
  activeFilters,
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { user } = useAuthClient(); // Get the current user
  const { categories } = useCategories(); // Get categories for name resolution
  const [wishlist, setWishlist] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const loaderRef = useRef(null);
  const ITEMS_PER_PAGE = 8;
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const closeToast = () => setShowToast(false);

  // Function to get category display name based on current language
  const getCategoryDisplayName = (categorySlug) => {
    if (!categorySlug || categorySlug === "viewAll") {
      return t("nav.view_all") || "All Products";
    }

    switch (categorySlug) {
      case "new":
        return t("nav.new") || "New Products";
      case "special":
        return t("nav.special_prices") || "Special Offers";
      default:
        // Find the category by slug and return the appropriate name
        const category = categories.find(cat => 
          (cat.slug?.[currentLang] === categorySlug) ||
          (cat.slug?.az === categorySlug) ||
          (cat.slug?.en === categorySlug) ||
          (cat.slug === categorySlug)
        );
        
        if (category) {
          return category.name?.[currentLang] || category.name?.az || category.name || categorySlug;
        }
        
        // Fallback: convert slug to readable name
        return categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, " ");
    }
  };

  // Load wishlist when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const wishlistItems = await getWishlist(user.uid);
          setWishlist(wishlistItems);
        } catch (error) {
          console.error("Error loading wishlist:", error);
        }
      } else {
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      // Handle case when user is not logged in
      setToastMessage(t("wishlist.login_required"));
      setToastProduct(product);
      setShowToast(true);
      return;
    }

    try {
      const isInWishlistItem = await isInWishlist(user.uid, product.id);

      if (isInWishlistItem) {
        await removeFromWishlist(user.uid, product.id);
        setWishlist(wishlist.filter((item) => item.id !== product.id));
        setToastMessage(t("wishlist.removed"));
      } else {
        await addToWishlist(user.uid, product);
        setWishlist([...wishlist, product]);
        setToastMessage(t("wishlist.added"));
      }

      setToastProduct(product);
      setShowToast(true);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setToastMessage(t("wishlist.error"));
      setToastProduct(product);
      setShowToast(true);
    }
  };

  const handleFilterChange = (filters) => {
    onFilterChange(filters);
    setPage(1);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setInitialLoading(true);
      setError(null);

      try {
        let fetchedProducts = [];

        if (!selectedCategory || selectedCategory === "viewAll") {
          fetchedProducts = await fetchProducts();
        } else if (["new", "special"].includes(selectedCategory)) {
          fetchedProducts = await fetchProductsByFilter(selectedCategory);
        } else {
          fetchedProducts = await fetchProductsByCategory(selectedCategory);
        }

        setAllProducts(fetchedProducts);
        setVisibleProducts(fetchedProducts.slice(0, ITEMS_PER_PAGE));
        setPage(1);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
        setAllProducts([]);
        setVisibleProducts([]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

// In ProductList.js, update the filteredProducts useMemo function
// Replace the price filter section with this:

const filteredProducts = useMemo(() => {
  return allProducts.filter((product) => {
    const colorMatch =
      activeFilters.color.length === 0 ||
      (product.color && activeFilters.color.includes(product.color.name)) ||
      (product.selectedColor &&
        activeFilters.color.includes(product.selectedColor));

    const sizeMatch =
      activeFilters.size.length === 0 ||
      (product.sizes &&
        product.sizes.some((size) => activeFilters.size.includes(size)));

    // Fixed Price filter - use translated keys or standardized values
    const priceMatch =
      activeFilters.price.length === 0 ||
      activeFilters.price.some((range) => {
        const productPrice = parseFloat(product.price);
        
        // Check against translated strings
        if (range === t("under_50") || range === "Under $50") {
          return productPrice < 50;
        } else if (range === t("50_100") || range === "$50-$100") {
          return productPrice >= 50 && productPrice <= 100;
        } else if (range === t("100_200") || range === "$100-$200") {
          return productPrice >= 100 && productPrice <= 200;
        } else if (range === t("over_200") || range === "Over $200") {
          return productPrice > 200;
        }
        return false;
      });

    // Category filter - handle both string and object categories
    const categoryMatch =
      activeFilters.category.length === 0 ||
      activeFilters.category.some(filterCategory => {
        if (product.category && typeof product.category === "object") {
          // Handle multilingual category objects
          const categoryNameAz = product.category.name?.az || product.category.name;
          const categoryNameEn = product.category.name?.en;
          return filterCategory === categoryNameAz || filterCategory === categoryNameEn;
        } else if (product.category && typeof product.category === "string") {
          // Handle legacy string categories
          return filterCategory === product.category;
        }
        return false;
      });

    return colorMatch && sizeMatch && priceMatch && categoryMatch;
  });
}, [allProducts, activeFilters, t]); // Add 't' to dependencies
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, ITEMS_PER_PAGE));
  }, [filteredProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !loading &&
          !initialLoading &&
          visibleProducts.length < filteredProducts.length
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleProducts, loading, initialLoading, filteredProducts.length]);

  const loadMoreProducts = () => {
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = 0;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      const newProducts = filteredProducts.slice(startIndex, endIndex);

      setVisibleProducts(newProducts);
      setPage(nextPage);
      setLoading(false);
    }, 500);
  };

  const getGridClasses = () => {
    switch (layout) {
      case "full":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-5";
      case "grid2":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5";
      case "grid3":
        return "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5";
      default:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3 md:gap-5";
    }
  };

  const getImageHeight = () => {
    switch (layout) {
      case "full":
        return 700;
      case "grid2":
        return 450;
      case "grid3":
        return 300;
      default:
        return 450;
    }
  };

  const getImageHeightClasses = () => {
    switch (layout) {
      case "full":
        return "h-[370px] md:h-[500px] lg:h-[700px]";
      case "grid2":
        return "h-[280px] md:h-[400px] lg:h-[450px]";
      case "grid3":
        return "h-[140px] md:h-[300px] lg:h-[300px]";
      default:
        return "h-[400px] md:h-[400px] lg:h-[450px]";
    }
  };

  const getAvailableColors = (product) => {
    const isChild = product.is_child === true || product.is_child === "true";
    const colors = [];
    const colorCodes = new Set();

    if (product.color && product.color.code) {
      colors.push({
        name: product.color.name || "Color",
        code: product.color.code,
      });
      colorCodes.add(product.color.code);
    }

    if (!isChild) {
      const children = allProducts.filter((p) => p.parents_id === product.id);

      children.forEach((child) => {
        if (
          child.color &&
          child.color.code &&
          !colorCodes.has(child.color.code)
        ) {
          colors.push({
            name: child.color.name || "Color",
            code: child.color.code,
          });
          colorCodes.add(child.color.code);
        }
      });
    } else {
      const parent = allProducts.find((p) => p.id === product.parents_id);

      if (
        parent &&
        parent.color &&
        parent.color.code &&
        !colorCodes.has(parent.color.code)
      ) {
        colors.push({
          name: parent.color.name || "Color",
          code: parent.color.code,
        });
        colorCodes.add(parent.color.code);
      }

      const allSiblings = allProducts.filter(
        (p) => p.parents_id === product.parents_id && p.id !== product.id
      );

      allSiblings.forEach((sibling) => {
        if (
          sibling.color &&
          sibling.color.code &&
          !colorCodes.has(sibling.color.code)
        ) {
          colors.push({
            name: sibling.color.name || "Color",
            code: sibling.color.code,
          });
          colorCodes.add(sibling.color.code);
        }
      });
    }

    return colors;
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("no_products_found")}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedCategory && selectedCategory !== "viewAll"
              ? `${t("no_products_found_in_this_category")} "${getCategoryDisplayName(selectedCategory)}"`
              : t("no_products_found")}
          </p>
          {selectedCategory && selectedCategory !== "viewAll" && (
            <a
              href="/products"
              className="inline-block px-6 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
            >
              {t("view_all_products")}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomToast
        show={showToast}
        onClose={closeToast}
        product={toastProduct}
        message={toastMessage}
        linkText={t("wishlist.access")}
        linkHref="/wishlist"
      />

      <div
        className={`mb-10 grid ${getGridClasses()} gap-1 w-full pt-8 px-4 md:px-20`}
      >
        {visibleProducts.map((product, index) => {
          const availableColors = getAvailableColors(product);
          const isInWishlistItem = wishlist.some(
            (item) => item.id === product.id
          );

          return (
            <ProductCardSingle
              key={`${product.id}-${index}`}
              product={product}
              isInWishlist={isInWishlistItem}
              onToggleWishlist={() => toggleWishlist(product)}
              imageHeightClass={getImageHeightClasses()}
              availableColors={availableColors}
              allProducts={allProducts}
            />
          );
        })}
      </div>

      <div
        ref={loaderRef}
        className="flex justify-center items-center p-4 mb-8"
      >
        {loading && visibleProducts.length < filteredProducts.length && (
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
        )}

        {/* {!loading &&
          visibleProducts.length >= filteredProducts.length &&
          filteredProducts.length > ITEMS_PER_PAGE && (
            <p className="text-gray-500 text-sm">
              You've reached the end of the results
            </p>
          )} */}
      </div>
    </>
  );
}

export default ProductList;
