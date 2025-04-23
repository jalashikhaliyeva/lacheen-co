import React from "react";
import { SlBasket } from "react-icons/sl";
import { RiLoader2Line } from "react-icons/ri";
import { RiEBike2Line } from "react-icons/ri";
import { BsBagCheck } from "react-icons/bs";

function DashboardOrders() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightOrange rounded-full p-3">
          <SlBasket className="text-lightOrangeText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base">Total Orders</p>
          <p className="text-2xl text-neutral-700 font-semibold">860</p>
        </div>
      </div>
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightBluee rounded-full p-3">
          <RiLoader2Line className="text-lightBlueeText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base">Orders Pending</p>
          <p className="text-2xl text-neutral-700 font-semibold">269</p>
        </div>
      </div>
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightGreenBox rounded-full p-3">
          <RiEBike2Line className="text-lightGreenBoxText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base">Orders Processing</p>
          <p className="text-2xl text-neutral-700 font-semibold">120</p>
        </div>
      </div>
      <div className="bg-white border border-neutral-300 p-4 rounded-lg flex gap-3 items-center justify-center">
        <div className="bg-lightGreenBox2 rounded-full p-3">
          <BsBagCheck className="text-lightGreenBoxText text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base">Orders Delivered</p>
          <p className="text-2xl text-neutral-700 font-semibold">120</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardOrders;
