import React from "react";
import { useRouter } from "next/router";
import Container from "../Container";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/shared/context/CategoriesContext";
import {
  PiHeartLight,
  PiUserLight,
  PiBasketLight,
  PiCalendarLight,
  PiGiftLight,
} from "react-icons/pi";
import { PiPackage } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";

const MobileMenu = ({ isOpen, onClose, user, onLogout }) => {
  const router = useRouter();
  const { categories, loading, error } = useCategories();
  const { t, i18n } = useTranslation();
  const currentCategory = router.query.category || null;
  const currentLang = i18n.language;

  const isProductsPage = router.pathname === "/products";

  const staticMenuItems = [
    { id: "contact", label: t("nav.contact") || "Contact us", url: "/contact" },
    { id: "new", label: t("nav.new") || "New", is_active: true },
    {
      id: "special",
      label: t("nav.special_prices") || "Special prices",
      isHighlighted: true,
      is_active: true,
    },
    { id: "viewAll", label: t("nav.view_all") || "View all", is_active: true },
  ];

  const profileMenuItems = user
    ? [
        {
          id: "personal",
          label: t("personal_information") || "Personal Information",
          icon: <PiUserLight className="text-xl" />,
        },
        {
          id: "orders",
          label: t("orders") || "Orders",
          icon: <PiPackage className="text-xl" />,
        },
        {
          id: "basket",
          label: t("basket") || "Basket",
          icon: <PiBasketLight className="text-xl" />,
        },
        {
          id: "wishlist",
          label: t("wishlist_title") || "Wishlist",
          icon: <PiHeartLight className="text-xl" />,
        },
        {
          id: "address",
          label: t("address_details") || "Address Details",
          icon: <SlLocationPin className="text-xl" />,
        },
      ]
    : [];

  const categoryItems = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      id: category.slug?.[currentLang] || category.slug?.az || category.slug || category.id,
      label: category.name?.[currentLang] || category.name?.az || category.name,
      is_active: category.is_active,
    }));

  const menuItems = [...staticMenuItems, ...categoryItems];

  const getItemUrl = (item) => {
    if (item.id === "contact") {
      return "/contact";
    }
    if (item.id === "viewAll") {
      return "/products";
    }
    return `/products?category=${item.id}`;
  };

  const handleProfileItemClick = (itemId) => {
    if (itemId === "basket") {
      router.push("/basket");
    } else if (itemId === "wishlist") {
      router.push("/wishlist");
    } else {
      router.push(`/profile?tab=${itemId}`);
    }
    onClose();
  };

  const isActive = (itemId) => {
    if (!isProductsPage) {
      return false;
    }

    if (itemId === "viewAll" && !currentCategory) {
      return true;
    }
    return itemId === currentCategory;
  };

  const handleClick = (item) => {
    const url = getItemUrl(item);
    router.push(url);
    onClose();
  };

  return (
    <nav
      className={`fixed inset-0 text-neutral-800 bg-white z-[100] transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-y-auto w-full min-w-[280px]`}
      aria-label="Mobile navigation menu"
    >
      <Container>
        <div className="py-4 min-h-screen">
          <header className="flex flex-row gap-4">
            <div className="flex">
              <button
                onClick={onClose}
                className="absolute top-4 left-1 focus:outline-none relative w-6 h-6 z-10"
                aria-label="Close menu"
              >
                <span
                  className={`absolute block w-6 h-px bg-neutral-700 transition-all duration-300 ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                  style={{ top: "50%" }}
                ></span>
                <span
                  className={`absolute block w-6 h-px bg-neutral-700 transition-all duration-300 ${
                    isOpen ? "-rotate-45" : "rotate-0"
                  }`}
                  style={{ top: "50%" }}
                ></span>
              </button>
            </div>

            <div className="flex items-center pt-5.5 w-full">
              <Image
                src="/images/logo/lacheen-logo.png"
                width={300}
                height={200}
                alt="Lacheen logo"
                className="w-[130px] object-cover"
                quality={100}
                priority
              />
            </div>
          </header>

          <section className="mt-12 space-y-6 font-gilroy px-4">
            <ul className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item)}
                    className={`block text-lg uppercase py-2 hover:text-neutral-600 transition-colors w-full text-left ${
                      item.isHighlighted ? "text-rose-800" : ""
                    } ${
                      isActive(item.id) ? "text-neutral-900 font-medium" : ""
                    }`}
                  >
                    {item.id === "new" ? (
                      <span className="border-b-1 border-current pb-1">
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Profile Section */}
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-normal mb-3">{t("my_account") || "My Account"}</h3>
                <ul className="flex flex-col gap-3">
                  {profileMenuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleProfileItemClick(item.id)}
                        className="flex items-center gap-3 text-lg py-2 hover:text-neutral-600 transition-colors w-full text-left"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={onLogout}
                      className="w-full border border-neutral-200 text-neutral-700 py-2 transition-colors hover:bg-neutral-50 mt-4"
                    >
                      {t("logout") || "Logout"}
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <LanguageSwitcher mobile />
            </div>
          </section>
        </div>
      </Container>
    </nav>
  );
};

export default MobileMenu;