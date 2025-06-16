// pages/admin/index.js
import useAuth from "@/shared/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/backendConfig";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/AdminSidebar";
import AdminLayout from "@/components/AdminLayout";
import Spinner from "@/components/Spinner";
import AdminHeader from "@/components/AdminHeader";
import Container from "@/components/Container";
import DashboardStatistics from "@/components/DashboardStatistics";
import DashboardOrders from "@/components/DashboardOrders";
import SalesProductsVisitorsChart from "@/components/SalesProductsVisitorsChart";
import StackedAreaChart from "@/components/SalesProductsVisitorsChart";
import Example from "@/components/PureComponent";
import PieMostSells from "@/components/PureComponent";
import LastUsers from "@/components/LastUsers";
import WomenShoesTable from "@/components/ProductsTable";
import RecentOrdersTable from "@/components/RecentOrdersTable";

export default function AdminDashboard() {
  const { user } = useAuth(); //admin auth
  const router = useRouter();

  if (!user)
    return (
      <>
        <Spinner />
      </>
    );

  return (
    <div className="bg-bodyGray">
      <AdminLayout>
        <Container>
          <DashboardStatistics />
          <DashboardOrders />
          <StackedAreaChart />
          <div className="flex items-center gap-3 w-full mt-5">
            <div className="w-1/2">
              <PieMostSells />
            </div>

            <div className="w-1/2">
              <LastUsers />
            </div>
          </div>
        </Container>
      </AdminLayout>
    </div>
  );
}
