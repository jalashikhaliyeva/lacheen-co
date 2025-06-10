// src/components/Combination.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import Container from "../Container";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import { fetchColors } from "@/firebase/services/colorService";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/firebase/backendConfig";
import { useSizes } from "@/shared/hooks/useSizes";
import { ProductContext } from "@/shared/context/ProductContext";

const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (opt) =>
    selected.some((s) => s.name === opt.name && s.code === opt.code);

  const handleOptionClick = (opt) => {
    if (isSelected(opt)) {
      onSelect(selected.filter((s) => s.name !== opt.name));
    } else {
      onSelect([...selected, opt]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onSelect([]);
    } else {
      onSelect([...options]);
    }
  };

  const displayValue =
    selected.length > 0 ? selected.map((s) => s.name).join(", ") : placeholder;

  return (
    <div className="relative w-full font-gilroy" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex py-3 px-4 items-center border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200"
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className="ml-auto w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-gray-100 border border-gray-400 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto">
          <li
            onClick={handleSelectAll}
            className="px-3 py-2 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between items-center"
          >
            <span>
              {selected.length === options.length
                ? "Deselect All"
                : "Select All"}
            </span>
            {selected.length === options.length && options.length > 0 && (
              <span>✓</span>
            )}
          </li>

          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => {
                handleOptionClick(opt);
              }}
              className="px-3 py-2 hover:bg-gray-200 rounded-lg cursor-pointer flex items-center"
            >
              <span
                className="inline-block w-4 h-4 rounded-full mr-2 border"
                style={{ backgroundColor: opt.code }}
              />
              <span className="flex-1">{opt.name}</span>
              {isSelected(opt) && <span>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
          className="w-20 h-20 border rounded flex items-center justify-center cursor-pointer bg-gray-50"
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

// Updated VariantTable to show color with swatch and handle color objects
const VariantTable = ({ variants, setVariants, availableColors }) => {
  const safeVariants = Array.isArray(variants) ? variants : [];
  const { sizes: availableSizes, loading: sizesLoading } = useSizes();

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

  // Handle color selection for variants
  const handleColorChange = (variantId, selectedColorObj) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === variantId) {
          return {
            ...variant,
            color: selectedColorObj.name,
            colorObject: selectedColorObj, // Store the full color object
          };
        }
        return variant;
      })
    );
  };

  return (
    <div className="overflow-x-auto mt-5 w-full font-gilroy rounded-2xl border">
      <table className="min-w-full bg-white rounded-2xl">
        <thead className="bg-gray-100">
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
          {safeVariants.map((variant) => {
            // Find the current color object for this variant
            const currentColorObj = variant.colorObject ||
              availableColors.find((c) => c.name === variant.color) || {
                name: variant.color || "",
                code: "",
              };

            return (
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
                  {/* Color dropdown with swatch */}
                  <div className="relative">
                    <select
                      value={currentColorObj.name}
                      onChange={(e) => {
                        const selectedColor = availableColors.find(
                          (c) => c.name === e.target.value
                        );
                        if (selectedColor) {
                          handleColorChange(variant.id, selectedColor);
                        }
                      }}
                      className="w-full border rounded px-2 py-1 bg-white"
                    >
                      <option value="">Select Color</option>
                      {availableColors.map((color) => (
                        <option key={color.name} value={color.name}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    {/* Color swatch display */}
                    {currentColorObj.code && (
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="inline-block w-4 h-4 rounded-full border"
                          style={{ backgroundColor: currentColorObj.code }}
                        />
                        <span className="text-xs text-gray-600">
                          {currentColorObj.code}
                        </span>
                      </div>
                    )}
                  </div>
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
                          const isSelected = currentSizes.includes(size);
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function Combination() {
  const { combinationData, setCombinationData, informationData } =
    useContext(ProductContext);

  const { colors, selectedColor, variants } = combinationData;
  const [showVariantTable, setShowVariantTable] = useState(
    Array.isArray(variants) && variants.length > 0
  );

  const [availableColors, setAvailableColors] = useState([]);
  const [loadingColors, setLoadingColors] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const fetched = await fetchColors();
        const active = fetched.filter((c) => c.is_active);
        setAvailableColors(active.map((c) => ({ name: c.name, code: c.code })));
        setCombinationData((prev) => ({
          ...prev,
          colors: active.map((c) => c.name),
        }));
      } catch (error) {
        console.error("Error loading colors:", error);
        toast.error("Failed to load colors.");
      } finally {
        setLoadingColors(false);
      }
    };
    loadColors();
  }, []);

  useEffect(() => {
    if (showVariantTable) {
      generateOrUpdateVariants();
    }
  }, [selectedColor]);

  const generateOrUpdateVariants = () => {
    setCombinationData((prev) => {
      const existingVariants = Array.isArray(prev.variants)
        ? prev.variants
        : [];

      const variantMap = existingVariants.reduce((map, v) => {
        map[v.baseColor] = v;
        return map;
      }, {});

      const newVariants = prev.selectedColor.map((colorObj) => {
        const colorName = colorObj.name;
        if (variantMap[colorName]) {
          // Update existing variant with the full color object
          return {
            ...variantMap[colorName],
            colorObject: colorObj, // Ensure we store the full color object
          };
        }
        return {
          id: Math.random().toString(36).substr(2, 9),
          baseColor: colorName,
          color: colorName,
          colorObject: colorObj, // Store the full color object with code
          name: informationData.name || "",
          price: informationData.price || "",
          sellingPrice: informationData.sellingPrice || "",
          quantity: informationData.quantity || "",
          images: [],
          sizes: [],
          is_child: true,
        };
      });

      return { ...prev, variants: newVariants };
    });
  };

  return (
    <>
      <div className="bg-white font-gilroy mt-5 rounded-xl py-10 px-6 sm:px-10 flex flex-col items-center w-full max-w-[90%] mx-auto">
        <div className="flex  w-full flex-row justify-center gap-5">
          <div className="w-1/2 mb-4">
            {loadingColors ? (
              <p>Loading colors...</p>
            ) : (
              <CustomDropdown
                label="Select Color:"
                options={availableColors}
                selected={selectedColor}
                onSelect={(newSelected) =>
                  setCombinationData((prev) => ({
                    ...prev,
                    selectedColor: newSelected,
                  }))
                }
                placeholder="Choose one or more colors"
              />
            )}
          </div>

          {selectedColor.length > 0 && !showVariantTable && (
            <button
              onClick={() => {
                generateOrUpdateVariants();
                setShowVariantTable(true);
              }}
              className="flex w-fit items-center cursor-pointer gap-2 my-auto px-3 py-1 h-10 hover:bg-neutral-100 text-neutral-600 border border-neutral-300 rounded transition-colors"
            >
              Generate Variants
            </button>
          )}
        </div>
      </div>

      {showVariantTable && (
        <Container>
          <VariantTable
            variants={variants}
            availableColors={availableColors}
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
