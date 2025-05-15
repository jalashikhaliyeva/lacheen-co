import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaCheckSolid,
  LiaChevronDownSolid,
  LiaChevronUpSolid,
} from "react-icons/lia";
import { PiChatsThin, PiHeart } from "react-icons/pi";

function ActionsProduct() {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const itemPath = router.asPath; // e.g. "/products/42"
  const phoneNumber = "994517777285";
  const message = `Salam, mən ${itemPath} məhsul ilə maraqlanıram`;
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex flex-col gap-1 md:gap-4 w-full font-gilroy bg-white p-4 md:p-5 border-neutral-200">
      <h2 className=" uppercase block text-lg md:text-xl ">Suede shoes</h2>

      <div className="block">
        <div className="flex flex-row justify-between">
          <span className="text-base">1555 ₼</span>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-baseline">
          {" "}
          <div className="bg-amber-950 p-2.5">{""}</div>
          <div className="bg-gray-900 p-2.5">{""}</div>
          <div className="relative">
            {" "}
            <div className="bg-orange-950 p-2.5">{""}</div>
            <div className="absolute bottom-[-4px] left-0 h-0.25 w-full bg-orange-950"></div>
          </div>
        </div>
        <div>
          <p className="text-base font-gilroy">- Brown</p>
        </div>
      </div>

      <div className="hidden md:flex w-full bg-amber-50 font-gilroy text-center items-center justify-center">
        <p className="text-sm text-neutral-600 py-1 px-3 text-center">
          {t("size_advice")}
        </p>
      </div>

      <div className="hidden md:flex border-t border-b border-neutral-400 max-h-[195px] overflow-y-auto  flex-col font-gilroy text-neutral-600 py-3">
        <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
          36
        </p>
        <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
          37
        </p>
        <div className="flex cursor-not-allowed justify-between items-center hover:bg-neutral-100 transition-colors duration-10">
          <p className="p-2 text-neutral-300 0">38</p>
          <p className="text-xs">{t("out_of_stock")}</p>
        </div>

        <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
          39
        </p>
        <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
          40
        </p>
        <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
          41
        </p>
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-center mt-2">
          <button onClick={toggleDetails} className="text-sm text-neutral-600">
            {showDetails ? "Hide sizes" : "Show available sizes"}
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
          <div className="flex border-t border-b border-neutral-400 max-h-[195px] overflow-y-auto  flex-col font-gilroy text-neutral-600 py-3">
            <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
              36
            </p>
            <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
              37
            </p>
            <div className="flex cursor-not-allowed justify-between items-center hover:bg-neutral-100 transition-colors duration-10">
              <p className="p-2 text-neutral-300 0">38</p>
              <p className="text-xs"> {t("out_of_stock")}</p>
            </div>

            <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
              39
            </p>
            <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
              40
            </p>
            <p className="p-2 hover:bg-neutral-100 transition-colors duration-100">
              41
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6 w-full flex items-center gap-2">
        <div className="w-[90%]">
          <button
            className="py-2 px-4 w-full border cursor-pointer  font-gilroy border-neutral-900 text-neutral-800 
            relative overflow-hidden text-sm md:text-base
            hover:text-white 
            transition-all duration-500
            hover:bg-neutral-900
            hover:border-neutral-900
            active:scale-95"
          >
            {t("add_to_cart")}
          </button>
        </div>
        <div className="cursor-pointer py-2 px-2 border border-black bg-black text-center">
          <PiHeart className="text-2xl text-white" />
        </div>
      </div>

      <div className="hidden md:flex mt-4 md:mt-5 flex-col gap-2 text-sm md:text-base">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <div className="flex flex-row gap-2 items-center">
            <PiChatsThin size={26} />
            <p>{t("whatsapp_stock_check")}</p>
          </div>
        </a>
        <div className="flex flex-row gap-2 items-center">
          <LiaCheckSolid size={18} />
          <p> 100 AZN {t("free_shipping_threshold")} </p>
        </div>
      </div>
    </div>
  );
}

export default ActionsProduct;
