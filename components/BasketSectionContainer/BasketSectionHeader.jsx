import React from "react";
import { useTranslation } from "react-i18next";
import { useAuthClient } from "@/shared/context/AuthContext";
import { useBasket } from "@/shared/context/BasketContext";

function BasketSectionHeader() {
  const { user } = useAuthClient();
  const { t } = useTranslation();
  const { basketItems } = useBasket();

  if (!user) {
    return null;
  }

  return (
    <>
      <h1 className="font-gilroy text-black text-lg pb-5">
        {t("items")} ({basketItems.length})
      </h1>
    </>
  );
}

export default BasketSectionHeader;
