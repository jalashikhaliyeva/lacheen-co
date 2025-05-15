import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GoTrash } from "react-icons/go";
import { PiMinusSquareLight } from "react-icons/pi";
import { RiDeleteBack2Line } from "react-icons/ri";
import { SlLocationPin } from "react-icons/sl";

function AddressDetails({ user }) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Home",
      fullName: "John Doe",
      phone: "+994 55 123 45 67",
      address: "123 Main Street",
      city: "Baku",
      postalCode: "AZ1000",
      isDefault: true,
    },
    {
      id: 2,
      title: "Work",
      fullName: "John Doe",
      phone: "+994 55 987 65 43",
      address: "456 Business Center",
      city: "Baku",
      postalCode: "AZ1001",
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    title: "",
    fullName: user?.displayName || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isDefault: false,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleAddAddress = () => {
    if (newAddress.isDefault) {
      // If setting as default, unset all other defaults
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    setAddresses((prev) => [...prev, { ...newAddress, id: Date.now() }]);
    setNewAddress({
      title: "",
      fullName: user?.displayName || "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false,
    });
    setShowAddForm(false);
    handleSave();
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    handleSave();
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    handleSave();
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
                  {" "}
                  {t("address_title")}
                </label>
                <input
                  type="text"
                  name="title"
                  value={newAddress.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="e.g. Home, Work"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {" "}
                  {t("full_name")}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={newAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("auth.phone_number")}
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
                    className="border w-full p-3 focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">{t("city")}</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Baku"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("street_address")}
                </label>
                <input
                  type="text"
                  name="address"
                  value={newAddress.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-700">
                  {t("postal_code")}
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="AZ1000"
                />
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
                {isSaving ? "Saving..." : "Save Address"}
              </button>
              {saveSuccess && (
                <p className="text-green-600 text-sm flex items-center">
                  {t("changes_saved_successfully")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressDetails;
