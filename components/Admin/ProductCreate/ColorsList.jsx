// src/components/ColorsList.js
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import {
  fetchColors,
  createColor,
  updateColor,
  deleteColor,
  toggleColorActiveStatus,
} from "@/firebase/services/colorService";
import Modal from "./ColorModal";
import ColorPicker from "./ColorPicker";

function ColorsList() {
  const [colors, setColors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Fetch colors from Firebase
  useEffect(() => {
    const loadColors = async () => {
      try {
        const colorsData = await fetchColors();
        setColors(colorsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadColors();
  }, []);

  const handleAddColor = async () => {
    if (newColorName.trim() === "") {
      setError("Color name cannot be empty");
      return;
    }

    if (!newColorCode) {
      setError("Please select a color");
      return;
    }

    setProcessing(true);
    try {
      const createdColor = await createColor({
        name: newColorName,
        code: newColorCode,
        is_active: true,
      });
      setColors([...colors, createdColor]);
      setNewColorName("");
      setNewColorCode("#000000");
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (color) => {
    setCurrentColor(color);
    setNewColorName(color.name);
    setNewColorCode(color.code);
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleUpdateColor = async () => {
    if (newColorName.trim() === "" || !currentColor) {
      setError("Color name cannot be empty");
      return;
    }

    if (!newColorCode) {
      setError("Please select a color");
      return;
    }

    setProcessing(true);
    try {
      await updateColor(currentColor.id, {
        name: newColorName,
        code: newColorCode,
      });
      setColors(
        colors.map((color) =>
          color.id === currentColor.id
            ? { ...color, name: newColorName, code: newColorCode }
            : color
        )
      );
      setIsEditModalOpen(false);
      setCurrentColor(null);
      setNewColorName("");
      setNewColorCode("#000000");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (color) => {
    setCurrentColor(color);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentColor) return;

    setProcessing(true);
    try {
      await deleteColor(currentColor.id);
      setColors(colors.filter((color) => color.id !== currentColor.id));
      setIsDeleteModalOpen(false);
      setCurrentColor(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setProcessing(true);
    try {
      await toggleColorActiveStatus(id, !currentStatus);
      setColors(
        colors.map((color) =>
          color.id === id ? { ...color, is_active: !currentStatus } : color
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
    <div className="p-5 font-sans mt-6  text-neutral-800">
      <div className="mt-5 flex justify-between items-center">
        <h1 className="text-2xl font-medium mb-4">Colors Management</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setError(null);
          }}
          className="px-4 py-2 flex items-center gap-2 cursor-pointer bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <FaPlus />
          Add Color
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white mt-4 flex flex-col justify-between rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
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
              {colors.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No colors found. Add your first color to get started.
                  </td>
                </tr>
              ) : (
                colors.map((color) => (
                  <tr key={color.id} className="hover:bg-gray-50">
                    <td className="px-6 text-left py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {color.name}
                      </div>
                    </td>
                    <td className="px-6 text-left py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                          style={{ backgroundColor: color.code }}
                        />
                        <span className="text-sm text-gray-600">
                          {color.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 text-center py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleToggleActive(color.id, color.is_active)
                        }
                        className={`relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          color.is_active ? "bg-teal-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            color.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        {color.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 text-right py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(color)}
                          className="text-white bg-teal-600 cursor-pointer rounded-md p-2"
                          title="Edit"
                          disabled={processing}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(color)}
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

      {/* Add Color Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Color"
      >
        <div className="mt-4">
          <label
            htmlFor="colorName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Color Name
          </label>
          <input
            id="colorName"
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder="e.g. Red, Blue, Green"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            autoFocus
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Code
          </label>
          <ColorPicker color={newColorCode} onChange={setNewColorCode} />
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
            onClick={handleAddColor}
            className="px-4 py-2 border cursor-pointer border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            disabled={processing}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              "Add Color"
            )}
          </button>
        </div>
      </Modal>

      {/* Edit Color Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Color"
      >
        <div className="mt-4">
          <label
            htmlFor="editColorName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Color Name
          </label>
          <input
            id="editColorName"
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            autoFocus
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Code
          </label>
          <ColorPicker color={newColorCode} onChange={setNewColorCode} />
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
            onClick={handleUpdateColor}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            disabled={processing}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Color"
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
            Are you sure you want to delete the color "{currentColor?.name}"?
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

export default ColorsList;
