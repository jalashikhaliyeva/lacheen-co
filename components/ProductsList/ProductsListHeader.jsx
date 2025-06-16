import React, { useState } from "react";
import { BsLayoutSplit } from "react-icons/bs";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { TfiLayoutGrid3 } from "react-icons/tfi";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { TfiLayoutWidthFull } from "react-icons/tfi";
import Container from "../Container";
import FilterComponent from "../FilterComponent";
import { useTranslation } from "react-i18next";

function ProductsListHeader({
  layout,
  setLayout,
  selectedCategory,
  onFilterChange,
  activeFilters,
}) {
  const { t } = useTranslation();
  const [showFilter, setShowFilter] = useState(false);

  const getCategoryDisplayName = (category) => {
    if (!category || category === "viewAll")
      return t("nav.view_all") || "All Products";

    switch (category) {
      case "new":
        return t("nav.new") || "New Products";
      case "special":
        return t("nav.special_prices") || "Special Offers";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const shouldShowCategoryTitle =
    selectedCategory && selectedCategory !== "viewAll";

  const activeFilterCount = Object.values(activeFilters || {}).reduce(
    (total, filters) => total + filters.length,
    0
  );

  return (
    <>
      <Container>
        {/* Controls */}
        <div className="flex justify-between w-full">
          <button
            className="py-1 border border-neutral-700 font-gilroy px-3 text-sm md:text-lg cursor-pointer hover:text-neutral-600 transition-colors"
            onClick={() => setShowFilter(true)}
          >
            Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>
          <div className="flex gap-3 items-center cursor-pointer">
            <TfiLayoutWidthFull
              className={`text-lg cursor-pointer transition-all duration-200 hover:text-neutral-800 hover:scale-110 ${
                layout === "full" ? "text-neutral-800" : "text-neutral-500"
              }`}
              onClick={() => setLayout("full")}
              title="Full Width Layout"
            />
            <TfiLayoutGrid2
              className={`text-lg cursor-pointer transition-all duration-200 hover:text-neutral-800 hover:scale-110 ${
                layout === "grid2" ? "text-neutral-800" : "text-neutral-500"
              }`}
              onClick={() => setLayout("grid2")}
              title="2 Column Grid"
            />
            <TfiLayoutGrid3
              className={`text-lg cursor-pointer transition-all duration-200 hover:text-neutral-800 hover:scale-110 ${
                layout === "grid3" ? "text-neutral-800" : "text-neutral-500"
              }`}
              onClick={() => setLayout("grid3")}
              title="3 Column Grid"
            />
          </div>
        </div>
      </Container>

      {showFilter && (
        <FilterComponent
          onClose={() => setShowFilter(false)}
          onFilterChange={onFilterChange}
          initialFilters={activeFilters}
        />
      )}
    </>
  );
}

export default ProductsListHeader;
