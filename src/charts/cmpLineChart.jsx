import React from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CmpLineChart = ({ journals }) => {
  if (!journals || journals.length === 0) return null;

  const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  const datasets = journals.map((journal, index) => {
    const color = COLORS[index % COLORS.length];
    return {
      label: journal.name,
      data: journal.if_value.map((v) => Number(v)).reverse(),
      borderColor: color,
      backgroundColor: color + "33",
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.3,
    };
  });

  const data = {
    labels: years,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 100,
      },
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
          usePointStyle: true,
          boxWidth: 20,
          padding: 20, 
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Impact Factor",
        },
      },
    },
  };

  return (
    <div style={{ width: "1000px", height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CmpLineChart;
