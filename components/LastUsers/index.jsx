import React from "react";

// Utility function to get initials from full name
const getInitials = (fullName) => {
  const names = fullName.split(" ");
  return names
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
};

const mockUsers = [
  {
    id: 1,
    name: "Konnor Guzman",
    email: "konnor@gmail.com",
    lastActive: "2 days ago",
  },
  {
    id: 2,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    lastActive: "5 hours ago",
  },
  {
    id: 3,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    lastActive: "1 week ago",
  },
  {
    id: 4,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    lastActive: "1 week ago",
  },
];

function LastUsers() {
    return (
      <div className="bg-white border border-neutral-300 p-6 flex flex-col justify-center  rounded-lg font-gilroy w-full h-[400px]">
        <h3 className="text-md text-neutral-700 font-medium pb-3">
          Last Registered Users List
        </h3>
  
        {mockUsers.map((user) => (
          <div key={user.id} className="flex flex-row justify-between items-center py-2 border-b border-neutral-200 last:border-0">
            <div className="flex flex-row gap-2 items-center">
              {/* Initials */}
              <div className="bg-gray-200 text-neutral-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-neutral-800 text-lg">{user.name}</p>
                <p className="text-neutral-500 text-sm">{user.email}</p>
              </div>
            </div>
            <div>
              <p className="text-base font-semibold text-emerald-500">
                {user.lastActive}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
export default LastUsers;
