import { useRouter } from "next/router";
import React, { useState } from "react";
import Container from "../Container";
import {
  PiHeartLight,
  PiUserLight,
  PiBasketLight,
} from "react-icons/pi";
import { PiPackage } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import PersonalInfo from "./PersonalInfo";
import AddressDetails from "./AddressDetails";
import { useTranslation } from "react-i18next";
import OrdersUserSingle from "../Orders";

function ProfileInformation({ user, orders, onLogout, initialTab = "personal" }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [birthday, setBirthday] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!user) {
    router.push("/login");
    return null;
  }

  const { displayName, email, phoneNumber, photoURL } = user;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === "wishlist") {
      router.push("/wishlist");
    } else if (tab === "basket") {
      router.push("/basket");
    }
  };

  return (
    <Container>
      <div className="w-full flex flex-col md:flex-row gap-5 my-10 mx-auto relative">
        {/* Sidebar Navigation */}
        <div className="hidden md:flex w-full md:w-[20%]  gap-3 flex-col md:sticky md:top-10 md:self-start">
          <div
            className={`font-gilroy text-lg py-3 px-5 ${
              activeTab === "personal"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center -t-lg cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => setActiveTab("personal")}
          >
            <PiUserLight className="text-xl" />
            <p>{t("personal_information")}</p>
          </div>
          <div
            className={`font-gilroy text-lg py-3 px-5 ${
              activeTab === "orders"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => handleNavigation("orders")}
          >
            <PiPackage className="text-xl" />
            <p>{t("orders")}</p>
          </div>

          <div
            className={`font-gilroy text-lg py-3 px-5 ${
              activeTab === "basket"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => handleNavigation("basket")}
          >
            <PiBasketLight className="text-xl" />
            <p>{t("basket")}</p>
          </div>
        
          <div
            className={`font-gilroy text-lg py-3 px-5 ${
              activeTab === "wishlist"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => handleNavigation("wishlist")}
          >
            <PiHeartLight className="text-xl" />
            <p>{t("wishlist_title")}</p>
          </div>
          <div
            className={`font-gilroy text-lg py-3 px-5 ${
              activeTab === "address"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => setActiveTab("address")}
          >
            <SlLocationPin className="text-xl" />
            <p>{t("address_details")}</p>
          </div>
         
          <div className="">
            <button
              onClick={onLogout}
              className="w-full border  border-neutral-200 text-neutral-700 font-gilroy cursor-pointer py-2 transition-colors hover:bg-neutral-50 "
            >
              {t("logout")}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-[80%] font-gilroy mx-auto bg-white p-6 ">
          {activeTab === "personal" && <PersonalInfo user={user} />}
          {activeTab === "address" && <AddressDetails user={user} />}
          {activeTab === "orders" && <OrdersUserSingle />}
        </div>
      </div>
    </Container>
  );
}

export default ProfileInformation;
