import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ journal }) => {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const ifValues = journal.if_value; 
  const totalCites = journal.totalcites; 

  const data = {
    labels: years,
    datasets: [
      {
        label: "Impact Factor (IF)",
        data: ifValues,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
        yAxisID: "y1", // 綁定到左側 Y 軸
      },
      {
        label: "Total Cites",
        data: totalCites,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.3,
        yAxisID: "y2", // 綁定到右側 Y 軸
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Impact Factor",
        },
        ticks: {
          color: "blue",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Total Cites",
        },
        ticks: {
          color: "red",
        },
        grid: {
          drawOnChartArea: false, // 避免兩條 Y 軸的格線重疊
        },
      },
    },
  };

  return <div style={{ height: "300px" }}><Line data={data} options={options} /></div>;
};

export default LineChart;
