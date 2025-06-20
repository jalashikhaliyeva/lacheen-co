import React, { useRef, useEffect, useContext, useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import { TfiMoney } from "react-icons/tfi";
import { GoNumber } from "react-icons/go";
import { VscPercentage } from "react-icons/vsc";
import { BiDesktop } from "react-icons/bi";
import { ProductContext } from "@/shared/context/ProductContext";
import CustomDropdown from "../CustomDropdown";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// Reusable CustomDropdown for color selection
import { app } from "@/firebase/backendConfig";
// In Information.js
import { useSizes } from "@/shared/hooks/useSizes";
import { useTranslation } from "react-i18next";
function Information() {
  const { sizes: availableSizes, loading: sizesLoading } = useSizes();
  const { informationData, setInformationData } = useContext(ProductContext);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const {
    name,
    description,
    price,
    sellingPrice,
    quantity,
    category,
    barcode,
    // color will be updated in the Combination component,
    images,
    sizes,
    colors, // Make sure your context includes this (default to [] if needed)
    selectedColor,
    sale,
  } = informationData;
  const [discountEnabled, setDiscountEnabled] = useState(
    sale !== "" && sale !== undefined
  );

  const categoryRef = useRef(null);
  const availableCategories = ["Category 1", "Category 2", "Subcategory 1"];
  // const availableSizes = [35, 36, 37, 38, 39, 40];
  const [categoryOpen, setCategoryOpen] = React.useState(false);

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

  // For category, we now allow selecting a single value.
  const handleSelectCategory = (selectedCategory) => {
    setInformationData((prev) => ({ ...prev, category: selectedCategory }));
  };

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
    if (sizesLoading) return;
    setInformationData((prev) => ({
      ...prev,
      sizes: [...availableSizes],
    }));
  };

  const storage = getStorage(app);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Upload each file to Firebase Storage and get its download URL
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        try {
          // Create a reference in Firebase Storage (you can customize the storage path)
          const fileRef = storageRef(
            storage,
            `images/${file.name}-${Date.now()}`
          );

          // Upload the file
          await uploadBytes(fileRef, file);

          // Get the download URL
          const downloadURL = await getDownloadURL(fileRef);

          return { file, url: downloadURL };
        } catch (error) {
          console.error("Error uploading image:", error);
          return null; // Optionally handle errors for individual files
        }
      })
    );

    // Filter out any null entries in case an upload failed
    const validImages = uploadedImages.filter((img) => img !== null);

    // Update your context or state with the new images that include permanent URLs
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

  return (
    <div className="bg-white font-gilroy mt-5 dark:bg-gray-800 rounded-xl py-10 px-6 sm:px-10 flex flex-col items-center w-full max-w-[90%] mx-auto">
      <div className="flex flex-col gap-1 lg:w-3/5 w-full">
        {/* Product Name */}
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full">
            <p className="text-xl text-gray-500 mb-1">Product Name</p>
            <div className="group flex dark:bg-gray-800 py-3 px-4 items-center border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200">
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

          {/* Category Selection */}
          <div className="w-full relative" ref={categoryRef}>
            <p className="text-xl text-gray-500 mb-1">Category</p>
            <div
              className="w-full border dark:bg-gray-800 font-medium border-gray-400 rounded-md py-3 px-4 flex items-center bg-gray-100 cursor-pointer"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              {category ? (
                <span className="text-black">
                  {category.name?.[currentLang] || category.name?.az || category.name || category}
                </span>
              ) : (
                <span className="text-gray-500">Select a category</span>
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
                {availableCategories.map((cat) => (
                  <div
                    key={cat}
                    className="py-2 px-4 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      handleSelectCategory(cat);
                      setCategoryOpen(false);
                    }}
                  >
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="w-full">
            <p className="text-xl text-gray-500 mb-1">Description</p>
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

          {/* Product Price */}
          <div className="w-full">
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

          {/* Selling Price */}
          <div className="w-full">
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
          {/* Discount Amount */}
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
                    // Only set default if there's no existing value
                    if (!sale || sale === "") {
                      setInformationData((prev) => ({ ...prev, sale: "10" }));
                    }
                  }}
                />
                Yes
              </label>
            </div>
          </div>

          {discountEnabled && (
            <div className="w-full">
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

          {/* Quantity */}
          <div className="w-full">
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

          {/* New Barcode Input */}
          <div className="w-full">
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

          {/* Sizes */}
          <div className="w-full">
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
          <div className="w-full  mb-4">
            <CustomDropdown
              label="Select Color:"
              options={colors || []}
              selected={selectedColor || ""}
              onSelect={(newSelected) =>
                setInformationData((prev) => ({
                  ...prev,
                  selectedColor: newSelected,
                }))
              }
              onAddNew={(newColor) =>
                setInformationData((prev) => ({
                  ...prev,
                  colors: [...(prev.colors || []), newColor],
                }))
              }
              addNewLabel="Add New Color"
              placeholder="Choose a color"
              multiSelect={false} // changed from true to false for single-select behavior
            />
          </div>

          {/* New Product Radio Button */}
          <div className="w-full mb-2">
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
                  checked={informationData.is_new !== true}
                  onChange={() =>
                    setInformationData((prev) => ({ ...prev, is_new: false }))
                  }
                  className="mr-2"
                />
                no, that is not new.
              </label>
            </div>
          </div>

          {/* Product Images */}
          <div className="w-full">
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
    </div>
  );
}

export default Information;
