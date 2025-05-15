import { useRouter } from "next/router";
import React, { useState } from "react";
import Container from "../Container";
import {
  PiHeartLight,
  PiUserLight,
  PiBasketLight,
  PiCalendarLight,
  PiGiftLight,
} from "react-icons/pi";
import { TfiSearch } from "react-icons/tfi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SlLocationPin } from "react-icons/sl";
import PersonalInfo from "./PersonalInfo";
import AddressDetails from "./AddressDetails";
import { useTranslation } from "react-i18next";

function ProfileInformation({ user, orders, onLogout }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [birthday, setBirthday] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

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
      <div className="w-full flex flex-col md:flex-row gap-5 my-10 mx-auto">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-[20%] flex gap-3 flex-col">
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
              activeTab === "address"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => setActiveTab("address")}
          >
            <SlLocationPin className="text-xl" />
            <p>{t("address_details")}</p>
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
              activeTab === "basket"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600"
            } gap-3 flex items-center cursor-pointer hover:bg-neutral-50 transition-colors`}
            onClick={() => handleNavigation("basket")}
          >
            <PiBasketLight className="text-xl" />
            <p>{t("basket")}</p>
          </div>
          <div className="mt-auto">
            <button
              onClick={onLogout}
              className="w-full border mt-5 border-neutral-200 text-neutral-700 font-gilroy cursor-pointer py-2 transition-colors hover:bg-neutral-50 -b-lg"
            >
  {t("logout")}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-[80%] font-gilroy mx-auto bg-white p-6">
          {activeTab === "personal" && <PersonalInfo user={user} />}
          {activeTab === "address" && <AddressDetails user={user} />}
        </div>
      </div>
    </Container>
  );
}

export default ProfileInformation;
