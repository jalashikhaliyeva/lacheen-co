import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "../AdminHeader";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative">
      {sidebarOpen && <AdminSidebar />}
      <div
        className={`transition-all mt-[70px] duration-300 ${
          sidebarOpen ? "ml-[280px]" : "ml-0"
        }`}
      >
        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
