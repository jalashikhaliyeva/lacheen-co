import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="bg-white font-gilroy rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name?.[currentLang] || category.name?.az || category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.slug?.[currentLang] || category.slug?.az || category.slug}
                    </div>
                  </td>
             
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {category.productCount || 0} products
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={category.is_active ?? true}
                      onChange={(isActive) => onToggleActive(category.id, isActive)}
                      disabled={isLoading}
                      className={`${category.is_active ?? true ? 'bg-teal-600' : 'bg-gray-200'}
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                    >
                      <span className="sr-only">Toggle active status</span>
                      <span
                        className={`${category.is_active ?? true ? 'translate-x-6' : 'translate-x-1'}
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                    <span className="ml-2 text-sm text-gray-600">
                      {category.is_active ?? true ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="text-white bg-teal-600 cursor-pointer rounded-md p-2"
                      disabled={isLoading}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="text-neutral-700 bg-neutral-300 cursor-pointer rounded-md p-2"
                      disabled={isLoading}
                      title="Delete"
                    >
                      <GoTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No categories found. Add your first category!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}