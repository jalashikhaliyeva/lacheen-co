import React from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Container from "@/components/Container";
import ProductEditTabs from "@/components/ProductEdit";
import SizesList from "@/components/Sizes";
import ColorsList from "@/components/Admin/ProductCreate/ColorsList";

function Colors() {
  const router = useRouter();
  const { name } = router.query;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-bodyGray h-full pb-20 pt-5">
          <Container>
            <ColorsList />
          </Container>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default Colors;
