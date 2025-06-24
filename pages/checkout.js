"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAuthClient } from "@/shared/context/AuthContext";
import { useBasket } from "@/shared/context/BasketContext";
import { LiaCheckSolid, LiaPlusSolid } from "react-icons/lia";
import { getUserAddresses } from "@/firebase/services/firebaseAddressService";
import { createOrder } from "@/firebase/services/firebaseOrderService";
import {
  createOrUpdateUserProfile,
  getUserProfile,
} from "@/firebase/services/firebaseUserService";
import AddressForm from "@/components/AddressForm/AddressForm";
import CustomToast from "@/components/CustomToast/CustomToast";
import Header from "@/components/Header";
import NavList from "@/components/NavList";
import Container from "@/components/Container";
import { fetchSizes } from "@/firebase/services/sizeService";
import { fetchCategories } from "@/firebase/services/categoriesService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";
import { clearBasket } from "@/firebase/services/basketService";

export default function CheckoutPage({ categories, modalNewProducts }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuthClient();
  const { basketItems, updateBasketItems } = useBasket();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryTimeRange, setDeliveryTimeRange] = useState("");
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cashAmount, setCashAmount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderDetailsRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(true);
  const [useExistingPhone, setUseExistingPhone] = useState(false);
  const [phoneNumberConfirmed, setPhoneNumberConfirmed] = useState(false);

  const deliveryTimeOptions = [
    { name: `${t("morning")}: 10:00 - 12:00` },
    { name: `${t("afternoon")}: 12:00 - 15:00` },
    { name: `${t("evening")}: 15:00 - 18:00` },
  ];

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const addressesList = await getUserAddresses(user.uid);
        setAddresses(addressesList);
        const defaultAddress =
          addressesList.find((addr) => addr.isDefault) || addressesList[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setToastMessage(t("error_loading_addresses"));
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    const loadSizes = async () => {
      try {
        const sizesList = await fetchSizes();
        const activeSizes = sizesList.filter((size) => size.is_active);
        setSizes(activeSizes);

        const basketSizes = basketItems
          .map((item) => {
            const matchingSize = activeSizes.find(
              (size) => size.value === item.size
            );
            return matchingSize?.id;
          })
          .filter(Boolean);
        setSelectedSizes(basketSizes);
      } catch (error) {
        console.error("Error loading sizes:", error);
        setToastMessage(t("error_loading_sizes"));
        setShowToast(true);
      }
    };

    const loadUserProfile = async () => {
      if (user) {
        try {
          const userData = await getUserProfile(user.uid);
          if (userData?.phoneNumber) {
            // strip +994 if present:
            const local = userData.phoneNumber.replace(/^\+994/, "");
            setPhoneNumber(local);
            setShowPhoneInput(false);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setToastMessage(t("error_loading_profile"));
          setShowToast(true);
        }
      }
    };

    fetchAddresses();
    loadSizes();
    loadUserProfile();
  }, [user, t, basketItems]);

  const handleAddressSuccess = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setToastMessage(t("address_added_successfully"));
    setShowToast(true);
  };

  const handleSizeSelection = (sizeId) => {
    setSelectedSizes((prev) => {
      let newSizes;

      if (prev.includes(sizeId)) {
        newSizes = prev.filter((id) => id !== sizeId);
      } else if (prev.length < 2) {
        newSizes = [...prev, sizeId];
      } else {
        newSizes = [...prev.slice(0, -1), sizeId];
      }

      if (newSizes.length > 0 && errors.sizes) {
        setErrors((e) => ({ ...e, sizes: undefined }));
      }

      return newSizes;
    });
  };

  const calculateSubtotal = () => {
    return basketItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const calculateDelivery = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return subtotal >= 100 ? 0 : 5;
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const delivery = calculateDelivery();
    return (subtotal + delivery).toFixed(2);
  };

  const formatPhoneNumber = (number) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, "");
    // If number starts with 994, remove it
    const withoutPrefix = cleaned.startsWith("994")
      ? cleaned.slice(3)
      : cleaned;
    // Return with +994 prefix
    return `+994${withoutPrefix}`;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // Limit to 9 digits (excluding +994)
    const limited = cleaned.slice(0, 9);
    setPhoneNumber(limited);

    // If we have a valid phone number (9 digits), confirm it
    if (limited.length === 9) {
      setPhoneNumberConfirmed(true);
      setUseExistingPhone(false);
      // Clear any phone-related errors
      setErrors((prev) => ({
        ...prev,
        phoneNumber: undefined,
      }));
    }
  };

  const handleUseExistingPhone = () => {
    setUseExistingPhone(true);
    setPhoneNumberConfirmed(true);
    setShowPhoneInput(true);
    const local = phoneNumber.replace(/^\+994/, "");
    setPhoneNumber(local);
    setErrors((prev) => ({
      ...prev,
      phoneSelection: undefined,
      phoneNumber: undefined,
    }));
  };

  const handleEnterNewPhone = () => {
    console.log("Before state update:", {
      showPhoneInput,
      useExistingPhone,
      phoneNumberConfirmed,
    });

    setPhoneNumber("");
    setPhoneNumberConfirmed(false);
    setUseExistingPhone(false);
    setShowPhoneInput(true);

    setErrors((prev) => ({
      ...prev,
      phoneSelection: undefined,
      phoneNumber: undefined,
    }));

    setTimeout(() => {
      console.log("After state update:", {
        showPhoneInput,
        useExistingPhone,
        phoneNumberConfirmed,
      });
    }, 0);
  };

  useEffect(() => {
    console.log("State changed:", {
      showPhoneInput,
      useExistingPhone,
      phoneNumberConfirmed,
    });
  }, [showPhoneInput, useExistingPhone, phoneNumberConfirmed]);

  const renderPhoneInput = () => {
    console.log("Rendering phone input with states:", {
      showPhoneInput,
      useExistingPhone,
      phoneNumberConfirmed,
      phoneNumber,
    });

    if (showPhoneInput || phoneNumberConfirmed) {
      return (
        <div className="mb-4">
          <label className="block text-sm text-neutral-700 mb-1">
            {t("phone_number")}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
              +994
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className={`w-full pl-12 pr-3 py-2 border text-neutral-800 ${
                errors.phoneNumber ? "border-red-500" : "border-neutral-300"
              } focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent`}
              placeholder="xx xxx xx xx"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      );
    }

    if (phoneNumber && !phoneNumberConfirmed) {
      return (
        <div className="space-y-4">
          <div
            className={`p-4 border text-neutral-800 ${
              errors.phoneSelection ? "border-red-500" : "border-neutral-200"
            } bg-neutral-50`}
          >
            <p className="text-neutral-700 mb-2">
              {t("existing_phone_number")}
            </p>
            <p className="text-neutral-900 font-medium mb-4">
              {formatPhoneNumber(phoneNumber)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleUseExistingPhone}
                className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                {t("use_this_number")}
              </button>
              <button
                onClick={handleEnterNewPhone}
                className="px-4 py-2 border text-neutral-700 border-neutral-200 hover:border-neutral-400 transition-colors"
              >
                {t("enter_new_number")}
              </button>
            </div>
            {errors.phoneSelection && (
              <p className="text-red-500 text-sm mt-2">
                {errors.phoneSelection}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedAddress) {
      newErrors.address = t("address_required");
    }
    if (!deliveryTimeRange) {
      newErrors.deliveryTime = t("delivery_time_required");
    }
    if (selectedSizes.length === 0) {
      newErrors.sizes = t("sizes_required");
    }
    if (paymentMethod === "cash" && !cashAmount) {
      newErrors.cashAmount = t("cash_amount_required");
    }

    if (!phoneNumber || phoneNumber.length !== 9) {
      newErrors.phoneNumber = t("phone_number_required");
    }
    if (phoneNumber && !phoneNumberConfirmed) {
      newErrors.phoneSelection = t("select_phone_option_required");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      orderDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (phoneNumber) {
        await createOrUpdateUserProfile(user.uid, {
          phoneNumber: formatPhoneNumber(phoneNumber),
        });
      }

      const orderData = {
        userId: user.uid,
        userInfo: {
          name: user.displayName || selectedAddress.fullName,
          email: user.email,
          phone: formatPhoneNumber(phoneNumber),
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
        },
        items: basketItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        deliveryDetails: {
          timeRange: deliveryTimeRange,
          description: description,
          selectedSizes: selectedSizes,
        },
        payment: {
          method: paymentMethod,
          amount: paymentMethod === "cash" ? cashAmount : calculateTotal(),
        },
        total: calculateTotal(),
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDelivery(),
      };

      await createOrder(orderData);

      await clearBasket(user.uid);
      updateBasketItems([]);

      setToastMessage(t("order_placed_successfully"));
      setShowToast(true);

      setDescription("");
      setDeliveryTimeRange("");
      setSelectedSizes([]);
      setPaymentMethod("card");
      setCashAmount("");
      setErrors({});

      setTimeout(() => {
        router.push("/profile?tab=orders");
      }, 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      setToastMessage(t("error_placing_order"));
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
      />
      <Header modalNewProducts={modalNewProducts} categories={categories} />
      <NavList onMenuToggle={setIsMenuOpen} />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-gilroy">
          <div className="lg:col-span-2">
            <div className="bg-white p-6">
              <h2 className="text-xl mb-4 text-neutral-800">{t("delivery_address")}</h2>

              {loading ? (
                <div className="animate-pulse">
                  <div className="h-20 bg-neutral-200 mb-4"></div>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border cursor-pointer transition-all ${
                        selectedAddress?.id === address.id
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-400"
                      } ${errors.address ? "border-red-500" : ""}`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start gap-3 text-neutral-800">
                        <div className="mt-1">
                          <div
                            className={`w-4 h-4  border ${
                              selectedAddress?.id === address.id
                                ? "border-neutral-900 bg-neutral-900"
                                : "border-neutral-400"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-neutral-800" >
                            <p className="">{address.title}</p>
                            {address.isDefault && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 ">
                                {t("default_address")}
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600">{address.fullName}</p>
                          <p className="text-neutral-600">{address.phone}</p>
                          <p className="text-neutral-600">{address.address}</p>
                          <p className="text-neutral-600">
                            {address.city}, {address.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-3 border cursor-pointer border-neutral-200 flex items-center justify-center gap-2 text-neutral-600 hover:border-neutral-400 transition-colors"
                  >
                    <LiaPlusSolid size={20} />
                    {t("add_new_address")}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600 mb-4">
                    {t("no_addresses_found")}
                  </p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="py-2 px-4 border border-neutral-900 text-neutral-800 hover:text-white hover:bg-neutral-900 transition-all duration-500"
                  >
                    {t("add_new_address")}
                  </button>
                </div>
              )}

              <div className="my-6">
                <h2 className="text-xl text-neutral-800 mb-4">{t("contact_information")}</h2>
                {renderPhoneInput()}
              </div>

              <div className="mt-8" ref={orderDetailsRef}>
                <h2 className="text-xl text-neutral-800 mb-5">{t("order_details")}</h2>
                <div className="mb-4">
                  <label className="block text-sm text-neutral-700 mb-1">
                    {t("order_description")}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border text-neutral-800 border-neutral-200"
                    rows="3"
                    placeholder={t("enter_order_description")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-neutral-700 mb-1">
                    {t("delivery_time_range")}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full p-2 border text-left flex justify-between items-center ${
                        errors.deliveryTime
                          ? "border-red-500"
                          : "border-neutral-200"
                      }`}
                    >
                      <span className="text-neutral-600">
                        {deliveryTimeRange || t("select_time_range")}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {errors.deliveryTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.deliveryTime}
                      </p>
                    )}
                    {isDropdownOpen && (
                      <div className="absolute z-10  text-neutral-800 w-full mt-1 bg-white border border-neutral-200 shadow-lg">
                        {deliveryTimeOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                            onClick={() => {
                              setDeliveryTimeRange(option.name);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-neutral-700 mb-1">
                    {t("select_sizes")}
                  </label>
                  <div className="grid  text-neutral-800 grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeSelection(size.id)}
                        className={`p-2 border text-center ${
                          selectedSizes.includes(size.id)
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-400"
                        } ${errors.sizes ? "border-red-500" : ""}`}
                      >
                        {size.value}
                      </button>
                    ))}
                  </div>
                  {errors.sizes && (
                    <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-neutral-700 mb-1">
                    {t("payment_method")}
                  </label> 
                  <div className="space-y-2 text-neutral-800">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      {t("card_payment")}
                    </label>
                    <label className="flex items-center gap-2 text-neutral-800">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      {t("cash_payment")}
                    </label>
                  </div>
                </div>

                {paymentMethod === "cash" && (
                  <div className="mb-4">
                    <label className="block text-sm text-neutral-700 mb-1">
                      {t("cash_amount")}
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className={`w-full p-2 border text-neutral-800 ${
                        errors.cashAmount
                          ? "border-red-500"
                          : "border-neutral-200"
                      }`}
                      placeholder={t("enter_cash_amount")}
                    />
                    {errors.cashAmount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cashAmount}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-neutral-800">
                {t("order_summary")}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-neutral-600">{t("subtotal")}</p>
                  <span className="text-neutral-800">{calculateSubtotal()} ₼</span>
                </div>

                <div className="flex justify-between">
                  <p className="text-neutral-600">{t("delivery")}</p>
                  <span className="text-neutral-800">
                    {calculateDelivery() === 0
                      ? t("free")
                      : `${calculateDelivery()} ₼`}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <p className="text-neutral-800">{t("total")}</p>
                    <span className="text-neutral-800">{calculateTotal()} ₼</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("placing_order") : t("place_order")}
                </button>

                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <LiaCheckSolid size={18} />
                    <p>{t("delivery_time")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LiaCheckSolid size={18} />
                    <p>100 AZN {t("free_shipping_threshold")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {showAddressForm && (
        <AddressForm
          onClose={() => setShowAddressForm(false)}
          onSuccess={handleAddressSuccess}
        />
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [categories, allProducts] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
    ]);

    const last10Products = allProducts.slice(0, 10);

    const newProducts = allProducts.filter((p) => p.is_new).slice(-4);

    const modalNewProducts = allProducts.filter((p) => p.is_new).slice(-6);

    return {
      props: {
        categories,
        products: last10Products,
        newProducts,
        modalNewProducts,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data on server:", error);
    return {
      props: {
        categories: [],
        products: [],
        newProducts: [],
        modalNewProducts: [],
      },
    };
  }
}
