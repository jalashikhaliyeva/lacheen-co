import React from "react";
import * as XLSX from "xlsx";
import { CiExport } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { useRouter } from "next/router";

function ActionsProductTable({ products, selectedCount, onDeleteSelected }) {
  const router = useRouter();
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  return (
    <div className="bg-white text-neutral-800 border flex flex-col md:flex-row justify-between gap-4 border-neutral-300 mb-5 rounded-lg p-5">
      <div>
        <button
          onClick={exportToExcel}
          className="flex items-center w-full text-center justify-center cursor-pointer gap-2 px-3 py-2 text-neutral-600 border border-neutral-300 rounded transition-colors"
        >
          <CiExport className="text-neutral-600" />
          Export to Excel
        </button>
      </div>
      <div>
        {selectedCount > 0 ? (
          <button
            onClick={onDeleteSelected}
            className="px-3 flex items-center justify-center  gap-4 cursor-pointer py-2 bg-red-500 text-white duration-150 hover:bg-red-400 rounded-lg"
          >
            <BsTrash3 />
            Delete Selected
          </button>
        ) : (
          <button
            onClick={() =>
              router.push({
                pathname: "/admin/product-create",
              })
            }
            className="px-3 flex items-center gap-4 cursor-pointer py-2 bg-teal-700 text-white duration-150 hover:bg-teal-600 rounded-lg"
          >
            <FaPlus />
            Add Product
          </button>
        )}
      </div>
    </div>
  );
}

export default ActionsProductTable;
