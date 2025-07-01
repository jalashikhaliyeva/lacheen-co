import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { IoFunnelOutline } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { VscEdit } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import { LiaSearchPlusSolid } from "react-icons/lia";
import ActionsProductTable from "../ActionsProductTable";
import { useRouter } from "next/router";
import {
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
} from "@/firebase/services/firebaseProductsService";
import { toast } from "react-toastify";
import DeleteModal from "../DeleteModal";
import { useTranslation } from "react-i18next";

function ImageCell({ images, name }) {
  if (!images) return null;

  const imgsArray = Array.isArray(images) ? images : Object.values(images);
  const firstImg = imgsArray[0];
  let imageUrl = "";

  if (typeof firstImg === "string") {
    imageUrl = firstImg;
  } else if (firstImg && typeof firstImg === "object" && firstImg.url) {
    imageUrl = firstImg.url;
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-12 h-12 object-cover rounded"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/path-to-placeholder-image.png";
        }}
      />
    );
  }

  return (
    <div className="w-12 h-12 bg-gray-200 p-2 rounded flex items-center justify-center text-xs text-gray-500">
      No image
    </div>
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function WomenShoesTable({ mockProducts }) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const formattedProducts = useMemo(() => {
    return mockProducts.map((product) => ({
      ...product,
      price: Number(product.price) || 0,
      status: product.is_active ? "active" : "deactive",
      sellingPrice: Number(product["sellingPrice"]),
      stock: product.quantity ? Number(product.quantity) : 0,
      category:
        product.category?.name?.[currentLang] ||
        product.category?.name?.az ||
        product.category?.name ||
        product.category ||
        "N/A",
      color: product.color || product.selectedColor,
    }));
  }, [mockProducts, currentLang]);

  const [products, setProducts] = useState(formattedProducts);
  useEffect(() => {
    setProducts(formattedProducts);
  }, [formattedProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [productIdFilter, setProductIdFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [colorFilter, setColorFilter] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dropdownRefs = {
    productId: useRef(null),
    category: useRef(null),
    status: useRef(null),
    price: useRef(null),
    color: useRef(null),
  };

  const displayProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc.push({
        ...product,
        isVariant: false,
        parentId: product.id,
        rowKey: product.id,
      });
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          acc.push({
            ...product,
            ...variant,
            isVariant: true,
            parentId: product.id,
            status:
              variant.status !== undefined ? variant.status : product.status,
            rowKey: `${product.id}-${variant.id}`,
          });
        });
      }
      return acc;
    }, []);
  }, [products]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const statusOptions = ["active", "deactive"];

  const colorOptions = useMemo(() => {
    const colorsSet = new Set();
    products.forEach((p) => {
      if (p.color) colorsSet.add(p.color);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant) => {
          if (variant.color) colorsSet.add(variant.color);
        });
      }
    });
    return Array.from(colorsSet);
  }, [products]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openFilter) {
        const ref = dropdownRefs[openFilter];
        if (ref && ref.current && !ref.current.contains(event.target)) {
          setOpenFilter(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilter, dropdownRefs]);

  const filteredData = useMemo(() => {
    return displayProducts.filter((product) => {
      const searchMatch =
        (product.name &&
          product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.id &&
          product.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.barcode &&
          product.barcode.toLowerCase().includes(searchTerm.toLowerCase()));

      const productIdMatch = productIdFilter
        ? product.id?.toLowerCase().includes(productIdFilter.toLowerCase())
        : true;
      const categoryMatch =
        categoryFilter.length > 0
          ? categoryFilter.includes(product.category)
          : true;
      const statusMatch =
        statusFilter.length > 0 ? statusFilter.includes(product.status) : true;
      const minPrice = priceFilter.min
        ? parseFloat(priceFilter.min)
        : -Infinity;
      const maxPrice = priceFilter.max ? parseFloat(priceFilter.max) : Infinity;
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      const colorMatch =
        colorFilter.length > 0 ? colorFilter.includes(product.color) : true;

      return (
        searchMatch &&
        productIdMatch &&
        categoryMatch &&
        statusMatch &&
        priceMatch &&
        colorMatch
      );
    });
  }, [
    searchTerm,
    productIdFilter,
    categoryFilter,
    statusFilter,
    priceFilter,
    colorFilter,
    displayProducts,
  ]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const handlePageClick = (selectedPage) =>
    setCurrentPage(selectedPage.selected);

  const toggleRowSelection = (rowKey) => {
    setSelectedRowKeys((prev) =>
      prev.includes(rowKey)
        ? prev.filter((key) => key !== rowKey)
        : [...prev, rowKey]
    );
  };

  const handleSelectAll = () => {
    const paginatedRowKeys = paginatedData.map((row) => row.rowKey);
    const allSelected = paginatedRowKeys.every((key) =>
      selectedRowKeys.includes(key)
    );
    if (allSelected) {
      setSelectedRowKeys((prev) =>
        prev.filter((key) => !paginatedRowKeys.includes(key))
      );
    } else {
      setSelectedRowKeys((prev) => [
        ...prev,
        ...paginatedRowKeys.filter((key) => !prev.includes(key)),
      ]);
    }
  };

  const getRowByKey = (rowKey) =>
    displayProducts.find((row) => row.rowKey === rowKey);

  const performDeletion = async () => {
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "single") {
        await deleteProduct(deleteTarget.row.id);

        setProducts((prev) =>
          prev
            .map((prod) => {
              if (!deleteTarget.row.isVariant) {
                return prod.id === deleteTarget.row.id ? null : prod;
              } else if (prod.id === deleteTarget.row.parentId) {
                return {
                  ...prod,
                  variants: prod.variants.filter(
                    (v) => v.id !== deleteTarget.row.id
                  ),
                };
              }
              return prod;
            })
            .filter(Boolean)
        );
        setSelectedRowKeys((prev) =>
          prev.filter((k) => k !== deleteTarget.row.rowKey)
        );
        toast.success("Product deleted");
      } else if (deleteTarget.type === "multiple") {
        const selectedFirebaseIds = selectedRowKeys
          .map((key) => {
            const row = getRowByKey(key);
            return row?.id;
          })
          .filter(Boolean);
        await deleteMultipleProducts(selectedFirebaseIds);

        setProducts((prev) =>
          prev
            .map((prod) => {
              if (selectedFirebaseIds.includes(prod.id)) return null;
              if (prod.variants) {
                return {
                  ...prod,
                  variants: prod.variants.filter(
                    (v) => !selectedFirebaseIds.includes(v.id)
                  ),
                };
              }
              return prod;
            })
            .filter(Boolean)
        );
        setSelectedRowKeys([]);
        toast.success("Selected products deleted");
      }
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Could not delete. Try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const confirmSingleDelete = (row) => {
    setDeleteTarget({ type: "single", row });
    setShowDeleteModal(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteTarget({ type: "multiple" });
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setProductIdFilter("");
    setCategoryFilter([]);
    setStatusFilter([]);
    setPriceFilter({ min: "", max: "" });
    setColorFilter([]);
    setOpenFilter(null);
    setCurrentPage(0);
  };

  const renderSafely = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      return value.name || value.code || value.value || JSON.stringify(value);
    }
    return value.toString();
  };

  return ( 
    <div className="pt-2 text-neutral-800">
      <ActionsProductTable
        products={products}
        selectedCount={selectedRowKeys.length}
        onDeleteSelected={confirmDeleteSelected}
      />

      <div className="p-4 my-5 border border-neutral-300 text-neutral-800 font-gilroy rounded-lg bg-white relative">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-2">
          <div className="relative w-full sm:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CiSearch />
            </div>
            <input
              type="text"
              placeholder="Axtar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full pl-10 pr-3 py-2 border border-neutral-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-3 py-2 text-blue-400 cursor-pointer rounded transition-colors"
          >
            Filteri Sıfırla <FiRefreshCw />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) =>
                        selectedRowKeys.includes(row.rowKey)
                      )
                    }
                  />
                </th>

                <th className="px-4 py-2 text-left">Şəkil</th>
                <th className="px-4 py-2 text-left relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "productId" ? null : "productId"
                      )
                    }
                  >
                    Barcode
                  </div>
                </th>
                <th className="px-4 py-2 text-left">Məhsul Adı</th>
                <th className="px-4 py-2 text-left relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "category" ? null : "category"
                      )
                    }
                  >
                    Kategoriya
                  </div>
                </th>
                <th className="px-4 py-2 text-left relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setOpenFilter(openFilter === "price" ? null : "price")
                    }
                  >
                    Qiymət
                  </div>
                </th>
                <th className="px-4 py-2 text-left">Satış Qiyməti</th>
                <th className="px-4 py-2 text-left">Stok</th>
                <th className="px-4 py-2 text-left">Endirim</th>

                <th className="px-4 py-2 text-left relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setOpenFilter(openFilter === "color" ? null : "color")
                    }
                  >
                    Rəng
                  </div>
                </th>

                <th className="px-4 py-2 text-left">Əməliyyatlar</th>
                <th className="px-4 py-2 text-left relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setOpenFilter(openFilter === "status" ? null : "status")
                    }
                  >
                    Status
                  </div>
                </th>
                {/* <th className="px-4 py-2 text-left">Bax</th> */}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.rowKey}
                    className="hover:bg-slate-100 transition-colors border-b border-neutral-300"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(row.rowKey)}
                        onChange={() => toggleRowSelection(row.rowKey)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <ImageCell images={row.images} name={row.name} />
                    </td>
                    <td className="px-4 py-3">{row.barcode}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{renderSafely(row.category)}</td>
                    <td className="px-4 py-3">₼ {row.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      ₼ {row.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{row.stock}</td>
                    <td className="px-4 py-3">{row.sale}%</td>

                    <td className="px-4 py-5">
                      {(() => {
                        const hex =
                          typeof row.color === "string"
                            ? row.color
                            : row.color.code;

                        const label =
                          typeof row.color === "object"
                            ? row.color.name
                            : row.color;

                        return (
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: hex }}
                            />
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-4">
                        <div className="px-2 py-2 flex items-center justify-center gap-2 bg-teal-600 text-white rounded-md text-base">
                          <VscEdit
                            onClick={() => {
                              router.push({
                                pathname: "/admin/product-edit",
                                query: { id: row.id },
                              });
                            }}
                            className="cursor-pointer "
                          />
                        </div>
                        <div className="px-2 py-2 flex items-center justify-center gap-2 bg-neutral-300 text-neutral-600 rounded-md text-base">
                          <BsTrash3
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => confirmSingleDelete(row)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={row.status === "active"}
                          onChange={async () => {
                            const newIsActive = row.status !== "active";
                            try {
                              await updateProduct(row.id, {
                                is_active: newIsActive,
                              });

                              setProducts((prev) =>
                                prev.map((prod) => {
                                  if (row.isVariant) {
                                    if (prod.id === row.parentId) {
                                      return {
                                        ...prod,
                                        variants: prod.variants.map((variant) =>
                                          variant.id === row.id
                                            ? {
                                                ...variant,
                                                status: newIsActive
                                                  ? "active"
                                                  : "deactive",
                                              }
                                            : variant
                                        ),
                                      };
                                    }
                                    return prod;
                                  } else {
                                    return prod.id === row.id
                                      ? {
                                          ...prod,
                                          status: newIsActive
                                            ? "active"
                                            : "deactive",
                                        }
                                      : prod;
                                  }
                                })
                              );
                              toast.success("Status updated");
                            } catch (err) {
                              console.error("Failed to update status:", err);
                              toast.error(
                                "Could not update status. Try again."
                              );
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-rose-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-teal-400 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </td>
                    {/* <td className="px-4 py-4 flex-end text-end">
                      <button
                        onClick={() =>
                          router.push({
                            pathname: "/admin/product-detailed",
                            query: { id: row.id },
                          })
                        }
                        className="text-blue-500 hover:underline cursor-pointer"
                      >

                        More
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="px-4 py-2 text-center">
                    Nəticə tapılmadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm">
              Səhifədə göstər:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(0);
              }}
              className="px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[5, 10, 15].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex gap-2 mt-2 sm:mt-0"
              pageClassName="border border-neutral-300 rounded"
              pageLinkClassName="px-3 py-1 cursor-pointer hover:bg-gray-200"
              activeClassName="bg-blue-500 text-white"
              previousClassName="border border-neutral-300 rounded"
              previousLinkClassName="px-3 py-1 cursor-pointer hover:bg-gray-200"
              nextClassName="border border-neutral-300 rounded"
              nextLinkClassName="px-3 py-1 cursor-pointer hover:bg-gray-200"
              disabledClassName="hidden"
            />
          )}
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal
          isDeleting={isDeleting}
          onClose={() => {
            if (!isDeleting) {
              setShowDeleteModal(false);
              setDeleteTarget(null);
            }
          }}
          onConfirm={performDeletion}
        />
      )}
    </div>
  );
}

export default WomenShoesTable;
