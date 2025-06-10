import React, { useState, useEffect } from "react";
import { getAllUsers } from "@/firebase/services/firebaseUserService";

// Utility function to get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return "?";
  const names = fullName.split(" ");
  return names
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
};

function LastUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const allUsers = await getAllUsers();
        
        // Sort users by creation date (newest first)
        const sortedUsers = allUsers.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Take only the first 4 users
        setUsers(sortedUsers.slice(0, 4));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-300 p-6 flex flex-col justify-center items-center rounded-lg font-gilroy w-full h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-neutral-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-300 p-6 flex flex-col  rounded-lg font-gilroy w-full h-[400px]">
      <h3 className="text-md text-neutral-700 font-medium pb-3">
        Last Registered Users List
      </h3>

      {users.map((user) => (
        <div key={user.id} className="flex flex-row justify-between items-center py-2 border-b border-neutral-200 last:border-0">
          <div className="flex flex-row gap-2 items-center">
            {/* Initials */}
            <div className="bg-gray-200 text-neutral-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
              {getInitials(user.displayName)}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-800 text-lg">{user.displayName || 'Unnamed User'}</p>
              <p className="text-neutral-500 text-sm">{user.email}</p>
            </div>
          </div>
          <div>
            <p className="text-base font-semibold text-emerald-500">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LastUsers;
