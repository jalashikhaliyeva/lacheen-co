import React from "react";
import { FiX } from "react-icons/fi";
import LanguageSwitcher from "../LanguageSwitcher";
import Container from "../Container";
import { VscClose } from "react-icons/vsc";

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-white z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <Container>
        <div className="py-4">
          <button
            onClick={onClose}
            className="absolute top-4 left-1 focus:outline-none relative w-6 h-6"
            aria-label="Close menu"
          >
            {/* Matching animated close icon */}
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

          <div className="mt-12 space-y-6">
            <a
              href="/contact"
              className="block text-xl py-2 hover:text-neutral-600 transition-colors"
              onClick={onClose}
            >
              Contact us
            </a>
            <div className="pt-4 border-t border-gray-200">
              <LanguageSwitcher mobile />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MobileMenu;
