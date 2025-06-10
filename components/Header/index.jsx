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

function Header() {
  const { user, loading } = useAuthClient();
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
              className="flex items-center gap-2 cursor-pointer hover:text-neutral-600 transition-colors"
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
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                console.log('Menu clicked, current state:', isMobileMenuOpen);
                setIsMobileMenuOpen(prev => !prev);
              }}
              className="text-neutral-900 focus:outline-none relative w-10 h-10 z-50 flex items-center justify-center"
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
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer ml-2 focus:outline-none"
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
            </button>
          </div>

          <div className="flex items-center gap-1 text-neutral-900">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="focus:outline-none w-10 h-10 flex items-center justify-center"
              aria-label={t("nav.search")}
              type="button"
            >
              <CiSearch className="text-xl" />
            </button>
            <button
              onClick={() => router.push("/wishlist")}
              className="focus:outline-none w-10 h-10 flex items-center justify-center"
              aria-label="Wishlist"
              type="button"
            >
              <PiHeartLight className="text-xl" />
            </button>
            <button
              onClick={() => router.push(accountPath)}
              className="focus:outline-none w-10 h-10 flex items-center justify-center"
              aria-label={user ? "Profile" : "Login"}
              type="button"
            >
              <PiUserLight className="text-xl" />
            </button>
            <button
              onClick={() => router.push("/basket")}
              className="focus:outline-none w-10 h-10 flex items-center justify-center"
              aria-label="Basket"
              type="button"
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
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

export default Header;