import React from "react";

export default function DeleteModal({ onClose, onConfirm, isDeleting }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 font-gilroy bg-black/40 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg max-w-[380px] w-full"
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-4">Are you sure you want to delete this product?</p>
        <div className="flex w-full space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 w-1/2 cursor-pointer bg-gray-200 rounded hover:bg-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 w-1/2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-500 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
