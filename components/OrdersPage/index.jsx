import React, { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "@/firebase/backendConfig";
import { format } from "date-fns";
import Image from "next/image";
import { FiChevronDown, FiX } from "react-icons/fi";
import { fetchSizes } from "@/firebase/services/sizeService";
import { useTranslation } from "react-i18next";
import { sendStatusUpdateEmail } from "@/firebase/services/emailService";
const cancelReasons = [
  "The sizes are out of stock",
  "We currently do not have this model in this size",
  "Sorry, all our couriers are busy",
  "Product is no longer available",
  "Custom reason",
];

function CustomDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <FiChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-neutral-100 cursor-pointer transition-colors duration-200 ${
                value === option ? "bg-teal-50 text-teal-600" : "text-gray-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [sizes, setSizes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef(null);
  const highlightedOrderRef = useRef(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch both orders and sizes
        const [ordersData, sizesData] = await Promise.all([
          fetchOrders(),
          fetchSizes(),
        ]);

        // Create a map of size IDs to their values
        const sizesMap = sizesData.reduce((acc, size) => {
          acc[size.id] = size.value;
          return acc;
        }, {});

        setSizes(sizesMap);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowCancelModal(false);
        setSelectedOrder(null);
        setCancelReason("");
        setCustomReason("");
      }
    };

    if (showCancelModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCancelModal]);

  useEffect(() => {
    // Get the selected order ID and item ID from localStorage
    const selectedOrderId = localStorage.getItem("selectedOrderId");
    const selectedItemId = localStorage.getItem("selectedItemId");
    if (selectedOrderId) {
      setHighlightedOrderId(selectedOrderId);
      setHighlightedItemId(selectedItemId);
      // Clear the stored IDs
      localStorage.removeItem("selectedOrderId");
      localStorage.removeItem("selectedItemId");
    }
  }, []);

  useEffect(() => {
    if (highlightedOrderRef.current && highlightedOrderId) {
      // Scroll to the highlighted order
      highlightedOrderRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Remove highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedOrderId(null);
        setHighlightedItemId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedOrderId]);

  const fetchOrders = async () => {
    try {
      const db = getDatabase(app);
      const ordersRef = ref(db, "all-orders");
      const snapshot = await get(ordersRef);

      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersList = Object.entries(ordersData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const db = getDatabase(app);
      const orderRef = ref(db, `all-orders/${orderId}`);
      await update(orderRef, {
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
      });
      const updatedOrder = (await get(orderRef)).val();
      await sendStatusUpdateEmail({ id: orderId, ...updatedOrder });
      fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      const db = getDatabase(app);
      const orderRef = ref(db, `all-orders/${orderId}`);
      await update(orderRef, {
        status: "delivered",
        deliveredAt: new Date().toISOString(),
      });
      const updatedOrder = (await get(orderRef)).val();
      await sendStatusUpdateEmail({ id: orderId, ...updatedOrder });
      fetchOrders();
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      const db = getDatabase(app);
      const orderRef = ref(db, `all-orders/${selectedOrder.id}`);
      const finalReason =
        cancelReason === "Custom reason" ? customReason : cancelReason;

      await update(orderRef, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancellationReason: finalReason,
      });
      const updatedOrder = (await get(orderRef)).val();
      await sendStatusUpdateEmail({ id: selectedOrder.id, ...updatedOrder });

      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancelReason("");
      setCustomReason("");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();

    // Search in order ID
    if (order.id.toLowerCase().includes(searchLower)) return true;

    // Search in user info
    if (
      order.userInfo?.name?.toLowerCase().includes(searchLower) ||
      order.userInfo?.phone?.toLowerCase().includes(searchLower)
    )
      return true;

    // Search in items
    if (
      order.items?.some(
        (item) =>
          item.id.toLowerCase().includes(searchLower) ||
          item.name.toLowerCase().includes(searchLower)
      )
    )
      return true;

    return false;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-8 mt-20 text-neutral-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">
          Orders Management
        </h1>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search by name, order ID, item ID, item name, or phone"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-2 flex items-center justify-center p-1"
            >
              <FiX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sizes
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...filteredOrders].reverse().map((order) => (
              <tr
                key={order.id}
                ref={
                  order.id === highlightedOrderId ? highlightedOrderRef : null
                }
                className={`hover:bg-neutral-50 transition-colors duration-200 ${
                  order.id === highlightedOrderId ? "bg-yellow-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-col gap-6 justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">Order ID: {order.id}</span>
                      <span className="text-gray-500">
                        {format(
                          new Date(order.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </span>
                    </div>

                    <div className="space-y-1 max-w-[260px] text-wrap">
                      <div className="text-wrap">
                        Time: {order.deliveryDetails?.timeRange || "N/A"}
                      </div>

                      <div className="text-wrap">Address: {order.userInfo?.address || "N/A"}</div>
                      <div className="text-amber-800 italic text-wrap">
                        {order.deliveryDetails?.description || "No description"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {order.userInfo?.name || "N/A"}
                    </div>
                    <div className="text-gray-500">
                      {order.userInfo?.email || "N/A"}
                    </div>
                    <div className="text-gray-500">
                      {order.userInfo?.phone || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 mb-3 ${
                        item.id === highlightedItemId
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }`}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500">Color: {item.color}</div>
                        <div className="text-gray-500">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-gray-500">
                          Price: {item.price} ₼
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.items?.map((item, index) => (
                    <div key={index} className="mb-2">
                      {item.name} |{" "}
                      <span className="font-medium font-gilroy">
                        {" "}
                        # {item.id}{" "}
                      </span>
                      - <br></br>{" "}
                      {order.deliveryDetails?.selectedSizes?.map(
                        (sizeId, sizeIndex) => (
                          <span key={sizeId} className="mr-2">
                            {sizes[sizeId] || sizeId}
                            {sizeIndex <
                            order.deliveryDetails?.selectedSizes.length - 1
                              ? ", "
                              : ""}
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div>Method: {order.payment?.method || "N/A"}</div>
                    <div>Delivery Fee: {order.deliveryFee || "0"} ₼</div>
                    <div className="font-medium font-gilroy">
                      Total: {order.payment?.amount || "0.00"} ₼
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      order.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "delivered"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.status !== "confirmed" &&
                    order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowCancelModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => handleDeliverOrder(order.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {t("deliver")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-neutral-900/40 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div
            ref={modalRef}
            className="relative p-5 border w-96 shadow-lg rounded-md bg-white"
          >
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Cancel Order
              </h3>
              <div className="mt-2 px-7 py-3">
                <CustomDropdown
                  options={cancelReasons}
                  value={cancelReason}
                  onChange={setCancelReason}
                  placeholder="Select a reason"
                />

                {cancelReason === "Custom reason" && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason..."
                    className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    rows="3"
                  />
                )}

                <div className="flex w-full justify-center space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedOrder(null);
                      setCancelReason("");
                      setCustomReason("");
                    }}
                    className="px-4 py-2 w-1/2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={
                      !cancelReason ||
                      (cancelReason === "Custom reason" && !customReason)
                    }
                    className="px-4 py-2 w-1/2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
