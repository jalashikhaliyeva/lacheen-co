import React, { useState, useEffect, useRef } from "react";
import Container from "../Container";
import { RiMenuUnfoldLine, RiMenuUnfold2Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBox,
  FiList,
  FiShoppingCart,
  FiGrid,
} from "react-icons/fi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { PiUsersThree } from "react-icons/pi";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/firebase/backendConfig";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { fetchSizes } from "@/firebase/services/sizeService";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";

function AdminHeader({ toggleSidebar, sidebarOpen }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sizes, setSizes] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const sizesData = await fetchSizes();
        const sizesMap = sizesData.reduce((acc, size) => {
          acc[size.id] = size.value;
          return acc;
        }, {});
        setSizes(sizesMap);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const ordersRef = ref(db, "all-orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const pendingOrdersList = Object.entries(ordersData)
          .filter(([_, order]) => order.status === "pending")
          .map(([id, data]) => ({
            id,
            ...data,
            items: data.items?.map((item) => ({
              ...item,
              orderId: id,
            })),
          }));
        setPendingOrders(pendingOrdersList);
      } else {
        setPendingOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOrderClick = (orderId, itemId) => {
    localStorage.setItem("selectedOrderId", orderId);
    localStorage.setItem("selectedItemId", itemId);
    router.push("/admin/orders");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome size={20} />,
      route: "/admin",
    },
    {
      id: "products",
      label: "Products",
      icon: <FiBox size={20} />,
      route: "/admin/products",
    },
    {
      id: "categories",
      label: "Categories",
      icon: <FiList size={20} />,
      route: "/admin/categories",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <FiShoppingCart size={20} />,
      route: "/admin/orders",
    },
    {
      id: "client",
      label: "Users",
      icon: <PiUsersThree size={20} />,
      route: "/admin/client",
    },
    {
      id: "sizes",
      label: "Sizes",
      icon: <FiGrid size={20} />,
      route: "/admin/sizes",
    },
    {
      id: "colors",
      label: "Colors",
      icon: <HiOutlineColorSwatch size={20} />,
      route: "/admin/colors",
    },
  ];

  const handleMobileMenuClick = (route) => {
    setIsMobileMenuOpen(false);
    router.push(route);
  };

  return (
    <>
      <div
        className={`fixed  text-neutral-800 top-0 z-50 shadow-xs border-b border-gray-200 bg-white transition-all duration-300 ${
          sidebarOpen ? "left-[280px]" : "left-0"
        }`}
        style={{
          width: sidebarOpen ? "calc(100% - 280px)" : "100%",
        }}
      >
        <Container>
          <header className="flex justify-between py-4">
            {/* Toggle Icon - Only show on desktop */}
            <div className="hidden md:block relative z-50">
              <button
                onClick={() => toggleSidebar()}
                className="p-2 hover:bg-teal-50 rounded-md transition-colors duration-200"
              >
                {sidebarOpen ? (
                  <RiMenuUnfold2Line className="text-2xl text-gray-600" />
                ) : (
                  <RiMenuUnfoldLine className="text-2xl text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <FiMenu
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-2xl cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                ref={dropdownRef}
              >
                <div className="relative border border-neutral-300 rounded-md p-1.5 cursor-pointer hover:bg-neutral-50">
                  <IoNotificationsOutline className="text-2xl bell-swing" />
                  {pendingOrders.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-400 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {pendingOrders.length}
                    </span>
                  )}
                </div>

                {/* Dropdown for pending orders */}
                <div
                  className={`
                  absolute right-0 top-full w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50
                  transition-all duration-300 ease-in-out
                  ${
                    isDropdownOpen
                      ? "opacity-100 translate-y-0 visible mt-2"
                      : "opacity-0 -translate-y-4 invisible mt-0"
                  }
                `}
                >
                  <div className="p-3 border-b border-neutral-200">
                    <h3 className="font-semibold text-gray-900">
                      Pending Orders
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {pendingOrders.map((order) =>
                      order.items?.map((item) => (
                        <div
                          key={`${order.id}-${item.id}`}
                          className="p-3 border-b border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors duration-200"
                          onClick={() => handleOrderClick(order.id, item.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Item #{item.id}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(
                                  new Date(order.createdAt),
                                  "MMM dd, yyyy HH:mm"
                                )}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {t("customer")} :{" "}
                                {order.userInfo?.name || "Customer"}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.price} ₼
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">
                              {item.name} • Sizes:{" "}
                              {order.deliveryDetails?.selectedSizes?.map(
                                (sizeId, index) => (
                                  <span key={sizeId}>
                                    {sizes[sizeId] || sizeId}
                                    {index <
                                    order.deliveryDetails.selectedSizes.length -
                                      1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )}{" "}
                              • Color: {item.color}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>
        </Container>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 md:hidden ${
          isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-full bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="w-[170px]">
            <Image
              width={200}
              height={300}
              alt="logo-lacheen.co"
              className="w-full"
              src={"/images/logo/lacheen-logo-png.png"}
            />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMobileMenuClick(item.route)}
              className="flex items-center space-x-3 py-3 px-4 cursor-pointer hover:bg-teal-50 rounded-md mb-2 transition-colors duration-200"
            >
              <span className="text-gray-600">{item.icon}</span>
              <span className="text-gray-900">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

export default AdminHeader;
