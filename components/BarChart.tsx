import React from "react";
import { Bar } from "react-chartjs-2";

export default function BarChart() {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => 100),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => 200),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  return (
    <div className="mb-5">
      <Bar options={options} data={chartData} />
    </div>
  );
}
