import Image from "next/image";
import React, { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useAuthClient } from "@/shared/context/AuthContext";
import { IoClose } from "react-icons/io5";
import {
  updateQuantity,
  removeFromBasket,
} from "@/firebase/services/basketService";
import { useBasket } from "@/shared/context/BasketContext";

function BasketSectionItems() {
  const { t } = useTranslation();
  const { user } = useAuthClient();
  const { basketItems, updateBasketItems } = useBasket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await updateQuantity(user.uid, productId, newQuantity);
      const updatedItems = basketItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateBasketItems(updatedItems);
      showNotificationMessage(t("quantity_updated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      showNotificationMessage(t("error_updating_quantity"));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromBasket(user.uid, productId);
      const updatedItems = basketItems.filter((item) => item.id !== productId);
      updateBasketItems(updatedItems);
      showNotificationMessage(t("item_removed"));
    } catch (error) {
      console.error("Error removing item:", error);
      showNotificationMessage(t("error_removing_item"));
    }
  };

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  if (basketItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-normal font-gilroy text-neutral-800">
          {t("your_basket_is_empty")}
        </p>
      </div>
    );
  }

  return (
    <>
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white text-neutral-800 rounded-lg shadow-lg p-4 max-w-sm w-full transform transition-all duration-500 ease-in-out animate-slide-down">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{notificationMessage}</p>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 font-gilroy">
        {basketItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col border border-neutral-300 p-3 md:p-4 text-neutral-800"
          >
            <div className="flex justify-end">
              <TfiClose
                className="text-neutral-400 cursor-pointer hover:text-neutral-600 transition"
                size={18}
                onClick={() => handleRemoveItem(item.id)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
              <div className="w-full sm:w-auto cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="w-full sm:w-40 md:w-52 h-[350px] md:h-48 object-cover object-bottom"
                  onClick={() => openModal(item.image)}
                />
              </div>

              <div className="w-full sm:flex-1 text-center sm:text-left">
                <span className="block text-base md:text-lg font-medium">
                  {item.name}
                </span>
                <span className="block text-xs md:text-sm text-neutral-500 mt-1">
                  Size: {item.size} | Color: {item.color}
                </span>

                <div className="sm:hidden mt-2 text-rose-700 font-semibold text-sm">
                  {item.price} ₼
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="flex items-center font-gilroy">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex cursor-pointer items-center justify-center border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <AiOutlineMinus className="text-lg" />
                  </button>

                  <span className="w-8 text-center text-base">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center cursor-pointer justify-center border border-neutral-300 hover:bg-neutral-100 transition"
                  >
                    <AiOutlinePlus className="text-lg" />
                  </button>
                </div>

                <div className="hidden sm:block text-rose-700 font-semibold text-base whitespace-nowrap">
                  {item.price} ₼
                </div>
              </div>
            </div>
          </div>
        ))}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-75 p-4"
            onClick={closeModal}
          >
            <div
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 cursor-pointer right-0 text-white hover:text-gray-300 transition"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <TfiClose size={24} />
              </button>
              <div className="max-w-[90vw] max-h-[90vh] overflow-auto">
                <Image
                  src={selectedImage}
                  alt="Enlarged product"
                  width={800}
                  height={800}
                  className="object-contain max-w-full max-h-[80vh]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BasketSectionItems;
