import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import ClientsPage from "@/components/ClientsPage";
import Container from "@/components/Container";

function Clients() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Container>
          <ClientsPage />
        </Container>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Clients;
