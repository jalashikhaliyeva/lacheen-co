import { useState, useEffect, useRef } from "react";

export default function AddEditCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  category,
}) {
  const [activeLang, setActiveLang] = useState("az");
  const [formData, setFormData] = useState({
    az: { name: "", slug: "" },
    en: { name: "", slug: "" },
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef();

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        az: {
          name:
            category.name?.az ||
            (typeof category.name === "string" ? category.name : ""),
          slug:
            category.slug?.az ||
            (typeof category.slug === "string" ? category.slug : ""),
        },
        en: {
          name: category.name?.en || "",
          slug: category.slug?.en || "",
        },
      });
    } else {
      setFormData({
        az: { name: "", slug: "" },
        en: { name: "", slug: "" },
      });
    }
    setErrors({});
    setActiveLang("az");
  }, [mode, category, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [name]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.az.name.trim()) {
      newErrors.name = "Azerbaijani category name is required";
      setActiveLang("az");
      setErrors(newErrors);
      return false;
    }
    if (!formData.az.slug.trim()) {
      newErrors.slug = "Azerbaijani slug is required";
      setActiveLang("az");
      setErrors(newErrors);
      return false;
    }

    if (formData.en.name.trim() || formData.en.slug.trim()) {
      if (!formData.en.name.trim()) {
        newErrors.name = "English category name is required";
        setActiveLang("en");
        setErrors(newErrors);
        return false;
      }
      if (!formData.en.slug.trim()) {
        newErrors.slug = "English slug is required";
        setActiveLang("en");
        setErrors(newErrors);
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const categoryData = {
        name: {
          az: formData.az.name.trim(),
          en: formData.en.name.trim(),
        },
        slug: {
          az: formData.az.slug.trim(),
          en: formData.en.slug.trim(),
        },
      };

      if (!categoryData.name.en) delete categoryData.name.en;
      if (!categoryData.slug.en) delete categoryData.slug.en;

      if (mode === "edit" && category) {
        onSubmit({ ...categoryData, id: category.id });
      } else {
        onSubmit(categoryData);
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const languageTabs = [
    { id: "az", name: "Az" },
    { id: "en", name: "En" },
  ];

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        ref={modalRef}
        className="bg-white text-neutral-800 font-gilroy rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {languageTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLang(tab.id)}
                className={`${
                  activeLang === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData[activeLang].name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. Electronics"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData[activeLang].slug}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.slug ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. electronics"
              disabled={isLoading}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly version of the name
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 cursor-pointer rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white cursor-pointer rounded-md hover:bg-teal-700 flex items-center justify-center min-w-24"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              ) : mode === "add" ? (
                "Add Category"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
