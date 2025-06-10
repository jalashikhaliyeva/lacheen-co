import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import OrdersPage from "@/components/OrdersPage";
import Container from "@/components/Container";

function Orders() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Container>
          <OrdersPage />
        </Container>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Orders;
