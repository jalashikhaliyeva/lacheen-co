import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";

function Orders() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div></div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Orders;
