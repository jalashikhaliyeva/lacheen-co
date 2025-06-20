import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

function CustomToast({ show, onClose, product, message, linkText, linkHref }) {
  useEffect(() => {
    let timeoutId;
    if (show) {
      timeoutId = setTimeout(onClose, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [show, onClose]);

  return (
    <div
      className={[
        "fixed top-4 left-1/2 -translate-x-1/2 z-[150] max-w-sm w-full text-neutral-800",
        "transform transition-all duration-500 ease-in-out",
        show
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 -translate-y-full scale-95 pointer-events-none",
      ].join(" ")}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 font-gilroy">
        <div className="flex items-start gap-4">
          {product && (
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0].url || product.images[0]
                    : product.image || "/fallback.jpg"
                }
                alt={product.name}
                fill
                className="object-cover rounded"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                {product && (
                  <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                )}
                <p className="text-sm text-gray-600">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            {linkText && linkHref && (
              <Link
                href={linkHref}
                className="inline-block mt-2 text-sm text-neutral-900 hover:text-neutral-800 transition-colors"
              >
                {linkText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomToast;
