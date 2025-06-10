import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  updateProduct,
  createProduct,
} from "@/firebase/services/firebaseProductsService";
import { useContext, useState } from "react";
import { ProductContext } from "@/shared/context/ProductContext";
import Combination from "../ProductCreate/Combination";
import Information from "../ProductCreate/Information";

function ProductEditTabs() {
  const {
    informationData,
    setInformationData,
    combinationData,
    setCombinationData,
  } = useContext(ProductContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("information");

  const baseButtonClass = "text-lg font-gilroy p-2 cursor-pointer font-base";
  const activeButtonClass = "text-teal-700 border-b-2 border-teal-700 pb-1";

  const handleUpdateProduct = async () => {
    // 1. Validate required fields (except description and quantity)
    const requiredFields = [
      "name",
      "price",
      "sellingPrice",
      "barcode",
      "category",
    ];

    const hasRequiredFields = requiredFields.every(
      (key) =>
        informationData[key] !== undefined &&
        informationData[key] !== null &&
        informationData[key].toString().trim() !== ""
    );

    // 2. Check that there is at least one image
    const hasImages =
      Array.isArray(informationData.images) &&
      informationData.images.length > 0;

    // 3. Determine active status based on completeness
    const isActive = hasRequiredFields && hasImages;

    // Prepare the main product data (preserve is_new flag and ensure color consistency)
    const mainProductData = {
      ...informationData,
      is_child: false, // Main product flag
      is_active: isActive,
      is_new: informationData.is_new, // Preserve the "new" flag
      // Ensure color is stored consistently with name and code
      color: informationData.selectedColor || { name: "", code: "" },
    };

    try {
      // 1. Update the main product using its id.
      await updateProduct(mainProductData.id, mainProductData);

      // 2. Update or create variant entries if any are defined.
      if (combinationData.variants && combinationData.variants.length > 0) {
        for (const variant of combinationData.variants) {
          // Use the variant data and inherit category and barcode from parent
          const updatedVariantData = {
            ...variant, // Preserves updated name, images, and other fields
            parents_id: mainProductData.id,
            is_child: true,
            // Inherit category and barcode from parent product
            category: informationData.category,
            barcode: informationData.barcode,
            // Also inherit description if variant doesn't have one
            description: variant.description || informationData.description,
            // Ensure color is stored with both name and code
            color: variant.colorObject || {
              name: variant.color || "",
              code: "",
            },
          };

          // If the variant already exists, update it; otherwise, create it.
          if (variant.id) {
            await updateProduct(variant.id, updatedVariantData);
          } else {
            await createProduct(updatedVariantData);
          }
        }
      }

      // 3. Reset the context data for a clean form.
      setInformationData({
        id: "",
        name: "",
        description: "",
        price: 0,
        sale: 0,
        sellingPrice: 0,
        quantity: "",
        category: "",
        color: { name: "", code: "" },
        images: [],
        sizes: [],
        is_active: true,
        is_child: false,
        colors: [],
        selectedColor: null,
        is_new: false,
      });
      setCombinationData({
        colors: [],
        selectedColor: [],
        variants: [],
      });

      // 5. Show success message and redirect.
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("There was an error updating the product.");
    }
  };

  const renderTab = () => {
    return activeTab === "information" ? (
      <div>
        <Information />
      </div>
    ) : (
      <div>
        <Combination />
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-3">
          <button
            className={`${baseButtonClass} ${
              activeTab === "information" ? activeButtonClass : ""
            }`}
            onClick={() => setActiveTab("information")}
          >
            Information
          </button>
          <button
            className={`${baseButtonClass} ${
              activeTab === "combination" ? activeButtonClass : ""
            }`}
            onClick={() => setActiveTab("combination")}
          >
            Combination
          </button>
        </div>
        <div className="flex flex-row items-center justify-center gap-5">
          <button
            onClick={handleUpdateProduct}
            className="bg-teal-700 cursor-pointer text-white rounded-md px-4 py-2 mt-4"
          >
            Update Product
          </button>
          <button
            onClick={() =>
              router.push({
                pathname: "/admin/products",
              })
            }
            className="bg-white cursor-pointer text-red-400 border rounded-md px-4 py-2 mt-4"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}

export default ProductEditTabs;