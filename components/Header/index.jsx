import React, { useState } from "react";
import Container from "../Container";
import { PiHeartLight } from "react-icons/pi";
import { PiUserLight } from "react-icons/pi";
import { PiBasketLight } from "react-icons/pi";
import { TfiSearch } from "react-icons/tfi";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/router";
import SearchModal from "../SearchModal";
import LanguageSwitcher from "../LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useTranslation } from "react-i18next";
import { useAuthClient } from "@/shared/context/AuthContext";

function Header({ modalNewProducts, categories }) {

  const { user, loading, logout } = useAuthClient();
  const { t } = useTranslation();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="bg-white">
        <Container>
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-lg text-neutral-500">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  const accountPath = user ? "/profile" : "/login";

  return (
    <div className="bg-white">
      <Container>
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center  py-4">
          <div className="flex items-center gap-7 font-gilroy">
            <div
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-2 cursor-pointer text-neutral-800 hover:text-neutral-600 transition-colors"
              aria-label={t("nav.search")}
            >
              <TfiSearch className="text-lg" />
              <p className="text-lg">{t("nav.search")}</p>
            </div>
            <LanguageSwitcher />
          </div>

          <div
            onClick={() => router.push("/")}
            className="cursor-pointer"
            aria-label="Home"
          >
            <Image
              src="/images/logo/lacheen-logo.png"
              width={300}
              height={200}
              alt="Lacheen logo"
              className="w-[270px] object-cover"
              quality={100}
              priority
            />
          </div>

          <div className="flex items-center gap-4 text-neutral-900 font-gilroy">
            <p
              onClick={() => router.push("/contact")}
              className="text-lg cursor-pointer hover:text-neutral-600 transition-colors"
              aria-label="Contact us"
            >
              {t("nav.contact")}
            </p>
            <div
              onClick={() => router.push("/wishlist")}
              className="cursor-pointer hover:text-neutral-600 transition-colors"
              aria-label="Wishlist"
            >
              <PiHeartLight className="text-2xl" />
            </div>
            <div
              onClick={() => router.push(accountPath)}
              className="cursor-pointer hover:text-neutral-600 transition-colors"
              aria-label={user ? "Profile" : "Login"}
            >
              <PiUserLight className="text-2xl" />
            </div>
            <div
              onClick={() => router.push("/basket")}
              className="cursor-pointer hover:text-neutral-600 transition-colors"
              aria-label="Basket"
            >
              <PiBasketLight className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center py-4 h-[80px] w-full">
          <div className="flex items-center gap-1 min-w-[120px]">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="text-neutral-900 focus:outline-none relative w-8 h-8 z-10 touch-manipulation flex items-center justify-center p-1"
                aria-label={isMobileMenuOpen ? t("menu.close") : t("menu.open")}
                type="button"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute block w-6 h-px bg-current transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "rotate-45 top-1/2 -translate-y-1/2"
                        : "top-1"
                    }`}
                  />
                  <span
                    className={`absolute block w-6 h-px bg-current transition-opacity duration-300 top-1/2 -translate-y-1/2 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute block w-6 h-px bg-current transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "-rotate-45 top-1/2 -translate-y-1/2"
                        : "bottom-1"
                    }`}
                  />
                </div>
              </button>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push("/");
              }}
              className="cursor-pointer ml-2"
              aria-label="Home"
            >
              <Image
                src="/images/logo/lacheen-logo.png"
                width={180}
                height={120}
                alt="Lacheen logo"
                className="w-[130px] object-cover"
                quality={100}
                priority
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-neutral-900">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSearchOpen(true);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="focus:outline-none touch-manipulation w-8 h-8 flex items-center justify-center"
              aria-label={t("nav.search")}
            >
              <CiSearch className="text-xl" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/wishlist");
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="focus:outline-none touch-manipulation w-8 h-8 flex items-center justify-center"
              aria-label="Wishlist"
            >
              <PiHeartLight className="text-xl" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(accountPath);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="focus:outline-none touch-manipulation w-8 h-8 flex items-center justify-center"
              aria-label={user ? "Profile" : "Login"}
            >
              <PiUserLight className="text-xl" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/basket");
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="focus:outline-none touch-manipulation w-8 h-8 flex items-center justify-center"
              aria-label="Basket"
            >
              <PiBasketLight className="text-xl" />
            </button>
          </div>
        </div>
      </Container>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        newProducts={modalNewProducts}
        categories={categories}
      />
      <MobileMenu
        onLogout={logout}
        user={user}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

export default Header;
