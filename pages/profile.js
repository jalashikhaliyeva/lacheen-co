import { useState } from "react";
import Header from "@/components/Header";
import NavList from "@/components/NavList";
import ProfileInformation from "@/components/ProfileInformation";
import Footer from "@/components/Footer";
import { useAuth } from "@/shared/context/AuthContext";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // mock data for the demo; replace with real fetch later
  const orders = { total: 14, pending: 3, cancelled: 1 };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* simple spinner */}
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-45 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "100px" }}
      />

      <main>
        <Header />
        <NavList onMenuToggle={setIsMenuOpen} />

        <ProfileInformation
          user={user}
          orders={orders}
          onLogout={logout}
        />

        <Footer />
      </main>
    </div>
  );
}
