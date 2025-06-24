import React, { useEffect, useState, useRef } from "react";
import { useAuthClient } from "@/shared/context/AuthContext";
import {
  getUserOrders,
  updateOrderStatus,
} from "@/firebase/services/firebaseOrderService";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { BsChevronDown } from "react-icons/bs";

function OrdersUserSingle() {
  const { user } = useAuthClient();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filterRef = useRef(null);

  const filterOptions = [
    { value: "all", label: t("show_all") },
    { value: "pending", label: t("pending") },
    { value: "confirmed", label: t("confirmed") },
    { value: "cancelled", label: t("cancelled") },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.uid) {
        try {
          const userOrders = await getUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedOrder) return;

    setCancelling(true);
    try {
      await updateOrderStatus(selectedOrder.id, "cancelled");
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: "cancelled" }
            : order
        )
      );
      setCancelModalOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancelling(false);
      setSelectedOrder(null);
    }
  };

  const handleItemImageClick = (itemId) => {
    const itemUrl = `/products/${itemId}`;
    window.open(itemUrl, '_blank');
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "all") return true;
    return order.status === selectedFilter;
  });

  if (loading) {
    return <div className="text-center py-4">{t("loading")}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-4">{t("no_orders_found")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-gilroy text-neutral-800 font-normal">{t("my_orders")}</h2>
        <div
          className="relative"
          onMouseEnter={() => setIsFilterOpen(true)}
          onMouseLeave={() => setIsFilterOpen(false)}
          ref={filterRef}
        >
          <button
            className="px-2 flex items-center text-neutral-800 justify-center gap-2 py-1 text-base font-gilroy focus:outline-none"
            type="button"
          >
            {t("filter")}
            <BsChevronDown
              className={`
                text-xs transform-gpu origin-center
                transition-all duration-500 ease-out
                ${isFilterOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}
              `}
            />
          </button>

          <div
            className={`
              absolute z-[999] w-40 mt-2 font-gilroy bg-white  text-neutral-800
              border border-gray-300 rounded-sm shadow-lg p-2
              transition-all duration-300 ease-in-out
              ${isFilterOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-4 invisible"}
              right-0
            `}
          >
            <ul className="py-1 text-neutral-800">
              {filterOptions.map((option) => (
                <li
                  key={option.value}
                  className={`
                    px-4 py-2 cursor-pointer rounded
                    hover:bg-gray-100 text-base transition-colors text-neutral-800
                    ${selectedFilter === option.value
                      ? "text-gray-700 font-semibold"
                      : "text-gray-700"}
                  `}
                  onClick={() => {
                    setSelectedFilter(option.value);
                    setIsFilterOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {[...filteredOrders].reverse().map((order) => (
          <div key={order.id} className="border p-4 bg-white text-neutral-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-neutral-600">
                  {t("order_id")}: {order.id}
                </p>
                <p className="text-sm text-neutral-600">
                  {t("order_date")}: {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {order.status === "cancelled" && (
                  <button
                    onClick={() => handleCancelClick(order)}
                    className="px-3 py-1 text-sm  text-amber-900  transition-colors italic"
                  >
                    - {order.cancellationReason}
                  </button>
                )}
                <span
                  className={`px-3 py-1 text-sm ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t(order.status)}
                </span>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelClick(order)}
                    className="px-3 py-1 text-sm  text-neutral-900  transition-colors"
                  >
                    {t("cancel")}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("subtotal")}</span>
                <span>{order.subtotal} ₼</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t("delivery_fee")}</span>
                <span>{order.deliveryFee} ₼</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>{t("total")}</span>
                <span>{order.total} ₼</span>
              </div>
            </div>

            {order.items && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">{t("order_items")}</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleItemImageClick(item.id)}
                        title={t("click_to_view_product")}
                      />
                      <div>
                        <p className="font-normal">{item.name}</p>
                        <p className="font-normal">
                          {t("item_id")}:{" "}
                          <span className="font-medium">#{item.id}</span>
                        </p>
                        <p className="text-neutral-600">
                          {t("quantity")}: {item.quantity}
                          {item.size && ` • ${t("size")}: ${item.size}`}
                          {item.color && ` • ${t("color")}: ${item.color}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white -lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("confirm_cancellation")}
              </h2>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={cancelling}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{t("cancel_order_confirmation")}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border border-gray-300 -md text-gray-700 hover:bg-gray-50"
                disabled={cancelling}
              >
                {t("no")}
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-neutral-900 text-white -md hover:bg-neutral-800 flex items-center justify-center min-w-24"
                disabled={cancelling}
              >
                {cancelling ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  t("yes_cancel")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersUserSingle;