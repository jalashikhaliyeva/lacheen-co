import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Siyah Loafer", value: 400 },
  { name: "Vizon Kovboy Bot", value: 300 },
  { name: "Siyah Süet Topuklu Kadın Çizme", value: 300 },
  { name: "Vizon Topuklu Ayakkabı", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default class PieMostSells extends PureComponent {
  renderLegend() {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, auto)", // Changed from 1fr to auto
          rowGap: "8px",
          columnGap: "16px",
          marginBottom: "20px",
          justifyContent: "center", // Center the grid items
        }}
      >
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                width: "22px",
                height: "6px",
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "10%",
                marginRight: "8px",
              }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div
        className="w-fit bg-white border border-neutral-300 rounded-lg p-5 "
        style={{ width: "100%", height: "400px" }}
      >
        <h2 className="text-lg text-neutral-700 text-center font-semibold font-gilroy pb-2">
          Most Selling
        </h2>
        {this.renderLegend()}
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="font-semibold"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
