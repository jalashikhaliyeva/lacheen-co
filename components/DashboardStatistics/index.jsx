import React, { useState, useEffect } from "react";
import { SlBasket } from "react-icons/sl";
import { PiPackage } from "react-icons/pi";
import { FaRegCreditCard } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { getOrderStatistics } from "@/firebase/services/firebaseOrderService";
import { useTranslation } from "react-i18next";

function DashboardStatistics() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    today: { total: 0, cash: 0, card: 0 },
    yesterday: { total: 0, cash: 0, card: 0 },
    thisMonth: { total: 0, cash: 0, card: 0 },
    lastMonth: { total: 0, cash: 0, card: 0 },
    allTime: { total: 0, cash: 0, card: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statistics = await getOrderStatistics();
        setStats(statistics);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 py-10 mt-10">
      <div className="flex flex-col bg-teal-600 font-helvetica rounded-lg  p-6 text-white">
        <PiPackage className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">{t("today_orders")}</h2>
        <p className="text-2xl text-center">
          ₼ {formatAmount(stats.today.total)}
        </p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>{formatAmount(stats.today.cash)}</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>{formatAmount(stats.today.card)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxOrange font-helvetica rounded-lg p-6 text-white">
        <MdOutlineCalendarMonth className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">{t("yesterday_orders")}</h2>
        <p className="text-2xl text-center">
          ₼ {formatAmount(stats.yesterday.total)}
        </p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>{formatAmount(stats.yesterday.cash)}</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>{formatAmount(stats.yesterday.card)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxBlue font-helvetica rounded-lg p-6 text-white">
        <SlBasket className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">{t("this_month")}</h2>
        <p className="text-2xl text-center">
          ₼ {formatAmount(stats.thisMonth.total)}
        </p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>{formatAmount(stats.thisMonth.cash)}</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>{formatAmount(stats.thisMonth.card)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxLightBlue font-helvetica rounded-lg p-6 text-white">
        <FaRegCreditCard className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">{t("last_month")}</h2>
        <p className="text-2xl text-center">
          ₼ {formatAmount(stats.lastMonth.total)}
        </p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>{formatAmount(stats.lastMonth.cash)}</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>{formatAmount(stats.lastMonth.card)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxGreen font-helvetica rounded-lg p-6 text-white">
        <GiReceiveMoney className="m-auto text-5xl mb-2" />
          <h2 className="text-lg text-center">{t("all_time_sales")}</h2>
        <p className="text-2xl text-center">
          ₼ {formatAmount(stats.allTime.total)}
        </p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>{formatAmount(stats.allTime.cash)}</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>{formatAmount(stats.allTime.card)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStatistics;
