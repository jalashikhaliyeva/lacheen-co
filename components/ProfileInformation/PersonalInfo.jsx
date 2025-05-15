import React, { useState } from "react";
import { useRouter } from "next/router";
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
import { useTranslation } from "react-i18next";
function PersonalInfo({ user }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [birthday, setBirthday] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  return (
    <div>
      <h2 className="text-2xl font-gilroy  text-gray-800 mb-6">
        {t("personal_information")}
      </h2>

      <div className="flex flex-col space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-4 mb-6">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              className="w-16 h-16 -full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 -full bg-gray-100 flex items-center justify-center">
              <PiUserLight className="text-2xl text-gray-400" />
            </div>
          )}
          <div>
            <button className="text-sm  text-blue-600 hover:text-blue-800">
              {t("change_photo")}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {t("photo_upload_hint")}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="text-sm  text-gray-700"> {t("full_name")}</label>
            <input
              type="text"
              defaultValue={displayName || ""}
              className="w-full p-3 border border-gray-300  focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm  text-gray-700">{t("auth.email")}</label>
            <input
              type="email"
              defaultValue={email || ""}
              className="w-full p-3 border cursor-not-allowed border-gray-300  focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
              placeholder="john@example.com"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("contact_support_change_email")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="text-sm  text-gray-700">
              {t("auth.password")}
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300  focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm  text-gray-700">
         
              {t("auth.phone_number")}
            </label>
            <div className="flex">
              <div className="p-3 bg-gray-100 border border-r-0">+994</div>
              <input
                id="phone"
                type="text"
                maxLength={15}
                placeholder="xx xxx xx xx"
                className={`border w-full p-3 focus:outline-none focus:shadow-outline `}
              />
            </div>
          </div>
        </div>

        {/* Birthday Field with Calendar */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm  text-gray-700 flex items-center gap-2">
            <PiCalendarLight className="text-xl" />
              {t("birthday")}
          </label>
          <div className="relative">
            <DatePicker
              selected={birthday}
              onChange={(date) => setBirthday(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select your birthday"
              className="w-full p-3 border border-gray-300  focus:outline-none focus:ring-1 focus:ring-gray-400"
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
            />
          </div>
          <div className="flex items-center mt-2 p-3 bg-blue-50">
            <PiGiftLight className="text-blue-500 text-xl mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-center text-blue-800">
                  {t("birthday_hint")}
            </p>
          </div>
        </div>

        {/* Save Button with Feedback */}
        <div className="pt-4 w-full flex justify-end">
          <div className="flex items-center">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2  text-white ${
                isSaving ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              } transition-colors`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {saveSuccess && (
              <p className="text-green-600 text-sm mt-2 ml-2">
               {t("changes_saved_successfully")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
