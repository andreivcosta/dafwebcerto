import React, { useState } from "react";
import GraficoComparativo from "./GraficoComparativo";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CompareResult({ result, onSendEmailNAF, onBack }) {
  const [sending, setSending] = useState(false);

  if (!result) return null;

  const { PF, PJ, input } = result;

  const economiaMensal = Math.max(0, PF.imposto - PJ.totalImpostos);
  const economiaAnual = economiaMensal * 12;
  const melhorOpcao = PJ.liquido > PF.liquido ? "PJ" : "PF";

  const pfAnual = {
    impostos: PF.imposto * 12,
    liquido: PF.liquido * 12,
  };

  const pjAnual = {
    impostos: PJ.totalImpostos * 12,
    liquido: PJ.liquido * 12,
  };

  const cargaPF = (PF.imposto / Number(input.rendaMensal || 1)) * 100;
  const cargaPJ = (PJ.totalImpostos / Number(input.rendaMensal || 1)) * 100;
  const reducaoCarga = Math.max(0, cargaPF - cargaPJ);

  async function handleSendToNAF() {
    setSending(true);

    try {
      const res = await fetch("http://localhost:5000/email/send-calculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailUser: input.emailUser,
          emailNAF: input.emailNAF,
          profissao: input.profissao,
          rendaMensal: input.rendaMensal,
          custosMensais: input.custosMensais,
          PF,
          PJ,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Resultado enviado com sucesso!");
        onSendEmailNAF && onSendEmailNAF({ success: true });
      } else {
        toast.error(data.error || "Erro ao enviar email");
        onSendEmailNAF && onSendEmailNAF({ success: false });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar email");
      onSendEmailNAF && onSendEmailNAF({ success: false });
    }

    setSending(false);
  }

  function gerarPDF() {
    const pdf = new jsPDF("p", "mm", "a4");
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    pdf.setFillColor(248, 249, 255);
    pdf.rect(0, 0, 210, 297, "F");

    pdf.setFillColor(33, 25, 81);
    pdf.roundedRect(10, 10, 190, 32, 6, 6, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("DAFWEB", 18, 25);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Relatório de Comparativo Tributário", 18, 33);

    pdf.setFontSize(9);
    pdf.text(`Emitido em: ${dataAtual}`, 155, 25);

    pdf.setTextColor(16, 24, 40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Resumo da Simulação", 14, 58);

    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(14, 66, 182, 34, 5, 5, "F");

    pdf.setFontSize(10);
    pdf.setTextColor(102, 112, 133);
    pdf.text("Profissão", 22, 78);
    pdf.text("Renda mensal", 82, 78);
    pdf.text("Custos mensais", 142, 78);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(16, 24, 40);
    pdf.text(input.profissao || "-", 22, 89);
    pdf.text(money(input.rendaMensal), 82, 89);
    pdf.text(money(input.custosMensais), 142, 89);

    pdf.setFillColor(245, 247, 255);
    pdf.roundedRect(14, 112, 86, 52, 6, 6, "F");

    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(110, 112, 86, 52, 6, 6, "F");

    pdf.setTextColor(109, 93, 252);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Pessoa Física", 22, 126);

    pdf.setTextColor(8, 127, 91);
    pdf.text("Pessoa Jurídica", 118, 126);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(102, 112, 133);

    pdf.text("Total de impostos", 22, 139);
    pdf.text("Renda líquida", 22, 152);

    pdf.text("Total de impostos", 118, 139);
    pdf.text("Renda líquida", 118, 152);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(16, 24, 40);

    pdf.text(money(PF.imposto), 62, 139);
    pdf.text(money(PF.liquido), 62, 152);

    pdf.text(money(PJ.totalImpostos), 158, 139);
    pdf.text(money(PJ.liquido), 158, 152);

    pdf.setFillColor(255, 247, 237);
    pdf.roundedRect(14, 178, 182, 38, 6, 6, "F");

    pdf.setTextColor(154, 52, 18);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("Economia estimada", 22, 193);

    pdf.setFontSize(11);
    pdf.setTextColor(16, 24, 40);
    pdf.text(`Mensal: ${money(economiaMensal)}`, 22, 205);
    pdf.text(`Anual: ${money(economiaAnual)}`, 92, 205);
    pdf.text(`Melhor opção: ${melhorOpcao}`, 152, 205);

    pdf.setTextColor(16, 24, 40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("Detalhamento PJ", 14, 235);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const detalhes = [
      ["Simples Nacional", money(PJ.impostoMensal)],
      ["INSS pró-labore", money(PJ.inss)],
      ["CPP", money(PJ.cpp)],
      ["IR pró-labore", PJ.isentoIR ? "Isento" : money(PJ.ir)],
      ["Total de impostos PJ", money(PJ.totalImpostos)],
    ];

    let y = 246;

    detalhes.forEach(([label, value]) => {
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(14, y - 6, 182, 9, 2, 2, "F");

      pdf.setTextColor(102, 112, 133);
      pdf.text(label, 20, y);

      pdf.setTextColor(16, 24, 40);
      pdf.setFont("helvetica", "bold");
      pdf.text(value, 160, y);

      pdf.setFont("helvetica", "normal");
      y += 11;
    });

    pdf.save("relatorio-tributario.pdf");
    toast.success("PDF gerado com sucesso!");
  }

  return (
    <div id="area-pdf" className="result-page">
      <div className="result-hero premium-hero">
        <div className="hero-content">
          <span className="hero-pill">Análise tributária concluída</span>

          <h2>
            Economia estimada de <span>{money(economiaAnual)}</span> ao ano
          </h2>

          <p>
            Para a profissão <strong>{input.profissao}</strong>, o regime{" "}
            <strong>{melhorOpcao}</strong> apresentou melhor eficiência
            tributária neste cenário.
          </p>

          <div className="hero-mini-metrics">
            <div>
              <small>Economia mensal</small>
              <strong>{money(economiaMensal)}</strong>
            </div>

            <div>
              <small>Melhor regime</small>
              <strong>{melhorOpcao}</strong>
            </div>

            <div>
              <small>Carga reduzida</small>
              <strong>{reducaoCarga.toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        <div className="hero-orb">
          <span>+{reducaoCarga.toFixed(1)}%</span>
          <small>eficiência</small>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Impostos PF</span>
          <strong>{money(PF.imposto)}</strong>
          <small>INSS + IR</small>
        </div>

        <div className="kpi-card success">
          <span>Impostos PJ</span>
          <strong>{money(PJ.totalImpostos)}</strong>
          <small>Simples + INSS + CPP + IR</small>
        </div>

        <div className="kpi-card">
          <span>Economia mensal</span>
          <strong>{money(economiaMensal)}</strong>
          <small>Diferença entre PF e PJ</small>
        </div>

        <div className="kpi-card highlight">
          <span>Economia anual estimada</span>
          <strong>{money(economiaAnual)}</strong>
          <small>Projeção em 12 meses</small>
        </div>

        <div className="kpi-card">
          <span>Carga tributária PF</span>
          <strong>{cargaPF.toFixed(2)}%</strong>
          <small>Percentual sobre a renda</small>
        </div>

        <div className="kpi-card success">
          <span>Carga tributária PJ</span>
          <strong>{cargaPJ.toFixed(2)}%</strong>
          <small>Percentual sobre a renda</small>
        </div>

        <div className="kpi-card highlight">
          <span>Redução tributária</span>
          <strong>{reducaoCarga.toFixed(2)}%</strong>
          <small>Diferença entre PF e PJ</small>
        </div>

        <div className="kpi-card">
          <span>Líquido anual PF</span>
          <strong>{money(pfAnual.liquido)}</strong>
          <small>Projeção em 12 meses</small>
        </div>

        <div className="kpi-card success">
          <span>Líquido anual PJ</span>
          <strong>{money(pjAnual.liquido)}</strong>
          <small>Projeção em 12 meses</small>
        </div>
      </div>

      <div className="dashboard-insights">
        <div className="insight-main">
          <span className="eyebrow dark">Análise inteligente</span>

          <h3>
            {melhorOpcao === "PJ"
              ? "Atuar como PJ apresenta melhor resultado neste cenário"
              : "Atuar como PF apresenta melhor resultado neste cenário"}
          </h3>

          <p>
            Com base nos valores informados, o regime {melhorOpcao} gera uma
            economia mensal estimada de <strong>{money(economiaMensal)}</strong>,
            equivalente a <strong>{money(economiaAnual)}</strong> ao ano.
          </p>
        </div>

        <div className="insight-stats">
          <div>
            <span>Impostos anuais PF</span>
            <strong>{money(pfAnual.impostos)}</strong>
          </div>

          <div>
            <span>Impostos anuais PJ</span>
            <strong>{money(pjAnual.impostos)}</strong>
          </div>

          <div>
            <span>Diferença anual</span>
            <strong>{money(economiaAnual)}</strong>
          </div>
        </div>
      </div>

      <div className="tax-breakdown">
        <div className="breakdown-card">
          <span>INSS PJ</span>
          <strong>{money(PJ.inss)}</strong>
        </div>

        <div className="breakdown-card">
          <span>CPP</span>
          <strong>{money(PJ.cpp)}</strong>
        </div>

        <div className="breakdown-card">
          <span>Simples Nacional</span>
          <strong>{money(PJ.impostoMensal)}</strong>
        </div>

        <div className="breakdown-card">
          <span>IR Pró-labore</span>
          <strong>{PJ.isentoIR ? "Isento" : money(PJ.ir)}</strong>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="summary-card">
          <div className="summary-header pf">
            <span>Pessoa Física</span>
            <strong>{money(PF.liquido)}</strong>
          </div>

          <div className="summary-line">
            <span>INSS</span>
            <strong>{money(PF.inss)}</strong>
          </div>

          <div className="summary-line">
            <span>Imposto de Renda</span>
            <strong>{PF.isentoIR ? "Isento" : money(PF.ir)}</strong>
          </div>

          <div className="summary-line total">
            <span>Total de impostos</span>
            <strong>{money(PF.imposto)}</strong>
          </div>
        </div>

        <div className="summary-card recommended">
          <div className="summary-header pj">
            <span>Pessoa Jurídica</span>
            <strong>{money(PJ.liquido)}</strong>
          </div>

          <div className="summary-line">
            <span>Simples Nacional</span>
            <strong>{money(PJ.impostoMensal)}</strong>
          </div>

          <div className="summary-line">
            <span>INSS pró-labore</span>
            <strong>{money(PJ.inss)}</strong>
          </div>

          <div className="summary-line">
            <span>CPP</span>
            <strong>{money(PJ.cpp)}</strong>
          </div>

          <div className="summary-line">
            <span>IR pró-labore</span>
            <strong>{PJ.isentoIR ? "Isento" : money(PJ.ir)}</strong>
          </div>

          <div className="summary-line total">
            <span>Total de impostos</span>
            <strong>{money(PJ.totalImpostos)}</strong>
          </div>
        </div>
      </div>

      <GraficoComparativo PF={PF} PJ={PJ} />

      <div className="conclusion-box">
        <h5>Conclusão</h5>
        <p>
          Nesta simulação, o regime <strong>{melhorOpcao}</strong> apresenta o
          melhor resultado financeiro, com renda líquida maior e menor peso
          tributário no cenário informado.
        </p>
      </div>

      <div className="actions-row no-pdf">
        <button className="btn btn-secondary rounded-pill px-4" onClick={onBack}>
          Voltar
        </button>

        <button className="btn btn-success rounded-pill px-4" onClick={gerarPDF}>
          Baixar PDF
        </button>

        <button
          className="btn rounded-pill px-4"
          style={{
            backgroundColor: "#6a5acd",
            color: "white",
          }}
          onClick={handleSendToNAF}
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar ao NAF"}
        </button>
      </div>
    </div>
  );
}