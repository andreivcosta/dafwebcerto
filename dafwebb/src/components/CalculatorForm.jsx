import React, { useState } from "react";
import InfoModal from "./InfoModal";

export default function CalculatorForm({ onCompare }) {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [profissao, setProfissao] = useState("Psicólogo(a)");
  const [sendEmail, setSendEmail] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [emailNAF, setEmailNAF] = useState("");
  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  function validate() {
    const e = {};
    const rendaNum = Number(renda);
    const custosNum = Number(custos);

    if (!renda) e.renda = "Informe a renda.";
    else if (rendaNum <= 0) e.renda = "Valor inválido.";

    if (custos === "" || Number.isNaN(custosNum))
      e.custos = "Informe os custos.";

    if (!profissao) e.profissao = "Profissão obrigatória.";

    if (sendEmail) {
      if (!emailUser) e.emailUser = "Informe um e-mail.";
      else if (!/^\S+@\S+\.\S+$/.test(emailUser))
        e.emailUser = "E-mail inválido.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    onCompare({
      rendaMensal: Number(renda),
      custosMensais: Number(custos),
      profissao,
      sendEmail,
      emailUser,
      emailNAF,
    });
  }

  return (
    <div className="calculator-wrapper">
      <div className="calculator-hero">
        <span className="hero-badge">
          Plataforma Tributária Inteligente
        </span>

        <h1>
          Compare sua carga tributária de forma
          <span> inteligente</span>
        </h1>

        <p>
          Compare impostos, renda líquida e economia tributária em segundos com
          uma simulação profissional.
        </p>
      </div>

      <form className="calculator-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group-modern">
            <label>Renda Mensal</label>

            <input
              type="number"
              placeholder="Ex: 15000"
              value={renda}
              onChange={(e) => setRenda(e.target.value)}
              className={errors.renda ? "error" : ""}
            />

            {errors.renda && (
              <small className="error-text">{errors.renda}</small>
            )}
          </div>

          <div className="input-group-modern">
            <label>Custos Mensais</label>

            <input
              type="number"
              placeholder="Ex: 1200"
              value={custos}
              onChange={(e) => setCustos(e.target.value)}
              className={errors.custos ? "error" : ""}
            />

            {errors.custos && (
              <small className="error-text">{errors.custos}</small>
            )}
          </div>
        </div>

        <div className="input-group-modern">
          <label>Profissão</label>

          <select
            value={profissao}
            onChange={(e) => setProfissao(e.target.value)}
          >
            <option value="Psicólogo(a)">Psicólogo(a)</option>
            <option value="Advogado(a)">Advogado(a)</option>
            <option value="Arquiteto(a)">Arquiteto(a)</option>
          </select>
        </div>

        <div className="switch-card">
          <div>
            <strong>Receber resultado por e-mail</strong>
            <p>Receba o relatório completo da simulação.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {sendEmail && (
          <div className="form-grid">
            <div className="input-group-modern">
              <label>Seu e-mail</label>

              <input
                type="email"
                placeholder="voce@email.com"
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
                className={errors.emailUser ? "error" : ""}
              />

              {errors.emailUser && (
                <small className="error-text">{errors.emailUser}</small>
              )}
            </div>

            <div className="input-group-modern">
              <label>E-mail do NAF</label>

              <input
                type="email"
                placeholder="naf@email.com"
                value={emailNAF}
                onChange={(e) => setEmailNAF(e.target.value)}
              />
            </div>
          </div>
        )}

        <button className="compare-button" type="submit">
          Gerar análise tributária
        </button>

        <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />
      </form>
    </div>
  );
}