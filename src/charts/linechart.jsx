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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ journal }) => {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];

  const rawIfValue = (journal.if_value || []);
  const rawTotalCities = (journal.totalcites || []);

  const missingIfValue = [];
  const missingTotalCities = [];

  const color1 = "#C62828";
  const color2 = "#1565C0";

  const ifValue = years.map((_, i) => {
    if (rawIfValue[i] == null || isNaN(Number(rawIfValue[i]))) {
      missingIfValue.push(years[i]);
      return 0;
    }
    return Number(rawIfValue[i]);
  });

  const totalCities = years.map((_, i) => {
    if (rawTotalCities[i] == null || isNaN(Number(rawTotalCities[i]))) {
      missingTotalCities.push(years[i]);
      return 0;
    }
    return Number(rawTotalCities[i]);
  });

  const data = {
    labels: years,
    datasets: [
      {
        label: "IF Value",
        data: ifValue.reverse(),
        borderColor: color1,
        backgroundColor: color1 + "33",
        tension: 0.3,
        yAxisID: "y1",
        pointStyle: (ctx) =>
          missingIfValue.includes(2024-ctx.dataIndex) ? "crossRot" : "circle",
        pointRadius: (ctx) =>
          missingIfValue.includes(2024-ctx.dataIndex) ? 7 : 4,
        pointBackgroundColor: color1,
        pointBorderColor: color1, 
      },
      {
        label: "Total Cities",
        data: totalCities.reverse(),
        borderColor: color2,
        backgroundColor: color2 + "33",
        tension: 0.3,
        yAxisID: "y2",
        pointStyle: (ctx) =>
          missingTotalCities.includes(2024-ctx.dataIndex) ? "crossRot" : "circle",
        pointRadius: (ctx) =>
          missingTotalCities.includes(2024-ctx.dataIndex) ? 7 : 4,
        pointBackgroundColor: color2,
        pointBorderColor: color2, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "期刊被引用次數與影響力歷年趨勢圖",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 5,
          bottom: 15,
        },
      },
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const i = ctx.dataIndex;
            const label = ctx.dataset.label;
            const value = ctx.formattedValue;

            if (label === "IF Value" && missingIfValue.includes(2024-i)) {
              return `${label}: 無資料`;
            }
            if (label === "Total Cities" && missingTotalCities.includes(2024-i)) {
              return `${label}: 無資料`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "IF Value",
        },
        ticks: { color: color1 },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Total Cities",
        },
        ticks: { color: color2 },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={data} options={options} />
      {/* 顯示缺失年份 */}
      <div style={{ height: "20px" }} />
      {(missingIfValue.length > 0 || missingTotalCities.length > 0) && (
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            width: "70%",
            margin: "0 auto",
          }}
        >
          {missingIfValue.length > 0 && (
            <div>
              <strong style={{ color: color1 }}>IF值缺失年分:</strong>{" "}
              {missingIfValue.map((y) => 2019 + (2024 - y)).reverse().join(", ")}
            </div>
          )}
          {missingTotalCities.length > 0 && (
            <div>
              <strong style={{ color: color2 }}>被引次數缺失年分:</strong>{" "}
              {missingTotalCities.map((y) => 2019 + (2024 - y)).reverse().join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LineChart;
