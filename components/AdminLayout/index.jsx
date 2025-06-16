import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "../AdminHeader";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on mobile

  // Close sidebar when clicking outside on mobile
  const handleClickOutside = (e) => {
    if (
      window.innerWidth < 768 &&
      sidebarOpen &&
      !e.target.closest("#sidebar")
    ) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Check screen size on mount and resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Closed by default on mobile
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          id="sidebar"
          className="fixed top-0 bottom-0 z-40 w-[280px] bg-white shadow-lg transition-all duration-300 ease-in-out transform md:translate-x-0"
        >
          <AdminSidebar toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* Main content */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "md:ml-[280px]" : "ml-0"
        }`}
      >
        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
