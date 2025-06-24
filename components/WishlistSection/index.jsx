import React, { useState, useEffect, useRef } from "react";
import { PiShareFatLight } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaLink } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { useTranslation } from "react-i18next";
import CustomToast from "../CustomToast/CustomToast";

function WishlistSection({ wishlistItems }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const shareRef = useRef(null);
  const { t } = useTranslation();

  const toggleShare = () => {
    setIsShareOpen(!isShareOpen);
  };

  const closeToast = () => setShowToast(false);

  const shareToWhatsApp = () => {
    const text = `Check out my wishlist on Lacheen! ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing via URL
    // We'll copy the link to clipboard instead
    navigator.clipboard.writeText(window.location.href);
    setToastMessage(t("wishlist.link_copied"));
    setShowToast(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage(t("wishlist.link_copied"));
    setShowToast(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };

    if (isShareOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareOpen]);

  const shareVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <CustomToast
        show={showToast}
        onClose={closeToast}
        message={toastMessage}
      />
      <div className="flex flex-col gap-4 justify-center pt-[40px] items-center relative">
        <h1 className="font-gilroy text-3xl font-normal text-neutral-800">
          {t("create_your_own_wishlist")}{" "}
          <span className="italic lowercase text-rose-800">
            {t("wishlist-title")}
          </span>
        </h1>

        <div className="relative" ref={shareRef}>
          <button
            onClick={toggleShare}
            className="py-2 px-4 mt-2 flex items-center justify-center gap-1 border cursor-pointer font-gilroy border-neutral-900 text-neutral-800 
                    relative overflow-hidden 
                    hover:text-white 
                    transition-all duration-300
                    hover:border-neutral-900
                    before:content-[''] before:absolute before:top-0 before:left-0 
                    before:w-0 before:h-full before:bg-neutral-900 
                    before:-z-10 before:transition-all before:duration-300
                    hover:before:w-full"
          >
            <PiShareFatLight />
            {t("share_it_with_your_friends")}
          </button>

          <AnimatePresence>
            {isShareOpen && (
              <motion.div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border shadow-2xl p-3 flex gap-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={shareVariants}
              >
                <button
                  onClick={shareToWhatsApp}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  <FaWhatsapp size={20} />
                </button>
                <button
                  onClick={shareToInstagram}
                  className="text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <FaInstagram size={20} />
                </button>
                <button
                  onClick={copyLink}
                  className="text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  <GoLink size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default WishlistSection;
