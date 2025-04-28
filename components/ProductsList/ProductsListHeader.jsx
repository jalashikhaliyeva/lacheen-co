import React, { useState } from "react";
import { BsLayoutSplit } from "react-icons/bs";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { TfiLayoutGrid3 } from "react-icons/tfi";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { TfiLayoutWidthFull } from "react-icons/tfi";
import Container from "../Container";
import FilterComponent from "../FilterComponent";

function ProductsListHeader({ layout, setLayout }) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <Container>
        <div className="flex justify-between w-full">
          <button
            className=" py-1 border border-neutral-700 font-gilroy  px-3 text-sm  md:text-lg cursor-pointer hover:text-neutral-600 transition-colors"
            onClick={() => setShowFilter(true)}
          >
            Filter (2)
          </button>
          <div className="flex gap-3 items-center cursor-pointer">
            <TfiLayoutWidthFull
              className={`text-lg cursor-pointer transition-all duration-200 hover:text-neutral-800 hover:scale-110 ${
                layout === "full" ? "text-neutral-800" : "text-neutral-500"
              }`}
              onClick={() => setLayout("full")}
            />
            <TfiLayoutGrid2
              className={`text-lg cursor-pointer transition-all duration-200 hover:text-neutral-800 hover:scale-110 ${
                layout === "grid2" ? "text-neutral-800" : "text-neutral-500"
              }`}
              onClick={() => setLayout("grid2")}
            />
            <TfiLayoutGrid3
              className={`text-lg cursor-pointer transition-all duration-200 hover:text-neutral-800 hover:scale-110 ${
                layout === "grid3" ? "text-neutral-800" : "text-neutral-500"
              }`}
              onClick={() => setLayout("grid3")}
            />
          </div>
        </div>
      </Container>

      {showFilter && <FilterComponent onClose={() => setShowFilter(false)} />}
    </>
  );
}

export default ProductsListHeader;
