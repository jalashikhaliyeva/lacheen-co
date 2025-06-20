import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { BsChevronDown } from "react-icons/bs";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    router.locale?.toUpperCase() || "AZ"
  );
  const dropdownRef = useRef(null);

  const handleLanguageChange = (language) => {
    if (language.toUpperCase() === selectedLanguage) return;
    setSelectedLanguage(language.toUpperCase());
    i18n.changeLanguage(language.toLowerCase());
    localStorage.setItem("selectedLanguage", language.toUpperCase());
    setIsDropdownOpen(false);
    router.push(router.asPath, router.asPath, {
      locale: language.toLowerCase(),
    });
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "AZ";
    setSelectedLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage.toLowerCase());
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
      ref={dropdownRef}
    >
      <button
        id="dropdownLanguageButton"
        className="px-2 text-neutral-800 flex items-center justify-center gap-2 py-1 text-base font-gilroy focus:outline-none"
        type="button"
      >
        {selectedLanguage}
        <BsChevronDown
          className={`
            text-xs transform-gpu origin-center
            transition-all duration-500 ease-out
            ${isDropdownOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}
          `}
        />
      </button>

      <div
        className={`
          text-neutral-800
          absolute z-[999] w-28 mt-2 font-gilroy bg-white 
          md:border md:border-gray-300 md:rounded-sm md:shadow-lg md:p-2
          transition-all duration-300 ease-in-out
          ${isDropdownOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"}
          md:left-1/2 md:-translate-x-1/2
        `}
      >
        <ul className="py-1">
          {["AZ", "EN"].map((lang) => (
            <li
              key={lang}
              className={`
                px-4 py-2 cursor-pointer rounded
                hover:bg-gray-100 text-base transition-colors text-neutral-800
                ${selectedLanguage === lang
                  ? "text-gray-700 font-semibold"
                  : "text-gray-700"}
              `}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
