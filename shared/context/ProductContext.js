import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // State for the Information tab
  const [informationData, setInformationData] = useState({
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
  });
  // State for the Combination tab
  const [combinationData, setCombinationData] = useState({
    colors: [],
    selectedColor: [],
    variants: [],
  });

  return (
    <ProductContext.Provider
      value={{
        informationData,
        setInformationData,
        combinationData,
        setCombinationData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
