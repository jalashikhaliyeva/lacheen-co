import React from "react";
import BasketSectionHeader from "./BasketSectionHeader";
import BasketSectionItems from "./BasketSectionItems";
import BasketSectionTotal from "./BasketSectionTotal";

function BasketSectionContainer() {
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
