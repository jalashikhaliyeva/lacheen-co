import React, { useState } from "react";
import {
  LiaCheckSolid,
  LiaChevronDownSolid,
  LiaChevronUpSolid,
} from "react-icons/lia";

function BasketSectionTotal() {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex flex-col gap-1 md:gap-4 w-full font-gilroy bg-white p-4 md:p-5 border-neutral-200">
      <h2 className="hidden md:block text-lg md:text-xl font-semibold">
        Order Summary
      </h2>

      {/* Always visible on desktop, hidden on mobile behind toggle */}
      <div className="hidden md:block">
        <div className="flex flex-row justify-between">
          <p className="text-base md:text-lg">Subtotal</p>
          <span className="text-base">1555 ₼</span>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-base md:text-lg">Teslimat</p>
          <span className="text-base">odenishsiz</span>
        </div>
      </div>

      <div className="flex flex-row justify-between  md:border-t border-neutral-200 pt-3">
        <p className="text-base md:text-lg uppercase font-medium">Total</p>
        <span className="text-base font-semibold">1555 ₼</span>
      </div>

      {/* Mobile toggle for additional information */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mt-2">
          <button onClick={toggleDetails} className="text-sm text-neutral-600">
            {showDetails ? "Hide details" : "Show details"}
          </button>
          <button onClick={toggleDetails}>
            {showDetails ? (
              <LiaChevronUpSolid size={16} className="text-neutral-600" />
            ) : (
              <LiaChevronDownSolid size={16} className="text-neutral-600" />
            )}
          </button>
        </div>

        {/* Dropdown content with smooth transition */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showDetails ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mt-1">
            <div className="flex flex-row justify-between mb-2">
              <p className="text-base">Subtotal</p>
              <span className="text-base">1555 ₼</span>
            </div>
            <div className="flex flex-row justify-between mb-3">
              <p className="text-base">Teslimat</p>
              <span className="text-base">odenishsiz</span>
            </div>

            <div className="flex flex-col gap-2 text-sm pb-2">
              <div className="flex flex-row gap-2 items-center">
                <LiaCheckSolid size={18} />
                <p>Delivering in 10 days</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <LiaCheckSolid size={18} />
                <p>900 TL üzeri alışverişlerde ücretsiz kargo</p>
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
        >
          Buy now, don't miss it!
        </button>
      </div>

      {/* Always visible on desktop */}
      <div className="hidden md:flex mt-4 md:mt-5 flex-col gap-2 text-sm md:text-base">
        <div className="flex flex-row gap-2 items-center">
          <LiaCheckSolid size={18} />
          <p>Delivering in 10 days</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <LiaCheckSolid size={18} />
          <p>900 TL üzeri alışverişlerde ücretsiz kargo</p>
        </div>
      </div>
    </div>
  );
}

export default BasketSectionTotal;
