import React, { useState } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";
import HeroSection from "@/components/settings/HeroSection";
import CategoriesSection from "@/components/settings/CategoriesSection";
import AttitudeSection from "@/components/settings/AttitudeSection";
import { Toaster } from "react-hot-toast";

function Settings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("hero");

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "categories", label: "Categories" },
    { id: "attitude", label: "Attitude" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "hero":
        return <HeroSection />;
      case "categories":
        return <CategoriesSection />;
      case "attitude":
        return <AttitudeSection />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-bodyGray h-full pb-20 pt-30">
          <Container>
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        ${
                          activeTab === tab.id
                            ? "border-emerald-500 text-emerald-600 cursor-pointer"
                            : "border-transparent text-gray-500 cursor-pointer hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">{renderContent()}</div>
            </div>
          </Container>
          <Toaster position="top-right" />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Settings;
