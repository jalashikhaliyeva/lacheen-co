import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSizes } from "@/shared/hooks/useSizes";
import { useColors } from "@/shared/hooks/useColors";
import { fetchCategories } from "@/firebase/services/categoriesService";

const FilterComponent = ({ onClose, onFilterChange, initialFilters }) => {
  const [openSection, setOpenSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    size: [],
    price: [],
    category: [],
  });

  const { sizes, loading: sizesLoading } = useSizes();
  const { colors, loading: colorsLoading } = useColors();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (initialFilters) {
      setSelectedFilters(initialFilters);
    }
  }, [initialFilters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();

        const activeCategories = fetchedCategories
          .filter((category) => category.is_active)
          .map((category) => category.name?.[currentLang] || category.name?.az || category.name);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [currentLang]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const filterOptions = {
    color: colors,
    size: sizes,
    price: [t("under_50"), t("50_100"), t("100_200"), t("over_200")],
    category: categories,
  };

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const handleFilterChange = (section, value) => {
    setSelectedFilters((prev) => {
      const list = prev[section].includes(value)
        ? prev[section].filter((v) => v !== value)
        : [...prev[section], value];
      const newFilters = { ...prev, [section]: list };

      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
    handleClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      color: [],
      size: [],
      price: [],
      category: [],
    };
    setSelectedFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Panel with slide-in transition */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 font-gilroy">
        <div
          className={`relative w-screen max-w-md transform transition-all duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ willChange: "transform" }}
        >
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-5 border-b">
              <h2 className="text-lg text-gray-900">Filter</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
              {Object.entries(filterOptions).map(([section, options]) => (
                <div key={section} className="border-b border-gray-200 py-4">
                  <button
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => toggleSection(section)}
                  >
                    <div>
                      <h3 className="capitalize text-md text-gray-900">
                        {t(section)}
                      </h3>
                      {selectedFilters[section].length > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Selected: {selectedFilters[section].join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="transition-transform duration-200 ease-in-out">
                      {openSection === section ? (
                        <IoIosArrowUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <IoIosArrowDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`
                      mt-4 pl-2 space-y-3 overflow-hidden
                      transition-all duration-300 ease-in-out
                      ${
                        openSection === section
                          ? "max-h-60 opacity-100 translate-y-0 overflow-y-auto"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }
                    `}
                    style={{ willChange: "transform, opacity, max-height" }}
                  >
                    {options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedFilters[section].includes(option)}
                          onChange={() => handleFilterChange(section, option)}
                        />
                        <span className="ml-3 text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t px-4 py-4">
              <button
                onClick={handleApplyFilters}
                className="bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-600 transition-colors duration-200"
              >
                {t("apply_filters")}
              </button>
              <button
                onClick={handleClearFilters}
                className="border border-neutral-800 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                {t("clear_all")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
