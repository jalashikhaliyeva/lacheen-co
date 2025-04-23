// components/SearchModal.jsx
// This component renders a full-screen search modal with smooth animations using Framer Motion.

import { useEffect, useState } from "react"; // React hooks for lifecycle and state
import { createPortal } from "react-dom"; // For rendering outside the main DOM tree
import { useRouter } from "next/router"; // Next.js router for navigation
import Image from "next/image"; // Optimized image component
import { IoClose } from "react-icons/io5"; // Close icon
import { TfiSearch } from "react-icons/tfi"; // Search icon inside input
import { AnimatePresence, motion } from "framer-motion"; // Framer Motion components for animations
import TrendingNow from "../TrendingNow";
import TrendingInitSearch from "../TrendingInitSearch";

export default function SearchModal({ isOpen, onClose }) {
  // State to ensure code runs only on client (prevent SSR mismatch)
  const [mounted, setMounted] = useState(false);
  // Controlled input value for search query
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Run once on mount: flag that client is ready
  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear the input when 'X' button is clicked
  const handleClear = () => {
    setSearchQuery("");
  };

  // If not on client, don't render anything
  if (!mounted) return null;

  // Use createPortal to attach modal elements directly under document.body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: dark overlay with fade effect */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose} // Clicking backdrop closes modal
            initial={{ opacity: 0 }} // Starting state for animation
            animate={{ opacity: 0.8 }} // Animated to 50% opacity
            exit={{ opacity: 0 }} // Fade out on exit
            transition={{ duration: 0.6 }} // Duration of fade
          />

        
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center"
            initial={{ y: "-100%", opacity: 0 }} // Start above viewport, invisible
            animate={{ y: "0%", opacity: 1 }} // Slide into place and fade in
            exit={{ y: "-100%", opacity: 0 }} // Slide up and fade out on close
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
            onClick={onClose}
          >
            {/* Modal content box now full width */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-full  md:h-[700px] rounded-none shadow-lg overflow-hidden"
            >
              {/* Close button in top-right corner */}
              <button
                onClick={onClose}
                className="absolute top-4 cursor-pointer right-4 text-2xl z-10"
              >
                <IoClose />
              </button>

              {/* Logo section: clicking redirects home */}
              <div
                className="flex items-center justify-center h-[100px] cursor-pointer"
                onClick={() => router.push({ pathname: "/" })}
              >
                <Image
                  src="/images/logo/lacheen-logo.png"
                  width={300}
                  height={400}
                  alt="logo lacheen"
                  className="w-[200px] object-cover"
                  quality={100}
                />
              </div>

              {/* Main content: heading and input */}
              <div className="flex flex-col items-center h-full px-6">
                {/* Heading text */}
                <h2 className="text-2xl md:text-4xl font-gilroy my-8">
                  What are you looking for?
                </h2>
                {/* Search input container */}
                <div className="w-full relative max-w-4xl">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full font-gilroy border rounded-full border-black py-3 px-4 text-lg focus:outline-none transition"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {/* Clear (X) button appears when there's text */}
                  {searchQuery && (
                    <button
                      onClick={handleClear}
                      className="absolute right-6 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                  {/* Search icon inside input (non-interactive) */}
                  {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <TfiSearch className="text-xl text-gray-400" />
                  </div> */}
                </div>

                {/* Trending searches list */}
                <div className="flex flex-row gap-4 mt-4 font-gilroy text-sm">
                  <h2 className="uppercase">trending searches :</h2>
                  {["Sneakers", "Flats", "Sandals"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="lowercase cursor-pointer text-neutral-600 hover:text-neutral-800 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <TrendingInitSearch />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
