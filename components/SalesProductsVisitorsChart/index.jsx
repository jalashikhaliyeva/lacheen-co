import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getOrderStatistics } from "@/firebase/services/firebaseOrderService";
import { fetchProducts } from "@/firebase/services/firebaseProductsService";
import { getPageViewStatistics } from "@/firebase/services/firebaseAnalyticsService";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "@/firebase/backendConfig";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="text-neutral-800 bg-white border border-neutral-300 rounded-lg p-3">
        <p className="text-neutral-800 font-medium">{label}</p>
        <p className="text-neutral-800">
          Sales: {payload.find((item) => item.dataKey === "sales")?.value}
        </p>
        <p className="text-neutral-800">
          Products: {payload.find((item) => item.dataKey === "products")?.value}
        </p>
        <p className="text-neutral-800">
          Visitors: {payload.find((item) => item.dataKey === "visitors")?.value}
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div
      className="mb-5 font-helvetica text-neutral-800"
      style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
    >
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{ display: "flex", alignItems: "center", marginRight: "20px" }}
        >
          <div
            style={{
              backgroundColor: entry.color,
              borderRadius: "50%",
              width: "10px",
              height: "10px",
              marginRight: "5px",
            }}
          ></div>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const StackedAreaChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderStats, products, pageViews] = await Promise.all([
          getOrderStatistics(),
          fetchProducts(),
          getPageViewStatistics(),
        ]);

        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toLocaleString("default", { month: "short" });
        }).reverse();

        const db = getDatabase(app);
        const ordersRef = ref(db, "all-orders");
        const ordersSnapshot = await get(ordersRef);
        const allOrders = ordersSnapshot.exists() ? ordersSnapshot.val() : {};

        const data = months.map((month) => {
          const monthSales = Object.values(allOrders).reduce((total, order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = orderDate.toLocaleString("default", {
              month: "short",
            });
            if (
              orderMonth === month &&
              (order.status === "confirmed" || order.status === "delivered")
            ) {
              return total + 1;
            }
            return total;
          }, 0);

          return {
            month,
            sales: monthSales,
            products: products.length || 0,
            visitors: pageViews[month] || 0,
          };
        });

        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-neutral-300 mt-5 rounded-lg p-5">
        <p>Loading chart data...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-neutral-300 mt-5 rounded-lg"
      style={{
        width: "100%",
        height: "500px",
        padding: "20px",
      }}
    >
      <h2 className="text-neutral-800 text-lg font-medium text-center mb-5">
        Monthly Sales, Products, and Visitors
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Area
            type="monotone"
            dataKey="sales"
            stackId="1"
            stroke="#FFA500"
            fill="#FFA500"
          />
          <Area
            type="monotone"
            dataKey="products"
            stackId="1"
            stroke="#0000FF"
            fill="#3d74ee"
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stackId="1"
            stroke="#008000"
            fill="#0c9488"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaChart;
