import React from "react";
import Container from "../Container";
import { RiMenuFoldFill, RiMenuUnfoldLine, RiMenuUnfold2Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";

function AdminHeader({ toggleSidebar, sidebarOpen }) {
  return (
    <div
      className={`fixed top-0 z-50 shadow-xs border-b border-gray-200 bg-white transition-all duration-300 ${
        sidebarOpen ? "left-[280px]" : "left-0"
      }`}
      style={{
        width: sidebarOpen ? "calc(100% - 280px)" : "100%",
      }}
    >
      <Container>
        <header className="flex justify-between py-4">
          {/* Toggle Icon */}
          {sidebarOpen ? (
            <RiMenuUnfold2Line
              onClick={toggleSidebar}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <RiMenuUnfoldLine
              onClick={toggleSidebar}
              className="text-2xl cursor-pointer"
            />
          )}

          <div className="relative border border-neutral-300 rounded-md p-1.5">
            <IoNotificationsOutline className="text-2xl bell-swing" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-400 rounded-full transform translate-x-1/2 -translate-y-1/2">
              1
            </span>
          </div>
        </header>
      </Container>
    </div>
  );
}

export default AdminHeader;
