import React, { useState, useEffect } from "react";
import { SlBasket } from "react-icons/sl";
import { RiLoader2Line } from "react-icons/ri";
import { RiEBike2Line } from "react-icons/ri";
import { BsBagCheck } from "react-icons/bs";
import { getOrderCounts } from "@/firebase/services/firebaseOrderService";
import { useTranslation } from "react-i18next";

function DashboardOrders() {
  const [orderCounts, setOrderCounts] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    cancelled: 0,
    delivered: 0
  });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        const counts = await getOrderCounts();
        setOrderCounts(counts);
      } catch (error) {
        console.error("Error fetching order counts:", error);
      }
    };

    fetchOrderCounts();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightOrange rounded-full p-3">
          <SlBasket className="text-lightOrangeText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base text-neutral-800">{t("total_orders")}</p>
          <p className="text-2xl text-neutral-700 font-semibold">{orderCounts.total}</p>
        </div>
      </div>
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightBluee rounded-full p-3">
          <RiLoader2Line className="text-lightBlueeText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base text-neutral-800">{t("orders_pending")}</p>
          <p className="text-2xl text-neutral-700 font-semibold">{orderCounts.pending}</p>
        </div>
      </div>
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightGreenBox rounded-full p-3">
          <RiEBike2Line className="text-lightGreenBoxText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base text-neutral-800">{t("orders_cancelled")}</p>
          <p className="text-2xl text-neutral-700 font-semibold">{orderCounts.cancelled}</p>
        </div>
      </div>
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightGreenBox2 rounded-full p-3">
          <BsBagCheck className="text-lightGreenBoxText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base text-neutral-800">{t("orders_delivered")}</p>
          <p className="text-2xl text-neutral-700 font-semibold">{orderCounts.delivered}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardOrders;
