import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActiveStatus,
} from "@/firebase/services/categoriesService";
import CategoryTable from "@/components/CategoryTable";
import AddEditCategoryModal from "@/components/AddEditCategoryModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Categories() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "add", // 'add' or 'edit'
    category: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
      setIsLoading(true);
      const createdCategory = await createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      setIsLoading(true);
      await updateCategory(updatedCategory.id, {
        name: updatedCategory.name,
        slug: updatedCategory.slug,
      });
      setCategories(
        categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    const currentLang = i18n.language;
    const categoryName = category.name?.[currentLang] || category.name?.az || category.name;
    
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.categoryId) return;

    try {
      setIsLoading(true);
      await deleteCategory(deleteModal.categoryId);
      setCategories(
        categories.filter((category) => category.id !== deleteModal.categoryId)
      );
      closeDeleteModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleToggleActive = async (id, isActive) => {
    try {
      setIsLoading(true);
      await toggleCategoryActiveStatus(id, isActive);
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, is_active: isActive } : cat
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      category: null,
    });
  };

  const openEditModal = (category) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      category,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      category: null,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      categoryId: null,
      categoryName: "",
    });
  };

  if (isLoading && categories.length === 0) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="bg-bodyGray h-full pb-20 pt-5">
            <Container>
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </Container>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="bg-bodyGray h-full pb-20 pt-5">
            <Container>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                Error: {error}
              </div>
            </Container>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-bodyGray h-full pb-20 mt-20 ">
          <Container>
            <div className="pt-7">
              <Breadcrumbs />
      
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 bg-teal-600 cursor-pointer text-white rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <PlusIcon />
                      Add New Category
                    </>
                  )}
                </button>
              </div>

              <CategoryTable
                categories={categories}
                onEdit={openEditModal}
                onDelete={handleDeleteClick}
                isLoading={isLoading}
                onToggleActive={handleToggleActive}
              />
            </div>

            <AddEditCategoryModal
              isOpen={modalState.isOpen}
              onClose={closeModal}
              onSubmit={
                modalState.mode === "add"
                  ? handleAddCategory
                  : handleEditCategory
              }
              isLoading={isLoading}
              mode={modalState.mode}
              category={modalState.category}
            />

            <DeleteConfirmationModal
              isOpen={deleteModal.isOpen}
              onClose={closeDeleteModal}
              onConfirm={handleDeleteConfirm}
              isLoading={isLoading}
              itemName={deleteModal.categoryName}
              itemType="category"
            />
          </Container>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);
