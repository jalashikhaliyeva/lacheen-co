import React from "react";
import { SlBasket } from "react-icons/sl";
import { PiPackage } from "react-icons/pi";
import { FaRegCreditCard } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineCalendarMonth } from "react-icons/md";
function DashboardStatistics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 py-10 ">
      <div className="flex flex-col bg-teal-600 font-helvetica rounded-lg p-6 text-white">
        <PiPackage className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">Today Orders</h2>
        <p className="text-2xl text-center">₼ 1000</p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>120</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>20</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxOrange font-helvetica rounded-lg p-6 text-white">
        <MdOutlineCalendarMonth className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">Yesterday Orders</h2>
        <p className="text-2xl text-center">₼ 253.26</p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>253.26</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>00</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxBlue font-helvetica rounded-lg p-6 text-white">
        <SlBasket className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">This Month</h2>
        <p className="text-2xl text-center">₼ 33247.86</p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>33120</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>2220</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxLightBlue font-helvetica rounded-lg p-6 text-white">
        <FaRegCreditCard className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">Last Month</h2>
        <p className="text-2xl text-center">₼ 28486.10</p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>120</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>20</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-boxGreen font-helvetica rounded-lg p-6 text-white">
        <GiReceiveMoney className="m-auto text-5xl mb-2" />
        <h2 className="text-lg text-center">All-Time Sales</h2>
        <p className="text-2xl text-center">₼ 563244.72</p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="flex flex-col text-sm">
            <p>Cash : </p>
            <p>120</p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Card : </p>
            <p>20</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStatistics;
