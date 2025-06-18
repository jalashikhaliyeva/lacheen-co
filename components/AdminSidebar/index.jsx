import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiBox,
  FiList,
  FiShoppingCart,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiGrid,
} from "react-icons/fi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { PiUsersThree } from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/backendConfig";
import { useRouter } from "next/router";
import Image from "next/image";
import { fetchCategories } from "@/firebase/services/categoriesService";

function AdminSidebar({ toggleSidebar }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [productsOpen, setProductsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState(null);

  useEffect(() => {
    // Fetch categories when component mounts
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const currentPath = router.asPath;
    const query = router.query;

    if (currentPath === "/admin") {
      setActiveItem("dashboard");
    } else if (
      currentPath.startsWith("/admin/products") ||
      currentPath.startsWith("/admin/product-detailed") ||
      currentPath.startsWith("/admin/product-edit")
    ) {
      setActiveItem("products");
      setProductsOpen(true);

      // Set active sub-item based on query parameters
      if (query.filter === "new") {
        setActiveSubItem("products-new");
      } else if (query.filter === "notupdated") {
        setActiveSubItem("products-notupdated");
      } else if (query.category) {
        setActiveSubItem(`category-${query.category}`);
      } else {
        setActiveSubItem("products-all");
      }
    } else if (currentPath.startsWith("/admin/categories")) {
      setActiveItem("categories");
    } else if (currentPath.startsWith("/admin/orders")) {
      setActiveItem("orders");
    } else if (currentPath.startsWith("/admin/settings")) {
      setActiveItem("settings");
    } else if (currentPath.startsWith("/admin/client")) {
      setActiveItem("client");
    } else if (currentPath.startsWith("/admin/sizes")) {
      setActiveItem("sizes");
    }
  }, [router.asPath, router.query]); // Add router.query as dependency
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleItemClick = (id, route, isSubItem = false) => {
    if (isSubItem) {
      setActiveSubItem(id);
    }
    setActiveItem(id);
    router.push(route);
    // Close sidebar on mobile after clicking a menu item
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome size={20} />,
      route: "/admin",
    },
    {
      id: "products",
      label: "Products",
      icon: <FiBox size={20} />,
      route: "/admin/products",
      children: [
        { id: "products-all", label: "All", route: "/admin/products" },
        {
          id: "products-new",
          label: "New",
          route: "/admin/products?filter=new",
        },
        // {
        //   id: "products-notupdated",
        //   label: "Not Updated",
        //   route: "/admin/products?filter=notupdated",
        // },
        // {
        //   id: "products-ended",
        //   label: "Ended",
        //   route: "/admin/products?filter=ended",
        // },
        // Add dynamic categories here
        ...categories.map((category) => ({
          id: `category-${category.id}`,
          label: category.name?.az || category.name,
          route: `/admin/products?category=${category.id}`,
        })),
      ],
    },
    {
      id: "categories",
      label: "Categories",
      icon: <FiList size={20} />,
      route: "/admin/categories",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <FiShoppingCart size={20} />,
      route: "/admin/orders",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings size={20} />,
      route: "/admin/settings",
    },
    {
      id: "client",
      label: "Users",
      icon: <PiUsersThree size={20} />,
      route: "/admin/client",
    },
    {
      id: "sizes",
      label: "Sizes",
      icon: <FiGrid size={20} />,
      route: "/admin/sizes",
    },
    {
      id: "colors",
      label: "Colors",
      icon: <HiOutlineColorSwatch size={20} />,
      route: "/admin/colors",
    },
  ];

  const isActive = (id, children) => {
    if (activeItem === id) return true;
    if (children) {
      return children.some((child) => child.id === activeSubItem);
    }
    return false;
  };

  const isSubItemActive = (id) => {
    return activeSubItem === id;
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[280px] max-w-[300px] flex flex-col justify-between bg-white border-r border-gray-200 z-50">
      <div>
        <div className="w-[170px] m-auto">
          <Image
            width={200}
            height={300}
            alt="logo-lacheen.co"
            className="w-full"
            src={"/images/logo/lacheen-logo-png.png"}
          />
        </div>
        <nav>
          {menuItems.map((item) => (
            <div key={item.id}>
              <div
                onClick={() => {
                  if (item.children) {
                    setProductsOpen(!productsOpen);
                    setActiveItem(item.id);
                  } else {
                    handleItemClick(item.id, item.route);
                  }
                }}
                className={`flex items-center justify-between space-x-3 py-3 px-4 cursor-pointer hover:bg-teal-50 relative
                ${
                  isActive(item.id, item.children)
                    ? "text-teal-500"
                    : "text-black"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.children && (
                  <FiChevronDown
                    size={20}
                    className={`transform transition-transform duration-300 ${
                      productsOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                )}
                {isActive(item.id, item.children) && (
                  <div className="absolute left-0 top-0 h-full w-1 rounded-tr-3xl rounded-br-3xl bg-teal-500" />
                )}
              </div>
              {item.children && (
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight:
                      productsOpen && isActive(item.id, item.children)
                        ? "500px"
                        : "0px",
                  }}
                >
                  <ul className="pl-12">
                    {item.children.map((child) => (
                      <li
                        key={child.id}
                        onClick={() =>
                          handleItemClick(child.id, child.route, true)
                        }
                        className={`py-2 px-4 cursor-pointer hover:bg-teal-50 relative
                        ${
                          isSubItemActive(child.id)
                            ? "text-teal-500"
                            : "text-black"
                        }`}
                      >
                        {child.label}
                        {isSubItemActive(child.id) && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-teal-500 rounded-tr-3xl rounded-br-3xl" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center cursor-pointer justify-center w-full py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          <FiLogOut size={20} className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
