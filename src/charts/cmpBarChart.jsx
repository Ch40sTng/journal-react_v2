import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CmpBarChart = ({ journals, metric }) => {
  if (!journals || journals.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#888",
          fontSize: "20px",
        }}
      >
        尚未選取任何期刊，請選擇後查看圖表。
      </div>
    );
  }

  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const colors = [
    "#C62828", "#1565C0", "#2E7D32", "#6A1B9A", "#FF8F00",
    "#00838F", "#D84315", "#4E342E", "#37474F", "#AD1457"
  ];

  const metricLabels = {
    if_value: "影響因子(Impact Factor)",
    totalcites: "被引用次數",
    publication: "發表數量",
    ratio: "領先程度",
  };

  const datasets = journals.map((journal, idx) => {
    const rawData = journal[metric] || [];
    const missingYears = [];

    const data = years.map((_, i) => {
      const value = rawData[i];
      if (value == null || isNaN(Number(value))) {
        missingYears.push(years[i]);
        return 0;
      }
      return Number(value);
    });

    return {
      label: journal.name || `期刊 ${idx + 1}`,
      data: data,
      backgroundColor: colors[idx % colors.length] + "88",
      borderColor: colors[idx % colors.length],
      borderWidth: 1,
      missingYears,
    };
  });

  const data = {
    labels: years,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${metricLabels[metric] || metric} 比較圖`,
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
            const missing = ctx.dataset.missingYears || [];
            if (missing.includes(years[i])) {
              return `${label}: 無資料`;
            }
            return `${label}: ${ctx.formattedValue}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: metricLabels[metric] || metric,
        },
      },
    },
  };

  const missingInfo = datasets
    .map((d) => ({
      name: d.label,
      missing: d.missingYears,
      color: d.borderColor,
    }))
    .filter((d) => d.missing.length > 0);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        gap: "24px",
      }}
    >
      {/* 左邊：圖表 */}
      <div style={{ width: "65%", height: "350px" }}>
        <Bar data={data} options={options} />
        {journals.length > 5 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#888",
              marginTop: "10px",
            }}
          >
            ※ 只顯示前 5 筆期刊資料
          </div>
        )}
      </div>

      {/* 右邊：缺失資料提示 */}
      {missingInfo.length > 0 && (
        <div
          style={{
            width: "35%",
            fontSize: "14px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            marginLeft: "10px",
            borderLeft: "3px solid #ddd",
          }}
        >
          {missingInfo.map((item, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <strong style={{ color: item.color }}>{item.name} 缺失年分:</strong>
              <br />
              {item.missing.join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CmpBarChart;
