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

const LineChart2 = ({ journal }) => {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];

  const rawPublications = (journal.publication || []);
  const rawNume = (journal.numerator || []);
  const rawDeno = (journal.denominator || []);

  const missingPublications = [];
  const missingLeading = [];

  const color1 = "#6A1B9A";
  const color2 = "#00897B";

  const publications = years.map((_, i) => {
    if (rawPublications[i] == null || isNaN(Number(rawPublications[i]))) {
      missingPublications.push(years[i]);
      return 0;
    }
    return Number(rawPublications[i]);
  });

  const Leading = years.map((_, i) => {
    const n = rawNume[i];
    const d = rawDeno[i];
    if (n == null || d == null || Number(d) === 0) {
      missingLeading.push(years[i]);
      return 0;
    }
    return Number(n) / Number(d);
  });

  const data = {
    labels: years,
    datasets: [
      {
        label: "Publications",
        data: publications.reverse(),
        borderColor: color1,
        backgroundColor: color1 + "33",
        tension: 0.3,
        yAxisID: "y1",
        pointStyle: (ctx) =>
          missingPublications.includes(2024-ctx.dataIndex) ? "crossRot" : "circle",
        pointRadius: (ctx) =>
          missingPublications.includes(2024-ctx.dataIndex) ? 7 : 4,
        pointBackgroundColor: color1,
        pointBorderColor: color1, 
      },
      {
        label: "領先程度",
        data: Leading.reverse(),
        borderColor: color2,
        backgroundColor: color2 + "33",
        tension: 0.3,
        yAxisID: "y2",
        pointStyle: (ctx) =>
          missingLeading.includes(2024-ctx.dataIndex) ? "crossRot" : "circle",
        pointRadius: (ctx) =>
          missingLeading.includes(2024-ctx.dataIndex) ? 7 : 4,
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
        text: "期刊領先程度與發表篇數歷年趨勢圖",
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

            if (label === "Publications" && missingPublications.includes(2024-i)) {
              return `${label}: 無資料`;
            }
            if (label === "領先程度" && missingLeading.includes(2024-i)) {
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
          text: "Publications",
        },
        ticks: { color: color1 },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "領先程度",
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
      {(missingPublications.length > 0 || missingLeading.length > 0) && (
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
          {missingPublications.length > 0 && (
            <div>
              <strong style={{ color: color1 }}>Publication缺失年分:</strong>{" "}
              {missingPublications.map((y) => 2019 + (2024 - y)).reverse().join(", ")}
            </div>
          )}
          {missingLeading.length > 0 && (
            <div>
              <strong style={{ color: color2 }}>領先程度缺失年分:</strong>{" "}
              {missingLeading.map((y) => 2019 + (2024 - y)).reverse().join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LineChart2;
