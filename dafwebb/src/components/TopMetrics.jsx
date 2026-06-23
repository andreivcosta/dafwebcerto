import React from "react";

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function TopMetrics({ result }) {
  if (!result) return null;

  const { PF, PJ, input } = result;

  const economiaMensal = Math.max(
    0,
    PF.imposto - PJ.totalImpostos
  );

  const economiaAnual = economiaMensal * 12;

  const receitaAnual =
    Number(input.rendaMensal || 0) * 12;

  const cargaPF =
    (PF.imposto / Number(input.rendaMensal || 1)) * 100;

  const cargaPJ =
    (PJ.totalImpostos /
      Number(input.rendaMensal || 1)) *
    100;

  const melhor =
    PJ.liquido > PF.liquido ? "PJ" : "PF";

  return (
    <div className="top-metrics">
      <div className="top-metric-card">
        <span>Receita anual</span>
        <strong>{money(receitaAnual)}</strong>
      </div>

      <div className="top-metric-card success">
        <span>Economia anual</span>
        <strong>{money(economiaAnual)}</strong>
      </div>

      <div className="top-metric-card">
        <span>Carga PF vs PJ</span>

        <strong>
          {cargaPF.toFixed(1)}% →{" "}
          {cargaPJ.toFixed(1)}%
        </strong>
      </div>

      <div className="top-metric-card highlight">
        <span>Melhor regime</span>
        <strong>{melhor}</strong>
      </div>
    </div>
  );
}