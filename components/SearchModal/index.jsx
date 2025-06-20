import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import TrendingInitSearch from "../TrendingInitSearch";
import { useTranslation } from "react-i18next";
import { searchProducts } from "@/firebase/services/searchService";
import debounce from "lodash/debounce";

export default function SearchModal({
  isOpen,
  onClose,
  newProducts,
  categories,
}) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    categories: [],
    sizes: [],
    colors: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Helper function to get text from multilingual objects
  const getMultilingualText = (textObj, fallback = "") => {
    if (!textObj) return fallback;
    
    // If it's already a string, return it
    if (typeof textObj === "string") return textObj;
    
    // If it's an object with language keys, get the current language
    if (typeof textObj === "object" && textObj !== null) {
      const currentLanguage = i18n.language || "az";
      
      // Try current language first, then available languages, then fallback
      return (
        textObj[currentLanguage] ||
        textObj["az"] ||
        textObj["en"] ||
        Object.values(textObj)[0] ||
        fallback
      );
    }
    
    return fallback;
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults({
      products: [],
      categories: [],
      sizes: [],
      colors: [],
    });
  };

  const debouncedSearch = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults({
        products: [],
        categories: [],
        sizes: [],
        colors: [],
      });
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleResultClick = (type, item) => {
    switch (type) {
      case "category":
        router.push(`/category/${item.slug}`);
        break;
      case "product":
        router.push(`/products/${item.id}`);
        break;
      case "size":
      case "color":
        router.push({
          pathname: "/products",
          query: { [type]: item.value || item.name },
        });
        break;
    }
    onClose();
  };

  if (!mounted) return null;

  const activeCats = categories?.filter((cat) => cat.is_active !== false) || [];
  const trendingCats = activeCats.slice(-3);

  // Helper function to get products for a specific section
  const getProductsForSection = (sectionType) => {
    switch (sectionType) {
      case 'categories':
        return searchResults.products.filter((product) =>
          searchResults.categories.some(
            (cat) => product.category?.toLowerCase() === getMultilingualText(cat.name).toLowerCase()
          )
        );
      case 'sizes':
        return searchResults.products.filter((product) =>
          searchResults.sizes.some((size) =>
            product.sizes?.some(
              (s) => (s || '').toLowerCase() === (getMultilingualText(size.value) || '').toLowerCase()
            )
          )
        );
      case 'colors':
        return searchResults.products.filter((product) =>
          searchResults.colors.some((color) =>
            product.colors?.some(
              (productColor) => 
                (productColor || '').toLowerCase() === (getMultilingualText(color.name) || '').toLowerCase()
            )
          )
        );
      default:
        return [];
    }
  };

  // Check if we have any results
  const hasResults = searchResults.products.length > 0 || 
                    searchResults.categories.length > 0 || 
                    searchResults.sizes.length > 0 || 
                    searchResults.colors.length > 0;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="font-gilroy text-neutral-800">
          <motion.div
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            className="fixed inset-0 z-[101] flex items-start justify-center"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-full h-full md:max-h-[770px] rounded-none shadow-lg overflow-y-auto -webkit-overflow-scrolling-touch"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-2xl z-10 cursor-pointer"
              >
                <IoClose />
              </button>

              <div
                className="flex items-center justify-center h-[100px] cursor-pointer"
                onClick={() => router.push({ pathname: "/" })}
              >
                <Image
                  src="/images/logo/lacheen-logo.png"
                  width={300}
                  height={400}
                  alt="logo lacheen"
                  className="w-[200px] object-cover"
                  quality={100}
                />
              </div>

              <div className="flex flex-col items-center h-full px-6">
                <h2 className="text-2xl md:text-4xl font-gilroy my-8">
                  {t("what_are_you_looking_for")}
                </h2>
                <div className="w-full relative max-w-4xl">
                  <input
                    type="text"
                    placeholder={t("search_placeholder")}
                    className="w-full font-gilroy border rounded-full border-black py-3 px-4 text-lg focus:outline-none transition"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClear}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </div>

                {/* Search Results */}
                {searchQuery && (
                  <div className="w-full max-w-4xl mt-4">
                    {isSearching ? (
                      <div className="text-center py-4">{t("searching")}</div>
                    ) : (
                      <>
                        {/* All Products Results - Show all matching products */}
                        {searchResults.products.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg mb-2">
                              {t("search_results")} ({searchResults.products.length})
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {searchResults.products.map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() =>
                                    handleResultClick("product", product)
                                  }
                                  className="cursor-pointer hover:opacity-80 transition"
                                >
                                  <div className="aspect-square relative">
                                    <Image
                                      src={
                                        product.images?.[0]?.url ||
                                        product.images?.[0] ||
                                        "/images/placeholder.png"
                                      }
                                      alt={getMultilingualText(product.name) || "Product"}
                                      fill
                                      className="object-cover rounded-lg"
                                    />
                                  </div>
                                  <h4 className="mt-2 text-sm font-medium">
                                    {getMultilingualText(product.name)}
                                  </h4>
                                  <p className="text-gray-600">
                                    {product.price} AZN
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show specific category results if found */}
                        {searchResults.categories.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg mb-2">
                              {t("found_categories")}:{" "}
                              {searchResults.categories.map((c) => getMultilingualText(c.name)).join(", ")}
                            </h3>
                          </div>
                        )}

                        {/* Show specific size results if found */}
                        {searchResults.sizes.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg mb-2">
                              {t("found_sizes")}:{" "}
                              {searchResults.sizes.map((s) => getMultilingualText(s.value)).join(", ")}
                            </h3>
                          </div>
                        )}

                        {/* Show specific color results if found */}
                        {searchResults.colors.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg mb-2">
                              {t("found_colors")}:{" "}
                              {searchResults.colors.map((c) => getMultilingualText(c.name)).join(", ")}
                            </h3>
                          </div>
                        )}

                        {/* No results message */}
                        {!isSearching && !hasResults && (
                          <div className="text-center py-4 text-gray-500">
                            {t("no_results_found")}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Trending searches from last 3 categories */}
                {!searchQuery && (
                  <div className="mt-4 font-gilroy text-sm">
                    <h2 className="uppercase mb-2">
                      {t("trending_searches")}:
                    </h2>
                    <div className="flex flex-row gap-4 overflow-x-auto pb-2 whitespace-nowrap scrollbar-hide">
                      {trendingCats.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSearchQuery(getMultilingualText(cat.name))}
                          className="lowercase cursor-pointer text-neutral-600 hover:text-neutral-800 transition"
                        >
                          {getMultilingualText(cat.name)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!searchQuery && (
                  <TrendingInitSearch newProducts={newProducts} />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}