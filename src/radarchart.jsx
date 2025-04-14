import React from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ( { journal, width = "100%", height = 350 } ) => {

    if (!journal || !journal.if_value) {
        return <p>Loading...</p>;
    }
    
    // 標準化函數 (Z-score normalization)
    const standardizeData = (data, mean, stdDev) => {
        return data.map(value => {
            if (stdDev === 0) return 0; // 避免除以 0
            return (value - mean) / stdDev;
        });
    };
    
    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    // 透過 fields 作為 index 直接存取 journal 裡的 array
    const fields = ["if_value", "totalcites", "numerator", "denominator", "publication"];
    const rawData = fields.map(field => journal[field].map(value => Number(value) || 0).reverse());

    // 計算標準化所需的均值與標準差
    const means = rawData.map(arr => arr.reduce((sum, val) => sum + val, 0) / arr.length);
    const stdDevs = rawData.map((arr, i) => {
        const mean = means[i];
        const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    });

    // 標準化數據
    const standardizedData = rawData.map((data, i) => standardizeData(data, means[i], stdDevs[i]));

    
    // 建立 datasets，每年一組
    const datasets = years.map((year, i) => ({
        label: `${journal.name}_${year}`,
        data: standardizedData.map(values => values[i] ?? 0), // 避免 undefined
        backgroundColor: `rgba(${50 + i * 50}, ${99 + i * 20}, 132, 0.2)`,
        borderColor: `rgba(${50 + i * 50}, ${99 + i * 20}, 132, 1)`,
        borderWidth: 2,
    }));

    const data = {
        labels: ["Impact factors", "TotalCites", "Rank Numerator", "Rank Denominator", "Publications"],
        datasets: datasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              font: { size: 12 },
            },
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
        <div style={{ display: "flex", width: "100%", height: "300px" }}>
            {/* Radar Chart 本體區塊 */}
            <div style={{ flex: "1 1 70%", minWidth: 0 }}>
                <Radar data={data} options={options} />
            </div>
        </div>
    );
};

export default RadarChart;