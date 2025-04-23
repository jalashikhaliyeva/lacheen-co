// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Sample data for each month with values falling in the range of the Y-axis ticks.
// const data = [
//   { month: "Jan", sales: 20, products: 40, visitors: 30 },
//   { month: "Feb", sales: 25, products: 42, visitors: 35 },
//   { month: "Mar", sales: 30, products: 38, visitors: 40 },
//   { month: "Apr", sales: 35, products: 45, visitors: 40 },
//   { month: "May", sales: 40, products: 50, visitors: 45 },
//   { month: "Jun", sales: 45, products: 44, visitors: 35 },
//   { month: "Jul", sales: 40, products: 42, visitors: 30 },
//   { month: "Aug", sales: 35, products: 40, visitors: 25 },
//   { month: "Sep", sales: 30, products: 38, visitors: 30 },
//   { month: "Oct", sales: 25, products: 36, visitors: 35 },
//   { month: "Nov", sales: 20, products: 40, visitors: 40 },
//   { month: "Dec", sales: 15, products: 42, visitors: 45 },
// ];

// // Custom tooltip component that displays static values on hover.
// const CustomTooltip = ({ active }) => {
//   if (active) {
//     return (
//       <div
//         style={{
//           backgroundColor: "rgba(255,255,255,0.9)",
//           border: "1px solid #ccc",
//           padding: "10px",
//           borderRadius: "5px",
//           boxShadow: "0px 0px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         <p style={{ margin: 0 }}>Visitors: 4</p>
//         <p style={{ margin: 0 }}>Sales: 2</p>
//         <p style={{ margin: 0 }}>Products: 40</p>
//       </div>
//     );
//   }
//   return null;
// };

// const SalesProductsVisitorsChart = () => {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "500px",
//         padding: "20px",
//         backgroundColor: "#f9f9f9",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         Monthly Sales, Products, and Visitors
//       </h2>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           {/* YAxis with predefined tick values for improved readability */}
//           <YAxis ticks={[10, 15, 20, 25, 30, 35, 40, 45, 50]} />
//           <Tooltip content={<CustomTooltip />} />
//           <Legend />
//           {/* Sales line in orange */}
//           <Line
//             type="monotone"
//             dataKey="sales"
//             stroke="#FFA500"
//             dot={{ r: 5 }}
//             activeDot={{ r: 8 }}
//           />
//           {/* Products line in blue */}
//           <Line
//             type="monotone"
//             dataKey="products"
//             stroke="#0000FF"
//             dot={{ r: 5 }}
//             activeDot={{ r: 8 }}
//           />
//           {/* Visitors line in green */}
//           <Line
//             type="monotone"
//             dataKey="visitors"
//             stroke="#008000"
//             dot={{ r: 5 }}
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SalesProductsVisitorsChart;

import React from "react";
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

// Monthly data for the chart
const data = [
  { month: "Jan", sales: 20, products: 40, visitors: 30 },
  { month: "Feb", sales: 25, products: 42, visitors: 35 },
  { month: "Mar", sales: 30, products: 38, visitors: 40 },
  { month: "Apr", sales: 35, products: 45, visitors: 40 },
  { month: "May", sales: 40, products: 50, visitors: 45 },
  { month: "Jun", sales: 45, products: 44, visitors: 35 },
  { month: "Jul", sales: 40, products: 42, visitors: 30 },
  { month: "Aug", sales: 35, products: 40, visitors: 25 },
  { month: "Sep", sales: 30, products: 38, visitors: 30 },
  { month: "Oct", sales: 25, products: 36, visitors: 35 },
  { month: "Nov", sales: 20, products: 40, visitors: 40 },
  { month: "Dec", sales: 15, products: 42, visitors: 45 },
];

// Custom tooltip to display dynamic data for the hovered month
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0px 0px 8px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
        <p style={{ margin: 0 }}>
          Sales: {payload.find((item) => item.dataKey === "sales")?.value}
        </p>
        <p style={{ margin: 0 }}>
          Products: {payload.find((item) => item.dataKey === "products")?.value}
        </p>
        <p style={{ margin: 0 }}>
          Visitors: {payload.find((item) => item.dataKey === "visitors")?.value}
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend component that renders colored dots with labels
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="mb-5 font-helvetica text-neutral-800" style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
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
  return (
    <div
    className="bg-white border border-neutral-300 mt-5 rounded-lg "
      style={{
        width: "100%",
        height: "500px",
        padding: "20px",
       
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Monthly Sales, Products, and Visitors
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis ticks={[10, 15, 20, 25, 30, 35, 40, 45, 50]} />
          <Tooltip content={<CustomTooltip />} />
          {/* Add custom legend to display colored dots with labels */}
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

