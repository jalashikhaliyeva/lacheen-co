import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Container from "../Container";
import {
  PiCalendarLight,
  PiGiftLight,
} from "react-icons/pi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import {
  createOrUpdateUserProfile,
  getUserProfile,
} from "@/firebase/services/firebaseUserService";
import CustomToast from "../CustomToast/CustomToast";
function PersonalInfo({ user }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [birthday, setBirthday] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    birthday: null,
  });

  const getUserInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userData = await getUserProfile(user.uid);
          // Prioritize Firebase Auth displayName if it exists
          const displayName = user.displayName || userData?.displayName || "";

          setFormData({
            displayName: displayName,
            phoneNumber: userData?.phoneNumber || "",
            birthday: userData?.birthday ? new Date(userData.birthday) : null,
          });
          setBirthday(userData?.birthday ? new Date(userData.birthday) : null);

          // If we have a displayName from Auth but not in database, save it
          if (user.displayName && (!userData || !userData.displayName)) {
            await createOrUpdateUserProfile(user.uid, {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            });
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setToastMessage(t("error_loading_profile"));
          setShowToast(true);
        }
      }
    };

    loadUserData();
  }, [user, t]);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createOrUpdateUserProfile(user.uid, {
        ...formData,
        birthday: birthday?.toISOString(),
        email: user.email,
        photoURL: user.photoURL,
      });
      setSaveSuccess(true);
      setToastMessage(t("changes_saved_successfully"));
      setShowToast(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setToastMessage(t("error_saving_profile"));
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const closeToast = () => setShowToast(false);

  return (
    <div>
      <CustomToast
        show={showToast}
        onClose={closeToast}
        message={toastMessage}
      />
      <h2 className="text-2xl font-gilroy text-gray-800 mb-6">
        {t("personal_information")}
      </h2>

      <div className="flex flex-col space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
            <span className="text-lg font-medium text-neutral-600 font-helvetica">
              {getUserInitials(formData.displayName || user.displayName)}
            </span>
          </div>

          {/* <div>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              {t("change_photo")}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {t("photo_upload_hint")}
            </p>
          </div> */}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-700">{t("full_name")}</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full p-3 border text-neutral-800 border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-700">{t("auth.email")}</label>
            <input
              type="email"
              value={user.email || ""}
              className="w-full p-3 border cursor-not-allowed text-neutral-800 border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
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
            <label className="text-sm text-gray-700">
              {t("auth.phone_number")}
            </label>
            <div className="flex">
              <div className="p-3 bg-gray-100 border border-r-0 text-neutral-800">
                +994
              </div>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                maxLength={15}
                placeholder="xx xxx xx xx"
                className="border w-full p-3 focus:outline-none focus:shadow-outline text-neutral-800"
              />
            </div>
          </div>
        </div>

        {/* Birthday Field with Calendar */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-gray-700 flex items-center gap-2">
            <PiCalendarLight className="text-xl" />
            {t("birthday")}
          </label>
          <div className="relative">
            <DatePicker
              selected={birthday}
              onChange={(date) => {
                setBirthday(date);
                setFormData((prev) => ({ ...prev, birthday: date }));
              }}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select your birthday"
              className="w-full p-3 border border-gray-300 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
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
              className={`px-6 py-2 text-white ${
                isSaving ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              } transition-colors`}
            >
              {isSaving ? t("saving") : t("save_changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
