import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import {
  fetchSizes,
  createSize,
  updateSize,
  deleteSize,
  toggleSizeActiveStatus,
} from "@/firebase/services/sizeService";
import Modal from "./Modal";

function SizesList() {
  const [sizes, setSizes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);
  const [newSize, setNewSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Fetch sizes from Firebase
  useEffect(() => {
    const loadSizes = async () => {
      try {
        const sizesData = await fetchSizes();
        setSizes(sizesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadSizes();
  }, []);

  const handleAddSize = async () => {
    if (newSize.trim() === "") {
      setError("Size value cannot be empty");
      return;
    }

    setProcessing(true);
    try {
      const createdSize = await createSize({
        value: newSize,
        is_active: true,
      });
      setSizes([...sizes, createdSize]);
      setNewSize("");
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (size) => {
    setCurrentSize(size);
    setNewSize(size.value);
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleUpdateSize = async () => {
    if (newSize.trim() === "" || !currentSize) {
      setError("Size value cannot be empty");
      return;
    }

    setProcessing(true);
    try {
      await updateSize(currentSize.id, { value: newSize });
      setSizes(
        sizes.map((size) =>
          size.id === currentSize.id ? { ...size, value: newSize } : size
        )
      );
      setIsEditModalOpen(false);
      setCurrentSize(null);
      setNewSize("");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (size) => {
    setCurrentSize(size);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentSize) return;

    setProcessing(true);
    try {
      await deleteSize(currentSize.id);
      setSizes(sizes.filter((size) => size.id !== currentSize.id));
      setIsDeleteModalOpen(false);
      setCurrentSize(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setProcessing(true);
    try {
      await toggleSizeActiveStatus(id, !currentStatus);
      setSizes(
        sizes.map((size) =>
          size.id === id ? { ...size, is_active: !currentStatus } : size
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-teal-600" />
      </div>
    );
  }

  return (
    <div className="p-5 font-sans  text-neutral-800">
      <div className="mt-5 flex justify-between items-center">
        <h1 className="text-2xl font-medium mb-4">Sizes Management</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setError(null);
          }}
          className="px-4 py-2 flex items-center gap-2 cursor-pointer bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <FaPlus />
          Add Size
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white  text-neutral-800 mt-4 flex flex-col justify-between rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sizes.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No sizes found. Add your first size to get started.
                  </td>
                </tr>
              ) : (
                sizes.map((size) => (
                  <tr key={size.id} className="hover:bg-gray-50">
                    <td className="px-6 text-left py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {size.value}
                      </div>
                    </td>
                    <td className="px-6 text-center py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleToggleActive(size.id, size.is_active)
                        }
                        className={`relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          size.is_active ? "bg-teal-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            size.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        {size.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 text-right py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(size)}
                          className="text-white bg-teal-600 cursor-pointer rounded-md p-2"
                          title="Edit"
                          disabled={processing}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(size)}
                          className="text-neutral-700 bg-neutral-300 cursor-pointer rounded-md p-2"
                          title="Delete"
                          disabled={processing}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Size Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Size"
      >
        <div className="mt-4">
          <label
            htmlFor="sizeValue"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Size Value
          </label>
          <input
            id="sizeValue"
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !processing) {
                handleAddSize();
              }
            }}
            placeholder="e.g. 36, 37, M, L"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSize}
            className="px-4 py-2 border cursor-pointer border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            disabled={processing}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              "Add Size"
            )}
          </button>
        </div>
      </Modal>

      {/* Edit Size Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Size"
      >
        <div className="mt-4">
          <label
            htmlFor="editSizeValue"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Size Value
          </label>
          <input
            id="editSizeValue"
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateSize}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            disabled={processing}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Size"
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="mt-4">
          <p className="text-gray-700">
            Are you sure you want to delete the size "{currentSize?.value}"?
            This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
            disabled={processing}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SizesList;
