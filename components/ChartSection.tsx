"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { getAllYears, getYearlyValues } from "@/lib/calculator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

export type ChartType = "line" | "bar" | "area";

interface ChartSectionProps {
  amount: number;
  fromYear: number;
  toYear: number;
  type: ChartType;
  onTypeChange: (type: ChartType) => void;
}

export default function ChartSection({
  amount,
  fromYear,
  toYear,
  type,
  onTypeChange,
}: ChartSectionProps) {
  const years = getAllYears();
  const values = useMemo(() => getYearlyValues(amount, fromYear), [amount, fromYear]);

  const chartData = useMemo(() => {
    const dataPoints = values.map((v) => v.value);
    const backgroundColors = years.map((y) =>
      y >= fromYear && y <= toYear ? "rgba(154, 196, 163, 0.6)" : "rgba(154, 196, 163, 0.1)"
    );
    const borderColors = years.map((y) =>
      y >= fromYear && y <= toYear ? "#5a9262" : "#c8e4cc"
    );

    return {
      labels: years,
      datasets: [
        {
          label: `Value of ${new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
          }).format(amount)} from ${fromYear}`,
          data: dataPoints,
          backgroundColor: type === "bar" ? backgroundColors : "rgba(154, 196, 163, 0.15)",
          borderColor: type === "bar" ? borderColors : "#5a9262",
          borderWidth: 2,
          pointBackgroundColor: years.map((y) => (y === fromYear || y === toYear ? "#2d5a3d" : "#5a9262")),
          pointRadius: years.map((y) => (y === fromYear || y === toYear ? 5 : 3)),
          fill: type === "area",
          tension: 0.3,
        },
      ],
    };
  }, [values, years, amount, fromYear, toYear, type]);

  const options: ChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0,
              }).format(context.parsed.y ?? 0);
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 10,
            font: { size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: {
            callback: (value) => {
              return new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0,
                notation: "compact",
              }).format(Number(value));
            },
            font: { size: 11 },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    }),
    []
  );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        {(["line", "bar", "area"] as ChartType[]).map((t) => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              type === t
                ? "bg-sage-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-sage-200 shadow-sm p-4 md:p-6">
        <div className="h-72 md:h-80">
          {type === "bar" ? (
            <Bar data={chartData} options={options as ChartOptions<"bar">} />
          ) : (
            <Line data={chartData} options={options as ChartOptions<"line">} />
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          Highlighted range: {fromYear} – {toYear} · Full timeline: 2009 – 2026
        </p>
      </div>
    </div>
  );
}