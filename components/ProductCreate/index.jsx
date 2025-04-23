// components/ProductCreateTabs.js
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { createProduct } from "@/firebase/services/firebaseProductsService";
import { useContext, useState } from "react";
import { ProductContext } from "@/shared/context/ProductContext";
import Combination from "./Combination";
import Information from "./Information";

function ProductCreateTabs() {
  const {
    informationData,
    setInformationData,
    combinationData,
    setCombinationData,
  } = useContext(ProductContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("information");

  // Button style classes for tab navigation:
  const baseButtonClass = "text-lg font-gilroy p-2 cursor-pointer font-base";
  // const activeButtonClass = "bg-[#EBF0FF] text-lightBlueeText rounded-md";
  const activeButtonClass = "text-teal-700 border-b-2 border-teal-700 pb-1";


  const handleCreateProduct = async () => {
    // 1. Validate required fields (except description and quantity)
    const requiredFields = ["name", "price", "sellingPrice", "barcode", "category"];
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
  
    // Prepare the main product data (include the is_new field explicitly)
    const mainProductData = {
      ...informationData,
      is_child: false, // Main product flag
      is_active: isActive,
      is_new: informationData.is_new, // Preserve the "new" flag
    };
  
    try {
      // 1. Create the main product in Firebase.
      const createdProduct = await createProduct(mainProductData);
  
      // 2. Create variant entries if any are defined.
      if (combinationData.variants && combinationData.variants.length > 0) {
        for (const variant of combinationData.variants) {
          // Use the variant data as-is and add/update the parent's id and child flag
          const newVariantData = {
            ...variant, // Preserves updated name, images, and other fields
            parents_id: createdProduct.id,
            is_child: true,
          };
  
          await createProduct(newVariantData);
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
        color: "",
        images: [],
        sizes: [],
        is_active: true,
        is_child: false,
        colors: [],
        selectedColor: [],
        is_new: false,
      });
      setCombinationData({
        colors: [],
        selectedColor: [],
        variants: [],
      });
  
      // 4. Show success notification and redirect.
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("There was an error creating the product.");
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
            onClick={handleCreateProduct}
            className="bg-teal-700 cursor-pointer text-white rounded-md px-4 py-2 mt-4"
          >
            Create Product
          </button>
          <button  onClick={() =>
            router.push({
              pathname: "/admin/products",
            })
          } className="bg-white cursor-pointer text-red-400 border rounded-md px-4 py-2 mt-4">
            Cancel
          </button>
        </div>
      </div>
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}

export default ProductCreateTabs;
