import React from "react";
import { useRouter } from "next/router";
import Container from "../Container";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/shared/context/CategoriesContext";

const MobileMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { categories, loading, error } = useCategories();
  const { t } = useTranslation();
  const currentCategory = router.query.category || null;

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

  const categoryItems = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      id: category.slug || category.id,
      label: category.name,
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

  const isActive = (itemId) => {
    // Only apply active state logic if we are on the /products page
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
      className={`fixed inset-0 bg-white z-[100] transform ${
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

            <div className="flex items-center justify-center pt-5 w-full">
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
