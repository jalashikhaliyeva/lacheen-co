import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { updateProduct, createProduct } from "@/firebase/services/firebaseProductsService";
import { useContext, useState } from "react";
import { ProductContext } from "@/shared/context/ProductContext";
import Combination from "./Combination";
import Information from "./Information";

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
  // const activeButtonClass = "bg-[#567C8D] text-[#F5EFEB] rounded-md";
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

    // Prepare the main product data (preserve is_new flag)
    const mainProductData = {
      ...informationData,
      is_child: false, // Main product flag
      is_active: isActive,
      is_new: informationData.is_new,
    };

    try {
      // 1. Update the main product using its id.
      await updateProduct(mainProductData.id, mainProductData);

      // 2. Update or create variant entries if any are defined.
      if (combinationData.variants && combinationData.variants.length > 0) {
        for (const variant of combinationData.variants) {
          // Create an updated variant object that preserves the user changes.
          const updatedVariantData = {
            ...variant,
            parents_id: mainProductData.id,
            is_child: true,
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
        name: "",
        description: "",
        price: "",
        sellingPrice: "",
        barcode: "",
        quantity: "",
        category: "",
        images: [],
        sizes: [],
        colors: [],
        selectedColor: [],
        is_new: false,
      });

      // 4. Clear the combination data.
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
      <div className="flex flex-row  items-center justify-between">
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
