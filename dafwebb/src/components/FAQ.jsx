import React, { useState } from "react";

const perguntas = [
  {
    pergunta: "Como funciona a simulação tributária?",
    resposta:
      "O sistema compara automaticamente os cenários PF e PJ com base na renda, custos e profissão informada.",
  },
  {
    pergunta: "Os cálculos são oficiais?",
    resposta:
      "Não. A plataforma possui finalidade acadêmica e utiliza estimativas comparativas para análise tributária.",
  },
  {
    pergunta: "Quais profissões são suportadas?",
    resposta:
      "Atualmente o sistema suporta advogado, psicólogo e arquiteto, com regras específicas para cada categoria.",
  },
  {
    pergunta: "Posso exportar o resultado?",
    resposta:
      "Sim. Após a simulação, é possível gerar um relatório em PDF com os dados do comparativo.",
  },
];

export default function FAQ() {
  const [ativo, setAtivo] = useState(null);

  function toggle(index) {
    setAtivo(ativo === index ? null : index);
  }

  return (
    <section className="faq-section">
      <div className="faq-header">
        <span className="hero-badge">FAQ</span>

        <h2>Perguntas frequentes</h2>

        <p>
          Tire dúvidas sobre funcionamento, cálculos e recursos da plataforma.
        </p>
      </div>

      <div className="faq-container">
        {perguntas.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${ativo === index ? "active" : ""}`}
          >
            <button
              className="faq-question"
              onClick={() => toggle(index)}
            >
              <span>{item.pergunta}</span>

              <span className="faq-icon">
                {ativo === index ? "−" : "+"}
              </span>
            </button>

            {ativo === index && (
              <div className="faq-answer">
                <p>{item.resposta}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}