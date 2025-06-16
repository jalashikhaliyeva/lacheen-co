import React from "react";
import BasketSectionHeader from "./BasketSectionHeader";
import BasketSectionItems from "./BasketSectionItems";
import BasketSectionTotal from "./BasketSectionTotal";
import { useAuthClient } from "@/shared/context/AuthContext";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { PiBasketLight } from "react-icons/pi";

function BasketSectionContainer() {
  const { user } = useAuthClient();
  const { t } = useTranslation();

  const handleNavigate = () => {
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-8 w-full font-gilroy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className={`absolute text-neutral-100 animate-pulse opacity-20 text-2xl
                  ${i === 0 ? "top-10 left-10 text-xl" : ""}
                  ${i === 1 ? "top-20 right-16 text-3xl" : ""}
                  ${i === 2 ? "bottom-32 left-20 text-2xl" : ""}
                  ${i === 3 ? "bottom-16 right-12 text-xl" : ""}
                  ${i === 4 ? "top-1/3 left-1/2 text-lg" : ""}
                  ${i === 5 ? "bottom-1/2 right-1/3 text-2xl" : ""}
                `}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
           <PiBasketLight className="text-neutral-700" />
            </span>
          ))}
        </div>

        <div className="text-center z-10">
          <div className="w-24 h-24 mx-auto mb-4 bg-neutral-200 rounded-full flex items-center justify-center z-10">
            <span className="text-4xl text-neutral-700"><PiBasketLight /></span>
          </div>
          <p className="text-lg md:text-2xl font-medium z-10">{t("please_login_to_view_basket")}</p>
          <p className="mt-2 text-neutral-500 mb-6 z-10">{t("your_items_will_be_safe_until_you_return")}</p>
          <button
            onClick={handleNavigate}
            className="group relative z-10 text-neutral-900 cursor-pointer px-8 py-3 rounded-full font-gilroy font-medium transform transition-all duration-300 hover:scale-105"
          >
            {t("auth.login")}
            <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row w-full justify-between gap-5 my-5 md:my-10 px-4 md:px-0">
      {/* Items section */}
      <div className="flex flex-col w-full lg:w-[64%] pb-20 md:pb-0">
        <BasketSectionHeader />
        <BasketSectionItems />
      </div>

      {/* Basket total section - fixed on mobile */}
      <div className="fixed md:relative bottom-0 left-0 right-0 md:left-auto md:right-auto md:bottom-auto w-full md:w-[28%] md:mt-5 lg:mt-0 lg:self-start lg:sticky lg:top-20 z-10 bg-white border-t md:border-t-0 border-neutral-200 shadow-lg md:shadow-none">
        <div className="container mx-auto px-4 md:px-0">
          <BasketSectionTotal />
        </div>
      </div>
    </div>
  );
}

export default BasketSectionContainer;