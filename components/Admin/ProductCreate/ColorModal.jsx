// src/components/Modal.js
import React from "react";
import { IoMdClose } from "react-icons/io";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={handleModalContentClick} // Add this line
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;