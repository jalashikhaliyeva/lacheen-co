import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GoTrash } from "react-icons/go";
import { SlLocationPin } from "react-icons/sl";
import {
  getUserProfile,
  addUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from "@/firebase/services/firebaseUserService";
import CustomToast from "../CustomToast/CustomToast";

function AddressDetails({ user }) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState({});

  const [newAddress, setNewAddress] = useState({
    title: "",
    fullName: user?.displayName || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    const loadAddresses = async () => {
      if (user) {
        try {
          const userData = await getUserProfile(user.uid);
          if (userData && userData.addresses) {
            setAddresses(userData.addresses);
          }
        } catch (error) {
          console.error("Error loading addresses:", error);
          setToastMessage(t("error_loading_addresses"));
          setShowToast(true);
        }
      }
    };

    loadAddresses();
  }, [user, t]);

  const closeToast = () => setShowToast(false);

  const validateForm = () => {
    const newErrors = {};
    if (!newAddress.title.trim()) {
      newErrors.title = t("address_title_required");
    }
    if (!newAddress.fullName.trim()) {
      newErrors.fullName = t("full_name_required");
    }
    if (!newAddress.phone.trim()) {
      newErrors.phone = t("phone_required");
    }
    if (!newAddress.address.trim()) {
      newErrors.address = t("address_required");
    }
    if (!newAddress.city.trim()) {
      newErrors.city = t("city_required");
    }
    if (!newAddress.postalCode.trim()) {
      newErrors.postalCode = t("postal_code_required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSaving(true);
    try {
      const updatedAddresses = await addUserAddress(user.uid, newAddress);
      if (updatedAddresses) {
        setAddresses(updatedAddresses);
        setNewAddress({
          title: "",
          fullName: user?.displayName || "",
          phone: "",
          address: "",
          city: "",
          postalCode: "",
          isDefault: false,
        });
        setErrors({});
        setShowAddForm(false);
        setToastMessage(t("address_added_successfully"));
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      setToastMessage(t("error_adding_address"));
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const updatedAddresses = await setDefaultAddress(user.uid, id);
      if (updatedAddresses) {
        setAddresses(updatedAddresses);
        setToastMessage(t("default_address_updated"));
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      setToastMessage(t("error_updating_default_address"));
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedAddresses = await deleteUserAddress(user.uid, id);
      if (updatedAddresses) {
        setAddresses(updatedAddresses);
        setToastMessage(t("address_deleted_successfully"));
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setToastMessage(t("error_deleting_address"));
      setShowToast(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      <CustomToast
        show={showToast}
        onClose={closeToast}
        message={toastMessage}
      />
      <h2 className="text-2xl font-gilroy text-gray-800 mb-6">
        {t("address_details")}
      </h2>

      <div className="flex flex-col space-y-6">
        {/* Existing Addresses */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 p-4 relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-10">
                    <h3 className="font-medium text-gray-900">
                      {address.title}
                    </h3>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        {t("default_address")}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{address.fullName}</p>
                  <p className="text-gray-700">{address.phone}</p>
                  <p className="text-gray-700">{address.address}</p>
                  <p className="text-gray-700">
                    {address.city}, {address.postalCode}
                  </p>
                </div>
                <div className="flex gap-5">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {t("set_default_address")}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-xl text-red-800 hover:text-red-600"
                  >
                    <GoTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add New Address Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full cursor-pointer md:w-auto px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center"
          >
            <SlLocationPin className="text-lg" />
            <span> {t("add_new_address")}</span>
          </button>
        )}

        {/* Add New Address Form */}
        {showAddForm && (
          <div className="border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("add_new_address")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("address_title")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newAddress.title}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="e.g. Home, Work"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("full_name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={newAddress.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("auth.phone_number")} <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="p-3 bg-gray-100 border border-r-0">+994</div>
                  <input
                    type="text"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleInputChange}
                    maxLength={15}
                    placeholder="xx xxx xx xx"
                    className={`border w-full p-3 focus:outline-none focus:shadow-outline ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("city")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="Baku"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("street_address")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={newAddress.address}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("postal_code")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.postalCode ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="AZ1000"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="defaultAddress"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="defaultAddress" className="text-sm text-gray-700">
                {t("set_default_address")}
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleAddAddress}
                disabled={isSaving}
                className={`px-6 py-2 text-white ${
                  isSaving ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                } transition-colors`}
              >
                {isSaving ? t("saving") : t("save_address")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressDetails;
