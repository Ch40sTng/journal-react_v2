import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ journal, selectedYear }) => {
  if (!journal || !journal.if_value) {
    return <p>Loading...</p>;
  }

  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const selectedIndex = years.indexOf(selectedYear);
  const fields = ["if_value", "totalcites", "numerator", "ratio"];

  // 將原始資料轉成數字，缺失值保留為 null
  const rawData = fields.map(field =>
    journal[field].map(value => {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }).reverse()
  );

  // 計算每欄平均值（忽略 null）
  const means = rawData.map(arr => {
    const valid = arr.filter(v => v !== null);
    return valid.reduce((sum, val) => sum + val, 0) / valid.length;
  });

  // 計算標準差（n - 1，忽略 null）
  const stdDevs = rawData.map((arr, i) => {
    const mean = means[i];
    const valid = arr.filter(v => v !== null);
    const variance = valid.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (valid.length - 1 || 1);
    return Math.sqrt(variance);
  });

  // Z-score 標準化（保留 null）
  const standardizeData = (data, mean, stdDev) => {
    return data.map(value => {
      if (value === null) return null;
      if (stdDev === 0) return 0;
      return (value - mean) / stdDev;
    });
  };

  const standardizedData = rawData.map((data, i) =>
    standardizeData(data, means[i], stdDevs[i])
  );

  const datasets = [
    {
      label: `${journal.name}_${selectedYear}`,
      data: standardizedData.map(values => values[selectedIndex] ?? null),
      backgroundColor: `rgba(100, 150, 200, 0.2)`,
      borderColor: `rgba(100, 150, 200, 1)`,
      borderWidth: 2,
    },
  ];

  const data = {
    labels: ["Impact Factor", "TotalCites", "Leading Rank", "Publications"],
    datasets: datasets,
  };

  const options = {
    responsive: true,
    spanGaps: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        suggestedMin: -10,
        suggestedMax: 10,
        angleLines: { color: "gray" },
        grid: { color: "lightgray" },
        pointLabels: { font: { size: 14 } },
      },
    },
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "350px" }}>
      <div style={{ flex: "1 1 85%", minWidth: 0 }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
