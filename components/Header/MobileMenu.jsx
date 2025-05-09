import React from "react";
import { useRouter } from "next/router";
import Container from "../Container";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";

const MobileMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
  const handleClick = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <nav
      className={`fixed inset-0 bg-white z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
      aria-label="Mobile navigation menu"
    >
      <Container>
        <div className="py-4">
          <header className="flex flex-row">
            <div className="flex">
              <button
                onClick={onClose}
                className="absolute top-4 left-1 focus:outline-none relative w-6 h-6"
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

            <div className="flex items-center justify-center pt-3 mx-auto">
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

            <div className="flex flex-end">
              {/* This invisible button seems unnecessary and can be removed */}
              <button
                onClick={onClose}
                className="invisible top-4 left-1 focus:outline-none relative w-6 h-6"
                aria-hidden="true"
                tabIndex="-1"
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
          </header>

          <section className="mt-12 space-y-6 font-gilroy">
            <ul className="flex flex-col gap-3">
              <li>
                <button
                  onClick={() => handleClick("/contact")}
                  className="block text-lg uppercase py-2 hover:text-neutral-600 transition-colors w-full text-left"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("/products")}
                  className="block text-lg uppercase py-2 pb-1 hover:text-neutral-600 transition-colors w-full text-left"
                >
                  <span className="border-b-1 border-current pb-1">new</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("/products")}
                  className="block text-lg uppercase py-2 hover:text-neutral-600 text-rose-800 transition-colors w-full text-left"
                >
                  special prices
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("/products")}
                  className="block text-lg uppercase py-2 hover:text-neutral-600 transition-colors w-full text-left"
                >
                  view all
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("/products")}
                  className="block text-lg uppercase py-2 hover:text-neutral-600 transition-colors w-full text-left"
                >
                  sandals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("/products")}
                  className="block text-lg uppercase py-2 hover:text-neutral-600 transition-colors w-full text-left"
                >
                  sneakers
                </button>
              </li>
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
