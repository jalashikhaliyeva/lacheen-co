import React, { useState, useEffect, useContext } from "react";
import Container from "../Container";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import { ProductContext } from "@/shared/context/ProductContext";

// Reusable CustomDropdown for color selection
const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  onAddNew,
  addNewLabel,
  placeholder,
  multiSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState("");
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (option === "select-all") {
      if (selected.length === options.length && options.length > 0) {
        onSelect([]);
      } else {
        onSelect([...options]);
      }
    } else {
      if (selected.includes(option)) {
        onSelect(selected.filter((item) => item !== option));
      } else {
        onSelect([...selected, option]);
      }
    }
    if (!multiSelect) {
      setIsOpen(false);
    }
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const trimmed = newOption.trim();
    const exists = options.some(
      (option) => option.toLowerCase() === trimmed.toLowerCase()
    );
    if (trimmed !== "" && !exists) {
      onAddNew(trimmed);
      if (multiSelect) {
        onSelect([...selected, trimmed]);
      } else {
        onSelect(trimmed);
      }
      setNewOption("");
      setIsAdding(false);
      if (!multiSelect) {
        setIsOpen(false);
      }
    } else if (exists) {
      toast.warning("This color already exists!");
    }
  };

  const displayValue =
    multiSelect && selected.length > 0
      ? selected.join(", ")
      : !multiSelect && selected
      ? selected
      : placeholder;

  return (
    <div className="relative w-full font-gilroy" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex dark:bg-gray-800 py-3 px-4 items-center border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200"
      >
        {displayValue}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-gray-100 border border-gray-400 rounded-lg shadow-md z-10">
          {isAdding ? (
            <form onSubmit={handleAddNew}>
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsAdding(false);
                  }
                }}
                placeholder="Enter new value"
                className="w-full px-3 py-2 border-b focus:outline-none"
                autoFocus
              />
            </form>
          ) : (
            <ul>
              <li
                onClick={() => setIsAdding(true)}
                className="px-3 py-2 hover:bg-gray-200 rounded-lg dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                {addNewLabel}
              </li>
              <li
                onClick={() => handleSelect("select-all")}
                className="px-3 py-2 hover:bg-gray-200 rounded-lg dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center"
              >
                <span>Select All</span>
                {selected.length === options.length && options.length > 0 && (
                  <span>✓</span>
                )}
              </li>
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="px-3 py-2 hover:bg-gray-200 rounded-lg dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                >
                  <span>{option}</span>
                  {selected.includes(option) && <span>✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/firebase/backendConfig";

const InlineMultipleImagePicker = ({ images, onChange }) => {
  const fileInputRef = React.useRef(null);
  const storage = getStorage(app);

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Upload each file to Firebase Storage and retrieve the permanent URL.
      const uploadedImages = await Promise.all(
        filesArray.map(async (file) => {
          try {
            const fileRef = storageRef(
              storage,
              `variant-images/${file.name}-${Date.now()}`
            );
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
          } catch (error) {
            console.error("Error uploading variant image:", error);
            return null;
          }
        })
      );
      const validImages = uploadedImages.filter((url) => url !== null);
      onChange([...images, ...validImages]);
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    onChange(images.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((img, index) => (
          <div key={index} className="relative w-20 h-20">
            <img
              src={img}
              alt="Variant"
              className="w-full h-full object-cover rounded border"
            />
            <button
              onClick={() => handleDeleteImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        <div
          onClick={handleImageClick}
          className="w-20 h-20 border rounded flex items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-600"
        >
          <span className="text-xs text-gray-500">Add Image</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const VariantTable = ({ variants, setVariants }) => {
  const { sizes: availableSizes, loading: sizesLoading } = useSizes();
  const safeVariants = Array.isArray(variants) ? variants : [];
  // const availableSizes = [35, 36, 37, 38, 39, 40];

  const updateVariant = (id, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const deleteVariant = (id) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== id));
  };

  return (
    <div className="overflow-x-auto mt-5 w-full font-gilroy rounded-2xl border">
      <table className="min-w-full bg-white rounded-2xl">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 border">Images</th>
            <th className="px-4 py-2 border">Color</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Selling Price</th>
            <th className="px-4 py-2 border">Quantity</th>
            <th className="px-4 py-2 border">Sizes</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {safeVariants.map((variant) => (
            <tr key={variant.id} className="text-center">
              <td className="px-4 py-2 border">
                <InlineMultipleImagePicker
                  images={variant.images}
                  onChange={(newImages) =>
                    updateVariant(variant.id, "images", newImages)
                  }
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) =>
                    updateVariant(variant.id, "color", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(variant.id, "name", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(variant.id, "price", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={variant.sellingPrice}
                  onChange={(e) =>
                    updateVariant(variant.id, "sellingPrice", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={variant.quantity}
                  onChange={(e) =>
                    updateVariant(variant.id, "quantity", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="px-4 py-2 border">
                {sizesLoading ? (
                  <p>Loading sizes...</p>
                ) : (
                  <>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {availableSizes.map((size) => {
                        const currentSizes = variant.sizes || [];
                        const isSelected = currentSizes?.includes(size);
                        return (
                          <button
                            key={size}
                            onClick={() => {
                              const newSizes = isSelected
                                ? currentSizes.filter((s) => s !== size)
                                : [...currentSizes, size];
                              updateVariant(variant.id, "sizes", newSizes);
                            }}
                            className={`border px-2 py-1 rounded-md cursor-pointer ${
                              isSelected
                                ? "bg-neutral-300 text-black"
                                : "bg-gray-100 text-black"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() =>
                        updateVariant(variant.id, "sizes", availableSizes)
                      }
                      className="mt-1 text-sm text-blue-800 underline"
                    >
                      Select All
                    </button>
                  </>
                )}
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => deleteVariant(variant.id)}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  <TbTrash className="text-xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
function Combination() {
  // Include combinationData from context as before
  const { combinationData, setCombinationData, informationData } =
    useContext(ProductContext);
  const { colors, selectedColor, variants } = combinationData;
  const [showVariantTable, setShowVariantTable] = useState(variants.length > 0);

  useEffect(() => {
    if (variants && variants.length > 0) {
      setShowVariantTable(true);
    }
  }, [variants]);

  // Whenever the selected colors change, update the variants.
  useEffect(() => {
    if (selectedColor.length > 0) {
      generateOrUpdateVariants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const generateOrUpdateVariants = () => {
    setCombinationData((prev) => {
      const currentVariants = Array.isArray(prev.variants) ? prev.variants : [];
      // Create a mapping based on a non-editable "baseColor" property
      const variantMap = currentVariants.reduce((map, variant) => {
        map[variant.baseColor] = variant;
        return map;
      }, {});
      const newVariants = prev.selectedColor.map((color) => {
        if (variantMap[color]) {
          return variantMap[color];
        }
        return {
          // Generate a unique id independent of the color value
          id: Math.random().toString(36).substr(2, 9),
          baseColor: color,
          color: color,
          name: informationData.name || "",
          price: informationData.price || "",
          sellingPrice: informationData.sellingPrice || "",
          quantity: informationData.quantity || "",
          images: [],
          sizes: [],
          is_child: true, // Mark as child since it was added via combination
        };
      });
      return { ...prev, variants: newVariants };
    });
  };

  return (
    <>
      <div className="bg-white font-gilroy mt-5 dark:bg-gray-800 rounded-xl py-10 px-6 sm:px-10 flex flex-col items-center w-full max-w-[90%] mx-auto">
        <div className="w-full lg:w-3/5 mb-4">
          {/* Wrap the dropdown in a relative container */}
          <div className="relative">
            {/* Add extra right padding so the button doesn't cover the dropdown content */}
            <div className="relative pr-32">
              <CustomDropdown
                label="Select Color:"
                options={colors}
                selected={selectedColor}
                onSelect={(newSelected) =>
                  setCombinationData((prev) => ({
                    ...prev,
                    selectedColor: newSelected,
                  }))
                }
                onAddNew={(newColor) =>
                  setCombinationData((prev) => ({
                    ...prev,
                    colors: [...prev.colors, newColor],
                  }))
                }
                addNewLabel="Add New Color"
                placeholder="Choose a color"
                multiSelect={true}
              />
            </div>
            {selectedColor.length > 0 && (
              <button
                onClick={() => {
                  generateOrUpdateVariants();
                  setShowVariantTable(true);
                }}
                className="absolute right-[140px] text-xs top-1/2 transform  px-3 py-1  border border-neutral-300 rounded bg-neutral-300 hover:bg-neutral-300"
              >
                Generate Variants
              </button>
            )}
          </div>
        </div>
      </div>

      {showVariantTable && (
        <Container>
          <VariantTable
            variants={variants}
            setVariants={(update) =>
              setCombinationData((prev) => ({
                ...prev,
                variants:
                  typeof update === "function" ? update(prev.variants) : update,
              }))
            }
          />
        </Container>
      )}
    </>
  );
}

export default Combination;
