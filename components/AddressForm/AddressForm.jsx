"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthClient } from "@/shared/context/AuthContext";
import { addAddress } from "@/firebase/services/firebaseAddressService";

function AddressForm({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const { user } = useAuthClient();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    fullName: user?.displayName || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isDefault: false,
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = t("address_title_required");
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = t("full_name_required");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("phone_required");
    }
    if (!formData.address.trim()) {
      newErrors.address = t("address_required");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("city_required");
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t("postal_code_required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setLoading(true);
    try {
      const updatedAddresses = await addAddress(user.uid, formData);
      onSuccess(updatedAddresses[updatedAddresses.length - 1]); // Return the newly added address
      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 font-gilroy flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md max-h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white z-10 p-6 pb-0 border-b border-neutral-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">
              {t("add_new_address")}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 pt-4 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("address_title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full  px-3 py-2 border text-neutral-800 ${
                  errors.title
                    ? "border-red-500 text-neutral-800"
                    : "border-neutral-300 text-neutral-800"
                } rounded-lg focus:outline-none focus:ring-2 placeholder:text-neutral-800 focus:ring-neutral-900 focus:border-transparent`}
                placeholder="e.g. Home, Work"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("full_name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3 placeholder:text-neutral-800 py-2 text-neutral-800 border ${
                  errors.fullName
                    ? "border-red-500 text-neutral-800"
                    : "border-neutral-300 text-neutral-800"
                } rounded-lg focus:outline-none focus:ring-2 text-neutral-800 focus:ring-neutral-900 focus:border-transparent`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("auth.phone_number")} <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="px-3 py-2 bg-neutral-100 text-neutral-800 border border-r-0 rounded-l-lg">
                  +994
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border text-neutral-800 ${
                    errors.phone ? "border-red-500" : "border-neutral-300"
                  } rounded-r-lg focus:outline-none focus:ring-2 text-neutral-800 focus:ring-neutral-900 focus:border-transparent`}
                  placeholder="xx xxx xx xx"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("street_address")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3 py-2 border text-neutral-800 ${
                  errors.address ? "border-red-500" : "border-neutral-300"
                } rounded-lg focus:outline-none focus:ring-2 text-neutral-800 focus:ring-neutral-900 focus:border-transparent`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("city")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border text-neutral-800 ${
                  errors.city ? "border-red-500" : "border-neutral-300"
                } rounded-lg focus:outline-none focus:ring-2 text-neutral-800 focus:ring-neutral-900 focus:border-transparent`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("postal_code")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border text-neutral-800 ${
                  errors.postalCode ? "border-red-500" : "border-neutral-300"
                } rounded-lg focus:outline-none focus:ring-2 text-neutral-800 focus:ring-neutral-900 focus:border-transparent`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded"
              />
              <label className="ml-2 block text-sm text-neutral-700">
                {t("set_as_default")}
              </label>
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
