import React, { useState } from "react";
import Container from "../Container";
import { PiHeartLight } from "react-icons/pi";
import { PiUserLight } from "react-icons/pi";
import { PiBasketLight } from "react-icons/pi";
import { TfiSearch } from "react-icons/tfi";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/router";
import { VscMenu } from "react-icons/vsc";
import SearchModal from "../SearchModal";
import { CiMenuBurger } from "react-icons/ci";
import { IoMenuOutline } from "react-icons/io5";
import LanguageSwitcher from "../LanguageSwitcher";
import MobileMenu from "./MobileMenu"; // You'll need to create this component

function Header() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white">
      <Container>
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center pt-4 h-[100px]">
          <div className="flex items-center gap-7 font-gilroy">
            <div
              onClick={toggleSearch}
              className="flex items-center gap-2 cursor-pointer hover:text-neutral-600 transition-colors"
              aria-label="Search"
            >
              <TfiSearch className="text-lg" />
              <p className="text-lg">Search</p>
            </div>
            <LanguageSwitcher />
          </div>
          <div
            onClick={() => router.push({ pathname: "/" })}
            className="cursor-pointer"
            aria-label="Home"
          >
            <Image
              src={"/images/logo/lacheen-logo.png"}
              width={300}
              height={200}
              alt="logo lacheen"
              className="w-[270px] object-cover"
              quality={100}
              priority
            />
          </div>
          <div className="flex items-center gap-4 text-neutral-900 font-gilroy">
            <p
              onClick={() => router.push({ pathname: "/contact" })}
              className="text-lg cursor-pointer hover:text-neutral-600 transition-colors"
              aria-label="Contact us"
            >
              Contact us
            </p>
            <div
              className="cursor-pointer hover:text-neutral-600 transition-colors"
              onClick={() => router.push({ pathname: "/wishlist" })}
              aria-label="Wishlist"
            >
              <PiHeartLight className="text-2xl" />
            </div>
            <div
              className="cursor-pointer hover:text-neutral-600 transition-colors"
              onClick={() => router.push({ pathname: "/login" })}
              aria-label="Account"
            >
              <PiUserLight className="text-2xl" />
            </div>
            <div
              className="cursor-pointer hover:text-neutral-600 transition-colors"
              onClick={() => router.push({ pathname: "/basket" })}
              aria-label="Basket"
            >
              <PiBasketLight className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center py-4 h-[80px] ">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMobileMenu}
              className="text-neutral-900 focus:outline-none relative w-6 h-6"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {/* Animated hamburger icon */}
              <span
                className={`absolute block w-6 h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "rotate-45 top-1/2"
                    : "top-1 -translate-y-1/2"
                }`}
              ></span>
              <span
                className={`absolute block w-6 h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
                style={{ top: "50%" }}
              ></span>
              <span
                className={`absolute block w-6 h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "-rotate-45 top-1/2"
                    : "bottom-1 translate-y-1/2"
                }`}
              ></span>
            </button>
            <div
              onClick={() => router.push({ pathname: "/" })}
              className="cursor-pointer"
              aria-label="Home"
            >
              <Image
                src={"/images/logo/lacheen-logo.png"}
                width={180}
                height={120}
                alt="logo lacheen"
                className="w-[90px] object-cover ml-2"
                quality={100}
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-neutral-900">
            <button
              onClick={toggleSearch}
              className="focus:outline-none"
              aria-label="Search"
            >
              <CiSearch className="text-base" />
            </button>
            <button
              onClick={() => router.push({ pathname: "/wishlist" })}
              className="focus:outline-none"
              aria-label="Wishlist"
            >
              <PiHeartLight className="text-base" />
            </button>
            <button
              onClick={() => router.push({ pathname: "/login" })}
              className="focus:outline-none"
              aria-label="Account"
            >
              <PiUserLight className="text-base" />
            </button>
            <button
              onClick={() => router.push({ pathname: "/basket" })}
              className="focus:outline-none"
              aria-label="Basket"
            >
              <PiBasketLight className="text-base" />
            </button>
          </div>
        </div>
      </Container>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </div>
  );
}

export default Header;
