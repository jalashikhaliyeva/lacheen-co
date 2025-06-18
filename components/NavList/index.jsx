import React from "react";
import Link from "next/link";
import Container from "../Container";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/shared/context/CategoriesContext";
import { useRouter } from "next/router";

function NavList() {
  const { categories, loading, error } = useCategories();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const currentCategory = router.query.category || null;
  const currentLang = i18n.language;

  const isProductsPage = router.pathname === "/products";

  const staticMenuItems = [
    { id: "new", label: t("nav.new"), is_active: true },
    {
      id: "special",
      label: t("nav.special_prices"),
      isHighlighted: true,
      is_active: true,
    },
    { id: "viewAll", label: t("nav.view_all"), is_active: true },
  ];
  
  const menuItems = [
    ...staticMenuItems,
    ...categories
      .filter((category) => category.is_active)
      .map((category) => ({
        id: category.slug?.[currentLang] || category.slug?.az || category.slug || category.id,
        label: category.name?.[currentLang] || category.name?.az || category.name,
        is_active: category.is_active,
      })),
  ];

  const getItemUrl = (item) => {
    if (item.id === "viewAll") {
      return "/products";
    }
    return `/products?category=${item.id}`;
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

  return (
    <div className="hidden md:block bg-white relative z-50">
      <Container>
        <div className="flex overflow-hidden gap-7 justify-center items-center pb-4">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <Link href={getItemUrl(item)} passHref>
                <p
                  className={`font-gilroy font-normal text-xs text-neutral-800 md:text-base uppercase cursor-pointer transition-all duration-200 ${
                    item.isHighlighted ? "text-pink-800" : ""
                  } py-1 relative inline-block`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-neutral-400 transition-all duration-300 ${
                      isActive(item.id) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </p>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default NavList;