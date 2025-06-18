// src/components/Information.jsx
import React, { useRef, useEffect, useContext, useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import { TfiMoney } from "react-icons/tfi";
import { GoNumber } from "react-icons/go";
import { VscPercentage } from "react-icons/vsc";
import { ProductContext } from "@/shared/context/ProductContext";
import CustomDropdown from "../CustomDropdown";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchColors } from "@/firebase/services/colorService";
import { useTranslation } from "react-i18next";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/firebase/backendConfig";
import { useSizes } from "@/shared/hooks/useSizes";

function Information() {
  const { informationData, setInformationData } = useContext(ProductContext);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const [discountEnabled, setDiscountEnabled] = useState(informationData.sale && informationData.sale !== "");

  const {
    name,
    description,
    price,
    sellingPrice,
    quantity,
    category,
    barcode,
    images,
    sizes,
    selectedColor,
    sale,
  } = informationData;

  // Update discountEnabled when sale value changes
  useEffect(() => {
    setDiscountEnabled(sale && sale !== "");
  }, [sale]);

  // ── CATEGORY SETUP ───────────────────────────────────────────────────────────
  const categoryRef = useRef(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Get available categories based on current language
  const availableCategories = categories
    .filter((c) => c.is_active)
    .map((c) => {
      const name = c.name?.[currentLang] || c.name?.az || c.name;
      const slug = c.slug?.[currentLang] || c.slug?.az || c.slug;
      return {
        id: c.id,
        name,
        slug,
        originalCategory: c
      };
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
    if (categoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen]);

  const handleSelectCategory = (selectedCat) => {
    setInformationData((prev) => ({ ...prev, category: selectedCat }));
  };

  // ── SIZE SETUP ────────────────────────────────────────────────────────────────
  const { sizes: availableSizes, loading: sizesLoading } = useSizes();

  const toggleSize = (size) => {
    setInformationData((prev) => {
      const current = Array.isArray(prev.sizes) ? prev.sizes : [];
      return {
        ...prev,
        sizes: current.includes(size)
          ? current.filter((s) => s !== size)
          : [...current, size],
      };
    });
  };

  const selectAllSizes = () => {
    setInformationData((prev) => ({
      ...prev,
      sizes: availableSizes,
    }));
  };

  // ── COLORS SETUP ──────────────────────────────────────────────────────────────
  // Fetch full color objects from Firebase, keep only `is_active === true`.
  // Later we'll render a swatch + name.
  const [availableColors, setAvailableColors] = useState([]);
  const [loadingColors, setLoadingColors] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const fetched = await fetchColors(); // returns [{ id, name, code, is_active }, …]
        const active = fetched.filter((c) => c.is_active);
        // Keep only name & code for each active color:
        setAvailableColors(active.map((c) => ({ name: c.name, code: c.code })));
      } catch (error) {
        console.error("Failed to load colors:", error);
      } finally {
        setLoadingColors(false);
      }
    };
    loadColors();
  }, []);

  // ── IMAGE UPLOAD SETUP ────────────────────────────────────────────────────────
  const storage = getStorage(app);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          const fileRef = storageRef(
            storage,
            `images/${file.name}-${Date.now()}`
          );
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          return { file, url };
        } catch (err) {
          console.error("Error uploading image:", err);
          return null;
        }
      })
    );
    const validImages = uploaded.filter((img) => img !== null);
    setInformationData((prev) => ({
      ...prev,
      images: Array.isArray(prev.images)
        ? [...prev.images, ...validImages]
        : validImages,
    }));
  };

  const handleRemoveImage = (index) => {
    setInformationData((prev) => ({
      ...prev,
      images: Array.isArray(prev.images)
        ? prev.images.filter((_, i) => i !== index)
        : [],
    }));
  };

  // ── GENERIC INPUT HANDLERS ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
      setInformationData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white font-gilroy mt-5 rounded-xl py-10 px-6 sm:px-10 flex flex-col items-center w-full max-w-[90%] mx-auto">
      <div className="flex flex-col gap-1 lg:w-3/5 w-full">
        {/* ── PRODUCT NAME ─────────────────────────────────────────────────────────── */}
        <div className="w-full">
          <p className="text-xl text-gray-500 mb-1">Product Name</p>
          <div className="group flex py-3 px-4 items-center border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
            <AiOutlineProduct className="text-gray-500 mr-3 group-hover:text-gray-800" />
            <textarea
              placeholder="Enter product name"
              className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none resize-none overflow-hidden"
              rows={1}
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── CATEGORY ─────────────────────────────────────────────────────────────── */}
        <div className="w-full relative mt-4" ref={categoryRef}>
          <p className="text-xl text-gray-500 mb-1">Category</p>
          <div
            className="w-full border font-medium border-gray-400 rounded-md py-3 px-4 flex items-center bg-gray-100 cursor-pointer"
            onClick={() => setCategoryOpen((prev) => !prev)}
          >
            {category ? (
              <span className="text-black">
                {category.name?.[currentLang] || category.name?.az || category.name || category}
              </span>
            ) : (
              <span className="text-gray-500">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </span>
            )}
            <div className="flex-1" />
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {categoryOpen && (
            <div className="absolute z-10 w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 rounded-md mt-1 max-h-32 overflow-y-auto">
              {loadingCategories ? (
                <div className="py-2 px-4 text-gray-500">
                  Loading categories...
                </div>
              ) : availableCategories.length > 0 ? (
                availableCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="py-2 px-4 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      handleSelectCategory(cat.originalCategory);
                      setCategoryOpen(false);
                    }}
                  >
                    <span>{cat.name}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 px-4 text-gray-500">
                  No categories available
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── DESCRIPTION ─────────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">
            Description{" "}
            <span className="text-base italic">
              (smt like: Böyük ölçü - Bir ölçü kiçik seçin)
            </span>
          </p>
          <div className="group flex py-3 px-4 items-center dark:bg-gray-800 border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
            <CgDetailsMore className="text-gray-500 mr-3 group-hover:text-gray-800" />
            <textarea
              placeholder="Enter product description"
              className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none resize-none overflow-hidden"
              rows={1}
              name="description"
              value={description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── PRODUCT PRICE ───────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Product Price</p>
          <div className="group flex py-3 px-4 items-center dark:bg-gray-800 border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
            <TfiMoney className="text-gray-500 mr-3 group-hover:text-gray-800" />
            <input
              type="text"
              placeholder="Enter product price"
              className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none"
              name="price"
              value={price}
              onChange={handleNumberChange}
              inputMode="decimal"
              pattern="^[0-9]+([.,][0-9]*)?$"
            />
          </div>
        </div>

        {/* ── SELLING PRICE ───────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Selling Price</p>
          <div className="group flex py-3 px-4 items-center dark:bg-gray-800 border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
            <TfiMoney className="text-gray-500 mr-3 group-hover:text-gray-800" />
            <input
              type="text"
              placeholder="Enter selling price"
              className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none"
              name="sellingPrice"
              value={sellingPrice}
              onChange={handleNumberChange}
              inputMode="decimal"
              pattern="^[0-9]+([.,][0-9]*)?$"
            />
          </div>
        </div>

        {/* ── DISCOUNT AMOUNT ───────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Discount amount?</p>
          <div className="flex gap-4">
            <label className="cursor-pointer flex items-center">
              <input
                type="radio"
                name="discount"
                className="mr-2"
                checked={!discountEnabled}
                onChange={() => {
                  setDiscountEnabled(false);
                  setInformationData((prev) => ({ ...prev, sale: "" }));
                }}
              />
              No
            </label>
            <label className="cursor-pointer flex items-center">
              <input
                type="radio"
                name="discount"
                className="mr-2"
                checked={discountEnabled}
                onChange={() => {
                  setDiscountEnabled(true);
                  if (!informationData.sale || informationData.sale === "") {
                    setInformationData((prev) => ({ ...prev, sale: "10" }));
                  }
                }}
              />
              Yes
            </label>
          </div>
        </div>

        {discountEnabled && (
          <div className="w-full mt-2">
            <div className="group flex py-3 px-4 items-center dark:bg-gray-800 border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <VscPercentage className="text-gray-500 mr-3 group-hover:text-gray-800" />
              <input
                type="text"
                name="sale"
                placeholder="Enter discount percentage"
                className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none"
                value={sale}
                onChange={handleNumberChange}
                inputMode="numeric"
                pattern="^[0-9]+$"
              />
            </div>
            {sale && (
              <p className="text-sm text-green-600 mt-1">
                Product will be discounted by {sale}% (New price:
                {(
                  parseFloat(sellingPrice) *
                  (1 - parseFloat(sale) / 100)
                ).toFixed(2)}{" "}
                ₼ )
              </p>
            )}
          </div>
        )}

        {/* ── QUANTITY ─────────────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Quantity</p>
          <div className="group flex py-3 px-4 items-center dark:bg-gray-800 border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
            <GoNumber className="text-gray-500 mr-3 group-hover:text-gray-800" />
            <input
              type="text"
              placeholder="Enter quantity"
              className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none"
              name="quantity"
              value={quantity}
              onChange={handleNumberChange}
              inputMode="decimal"
              pattern="^[0-9]+([.,][0-9]*)?$"
            />
          </div>
        </div>

        {/* ── BARCODE ───────────────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Barcode</p>
          <div className="group flex py-3 px-4 items-center dark:bg-gray-800 border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
            <input
              type="text"
              placeholder="Enter barcode"
              className="text-black placeholder-gray-400 w-full bg-transparent focus:outline-none"
              name="barcode"
              value={barcode || ""}
              onChange={handleNumberChange}
              inputMode="numeric"
              pattern="^[0-9]+$"
            />
          </div>
        </div>

        {/* ── SIZES ─────────────────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Sizes</p>
          {sizesLoading ? (
            <p>Loading sizes...</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`border px-4 py-2 rounded-md cursor-pointer ${
                    sizes?.includes(size)
                      ? "bg-neutral-300 text-black"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={selectAllSizes}
            className="mt-2 text-sm text-blue-800 underline"
          >
            Select All
          </button>
        </div>

        {/* ── COLORS DROPDOWN ───────────────────────────────────────────────────────── */}
        <div className="w-full mb-4 mt-4">
          <p className="text-xl text-gray-500 mb-1">Select Color</p>
          {loadingColors ? (
            <p>Loading colors...</p>
          ) : availableColors.length > 0 ? (
            <CustomDropdown
              options={availableColors}
              selected={selectedColor}
              onSelect={(newSelected) =>
                setInformationData((prev) => ({
                  ...prev,
                  selectedColor: newSelected,
                }))
              }
              placeholder="Choose a color"
            />
          ) : (
            <p className="text-gray-500">No colors available</p>
          )}
        </div>

        {/* ── IS NEW ───────────────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">
            Need to show product as{" "}
            <span className="italic text-red-500">new</span>?
          </p>
          <div className="flex gap-4">
            <label className="cursor-pointer flex items-center">
              <input
                type="radio"
                name="is_new"
                value="true"
                checked={informationData.is_new === true}
                onChange={() =>
                  setInformationData((prev) => ({ ...prev, is_new: true }))
                }
                className="mr-2"
              />
              yes, it is new.
            </label>
            <label className="cursor-pointer flex items-center">
              <input
                type="radio"
                name="is_new"
                value="false"
                checked={informationData.is_new === false}
                onChange={() =>
                  setInformationData((prev) => ({ ...prev, is_new: false }))
                }
                className="mr-2"
              />
              no, that is not new.
            </label>
          </div>
        </div>

        {/* ── PRODUCT IMAGES ──────────────────────────────────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-xl text-gray-500 mb-1">Product Images</p>
          <div
            className="border-dashed border-2 border-gray-400 rounded-lg p-4 text-center cursor-pointer"
            onClick={() => document.getElementById("imageInput").click()}
          >
            Click to select images
            <input
              id="imageInput"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {Array.isArray(images) && images.length > 0 && (
            <div className="mt-4 flex gap-4 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={`Selected ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Information;
