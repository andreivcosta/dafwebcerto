import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  DoughnutController,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  DoughnutController,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

function money(value) {
  return `R$ ${Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function GraficoComparativo({ PF, PJ }) {
  const economiaMensal = Math.max(
    0,
    (PF.imposto || 0) - (PJ.totalImpostos || 0)
  );

  const barData = {
    labels: ["INSS", "IR", "CPP", "Simples", "Total", "Líquido"],
    datasets: [
      {
        label: "PF",
        data: [PF.inss || 0, PF.ir || 0, 0, 0, PF.imposto || 0, PF.liquido || 0],
        backgroundColor: "#6d5dfc",
        borderRadius: 10,
      },
      {
        label: "PJ",
        data: [
          PJ.inss || 0,
          PJ.ir || 0,
          PJ.cpp || 0,
          PJ.impostoMensal || 0,
          PJ.totalImpostos || 0,
          PJ.liquido || 0,
        ],
        backgroundColor: "#20c997",
        borderRadius: 10,
      },
    ],
  };

  const doughnutData = {
    labels: ["Impostos PJ", "Líquido PJ"],
    datasets: [
      {
        data: [PJ.totalImpostos || 0, PJ.liquido || 0],
        backgroundColor: ["#ff6b6b", "#20c997"],
        borderWidth: 0,
      },
    ],
  };

  const annualData = {
    labels: ["PF", "PJ"],
    datasets: [
      {
        label: "Impostos anuais",
        data: [(PF.imposto || 0) * 12, (PJ.totalImpostos || 0) * 12],
        backgroundColor: ["#6d5dfc", "#20c997"],
        borderRadius: 12,
      },
    ],
  };

  const economyLineData = {
    labels: ["1 mês", "3 meses", "6 meses", "9 meses", "12 meses"],
    datasets: [
      {
        label: "Economia acumulada",
        data: [
          economiaMensal,
          economiaMensal * 3,
          economiaMensal * 6,
          economiaMensal * 9,
          economiaMensal * 12,
        ],
        borderColor: "#20c997",
        backgroundColor: "rgba(32, 201, 151, 0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label || context.label}: ${money(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => money(value),
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${money(context.raw)}`,
        },
      },
    },
  };

  return (
    <div className="charts-grid advanced">
      <div className="chart-card">
        <h5>Comparativo geral</h5>
        <p>Diferença entre tributos, renda líquida e composição de custos.</p>
        <Bar data={barData} options={options} />
      </div>

      <div className="chart-card">
        <h5>Distribuição PJ</h5>
        <p>Quanto fica líquido e quanto vai para tributos.</p>
        <div
          style={{
            width: "220px",
            height: "220px",
            margin: "0 auto",
          }}
        >
          <Doughnut
            data={doughnutData}
            options={{
              ...doughnutOptions,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      <div className="chart-card">
        <h5>Impostos anuais</h5>
        <p>Projeção de impostos pagos em 12 meses.</p>
        <Bar data={annualData} options={options} />
      </div>

      <div className="chart-card">
        <h5>Economia acumulada</h5>
        <p>Projeção da economia ao longo do ano.</p>
        <Line data={economyLineData} options={options} />
      </div>
    </div>
  );
}