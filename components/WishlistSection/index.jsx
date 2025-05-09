// import React from "react";

// function WishlistSection() {
//   return (
//     <div className="flex flex-col gap-4 justify-center py-[100px] items-center">
//       <h1 className="font-gilroy text-3xl font-normal">
//         Your wishlist is empty
//       </h1>

//       <p className="font-gilroy text-md">
//         Save products and looks to your wishlist and share them.
//       </p>
//       <p className="font-gilroy text-md">Need inspiration?</p>

//       <button
//         className="py-2 px-4 mt-7 border cursor-pointer font-gilroy border-neutral-900 bg-neutral-900 text-white
//             relative overflow-hidden
//             hover:text-neutral-800 hover:bg-transparent
//             transition-all duration-300
//             hover:border-neutral-900
//             before:content-[''] before:absolute before:top-0 before:left-0
//             before:w-full before:h-full before:bg-neutral-900
//             before:-z-10 before:transition-all before:duration-300
//             hover:before:w-0"
//       >
//         Discover more
//       </button>
//     </div>
//   );
// }

// export default WishlistSection;

import React, { useState, useEffect, useRef } from "react";
import { PiShareFatLight } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaLink } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import ProductList from "../ProductsList";
import ProductsListHeader from "../ProductsList/ProductsListHeader";

function WishlistSection() {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [layout, setLayout] = useState("grid2");
  const shareRef = useRef(null);

  const toggleShare = () => {
    setIsShareOpen(!isShareOpen);
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
      <div className="flex flex-col gap-4 justify-center pt-[40px] items-center relative">
        <h1 className="font-gilroy text-3xl font-normal">
          Create your own{" "}
          <span className="italic lowercase text-rose-800">Wishlist</span>
        </h1>

        <p className="font-gilroy text-md">
          Save products and looks to your wishlist and share them.
        </p>
        <p className="font-gilroy text-md">Need inspiration?</p>

        <div className="relative" ref={shareRef}>
          <button
            onClick={toggleShare}
            className="py-2 px-4 mt-7 flex items-center justify-center gap-1 border cursor-pointer font-gilroy border-neutral-900 text-neutral-800 
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
            Share
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
                <button className="transition-colors">
                  <FaWhatsapp size={20} />
                </button>
                <button className="transition-colors">
                  <FaInstagram size={20} />
                </button>
                <button className="transition-colors">
                  <GoLink size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <>
        <ProductList layout={layout} />
      </>
    </>
  );
}

export default WishlistSection;
