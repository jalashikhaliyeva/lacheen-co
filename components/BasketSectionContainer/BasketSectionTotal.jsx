import React, { useState } from "react";
import {
  LiaCheckSolid,
  LiaChevronDownSolid,
  LiaChevronUpSolid,
} from "react-icons/lia";
import { useAuthClient } from "@/shared/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useBasket } from "@/shared/context/BasketContext";
import { useRouter } from "next/navigation";

function BasketSectionTotal() {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuthClient();
  const { t } = useTranslation();
  const { basketItems } = useBasket();
  const router = useRouter();

  const calculateSubtotal = () => {
    return basketItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const calculateDelivery = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return subtotal >= 100 ? 0 : 5; // Free delivery over 100 AZN
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const delivery = calculateDelivery();
    return (subtotal + delivery).toFixed(2);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 md:gap-4 w-full font-gilroy bg-white p-4 md:p-5 border-neutral-200">
      <h2 className="hidden md:block text-lg md:text-xl font-semibold text-neutral-800">
        {t("order_summary")}
      </h2>

      <div className="hidden md:block">
        <div className="flex flex-row justify-between">
          <p className="text-base md:text-lg text-neutral-800">
            {t("subtotal")}
          </p>
          <span className="text-base text-neutral-800">
            {calculateSubtotal()} ₼
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-base md:text-lg text-neutral-800">
            {t("delivery")}
          </p>
          <span className="text-base text-neutral-800">
            {calculateDelivery() === 0 ? t("free") : `${calculateDelivery()} ₼`}
          </span>
        </div>
      </div>

      <div className="flex flex-row justify-between md:border-t border-neutral-200 pt-3">
        <p className="text-base md:text-lg uppercase font-medium text-neutral-800">
          {t("total")}
        </p>
        <span className="text-base font-semibold text-neutral-800">
          {calculateTotal()} ₼
        </span>
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-center mt-2">
          <button onClick={toggleDetails} className="text-sm text-neutral-800">
            {showDetails ? t("hide_details") : t("show_details")}
          </button>
          <button onClick={toggleDetails}>
            {showDetails ? (
              <LiaChevronUpSolid size={16} className="text-neutral-600" />
            ) : (
              <LiaChevronDownSolid size={16} className="text-neutral-600" />
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showDetails ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mt-1">
            <div className="flex flex-row justify-between mb-2">
              <p className="text-base text-neutral-800">{t("subtotal")}</p>
              <span className="text-base text-neutral-800">
                {calculateSubtotal()} ₼
              </span>
            </div>
            <div className="flex flex-row justify-between mb-3">
              <p className="text-base text-neutral-800">{t("delivery")}</p>
              <span className="text-base text-neutral-800">
                {calculateDelivery() === 0
                  ? t("free")
                  : `${calculateDelivery()} ₼`}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-sm pb-2">
              <div className="flex flex-row gap-2 items-center">
                <LiaCheckSolid size={18} />
                <p className="text-neutral-800">{t("delivery_time")}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <LiaCheckSolid size={18} />
                <p className="text-neutral-800">
                  100 AZN{t("free_shipping_threshold")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        <button
          className="py-2 px-4 w-full border cursor-pointer font-gilroy border-neutral-900 text-neutral-800 
            relative overflow-hidden text-sm md:text-base
            hover:text-white 
            transition-all duration-500
            hover:bg-neutral-900
            hover:border-neutral-900
            active:scale-95"
          disabled={basketItems.length === 0}
          onClick={() => router.push("/checkout")}
        >
          {t("buy_now")}
        </button>
      </div>

      <div className="hidden md:flex mt-4 md:mt-5 flex-col gap-2 text-sm md:text-base">
        <div className="flex flex-row gap-2 items-center">
          <LiaCheckSolid size={18} />
          <p className="text-neutral-800">{t("delivery_time")}</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <LiaCheckSolid size={18} />
          <p className="text-neutral-800">
            100 AZN {t("free_shipping_threshold")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BasketSectionTotal;
