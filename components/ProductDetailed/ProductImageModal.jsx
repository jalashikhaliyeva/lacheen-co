import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CgClose } from "react-icons/cg";
const DRAG_THRESHOLD = 50;
const variants = {
  enter: (direction) => ({
    y: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    y: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};
export default function ProductImageModal({
  images = [],
  initialIndex = 0,
  isOpen = false,
  onClose = () => {},
}) {
  // [page, direction]
  const [[page, direction], setPage] = useState([initialIndex, 0]);
  const modalRef = useRef(null);

  // Sync with initialIndex
  useEffect(() => {
    setPage([initialIndex, 0]);
  }, [initialIndex]);

  // Keyboard nav & Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight" && page < images.length - 1)
        setPage([page + 1, 1]);
      if (e.key === "ArrowLeft" && page > 0) setPage([page - 1, -1]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, page, images.length, onClose]);

  const prev = () => {
    if (page > 0) setPage([page - 1, -1]);
  };
  const next = () => {
    if (page < images.length - 1) setPage([page + 1, 1]);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full h-screen  bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-full cursor-pointer "
        >
          <CgClose className="text-4xl" />
        </button>

        {/* Thumbnails */}
        <div className="flex flex-col gap-2 p-4 overflow-y-auto">
          {images.map((src, idx) => (
            <motion.button
              key={idx}
              onClick={() => setPage([idx, idx > page ? 1 : -1])}
              className={`flex-shrink-0  border-2 ${
                idx === page
                  ? "border-neutral-300 shadow-md"
                  : "border-transparent hover:border-neutral-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover"
              />
            </motion.button>
          ))}
        </div>

        {/* Main Slide */}
        <div className="relative flex-1 flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-grab"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              whileTap={{ cursor: "grabbing" }}
              onDragEnd={(e, info) => {
                if (info.offset.y > DRAG_THRESHOLD) prev();
                else if (info.offset.y < -DRAG_THRESHOLD) next();
              }}
            >
              <Image
                src={images[page]}
                alt={`Slide ${page + 1}`}
                width={900}
                height={900}
                className="object-contain max-h-full pointer-events-none"
                priority
                quality={100}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
