import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "@/firebase/backendConfig";
import { format } from "date-fns";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function ClientsPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const db = getDatabase(app);
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList = Object.entries(usersData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();

    // Search in user info
    return (
      user.phoneNumber?.toLowerCase().includes(searchLower) ||
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-8 mt-20 text-neutral-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients Management</h1>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search by name, email, or phone number"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0  text-neutral-800 right-2 flex items-center justify-center p-1"
            >
              <FiX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Addresses
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-neutral-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.displayName || t("no_info")}
                    </span>
                    <span className="text-gray-500">ID: {user.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="text-gray-500">
                      {user.email || t("no_info")}
                    </div>
                    <div className="text-gray-500">
                      {user.phoneNumber || t("no_info")}
                    </div>
                    <div className="text-gray-500">
                      {user.birthday || t("no_info")}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MMM dd, yyyy HH:mm")
                    : t("no_info")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-2">
                      {user.addresses.map((address, index) => (
                        <div
                          key={address.id || index}
                          className="border-b border-gray-100 pb-2 last:border-0"
                        >
                          <div className="font-medium">
                            {address.title || t("no_info")}
                          </div>
                          <div className="text-gray-500">{address.address}</div>
                          <div className="text-gray-500">
                            {address.city || t("no_info")}
                          </div>
                          {address.postalCode && (
                            <div className="text-gray-500">
                              {t("postal_code")}: {address.postalCode}
                            </div>
                          )}
                          {address.phone && (
                            <div className="text-gray-500">
                              {t("phone")}: {address.phone}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">{t("no_info")}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientsPage;
