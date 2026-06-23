import React, { useState } from "react";

const respostas = [
    {
        keywords: ["oi", "olá", "ola", "eai", "eaí"],
        answer:
            "Olá! 👋 Posso te ajudar com dúvidas sobre PF, PJ, Simples Nacional, INSS, CPP e cálculos tributários.",
    },

    {
        keywords: ["ok", "otimo", "ótimo", "perfeito", "entendi"],
        answer:
            "Perfeito! Se quiser, também posso explicar termos tributários e os resultados da simulação.",
    },

    {
        keywords: ["obrigado", "valeu", "agradecido"],
        answer:
            "Por nada! 😊 Estou aqui para ajudar no que precisar.",
    },
    {
        keywords: ["pf", "pessoa física"],
        answer:
            "Pessoa Física é quando o profissional recebe no CPF. Normalmente há incidência de INSS e Imposto de Renda conforme a renda mensal.",
    },
    {
        keywords: ["pj", "pessoa jurídica"],
        answer:
            "Pessoa Jurídica é quando o profissional atua por meio de um CNPJ. No sistema, o cálculo considera Simples Nacional, INSS sobre pró-labore, CPP quando aplicável e IR sobre pró-labore.",
    },
    {
        keywords: ["advogado", "anexo iv"],
        answer:
            "Para advogado, o sistema utiliza o Anexo IV do Simples Nacional. Nesse caso, também é considerado CPP sobre o pró-labore.",
    },
    {
        keywords: ["psicólogo", "psicologo", "anexo iii"],
        answer:
            "Para psicólogo e outras profissões de serviço, o sistema utiliza o Anexo III do Simples Nacional.",
    },
    {
        keywords: ["inss"],
        answer:
            "O INSS no PJ é calculado sobre o pró-labore. Já no PF, o sistema considera o INSS diretamente sobre a renda informada.",
    },
    {
        keywords: ["cpp"],
        answer:
            "CPP significa Contribuição Previdenciária Patronal. No sistema, ela é aplicada para profissões enquadradas no Anexo IV, como advogado.",
    },
    {
        keywords: ["simples", "simples nacional"],
        answer:
            "O Simples Nacional é um regime tributário para empresas. O sistema aplica a tabela conforme a profissão: Anexo IV para advogado e Anexo III para outras profissões.",
    },
    {
        keywords: ["pdf", "relatório", "relatorio"],
        answer:
            "O botão Baixar PDF gera um relatório tributário com os principais dados da simulação, incluindo profissão, renda, custos, melhor regime e economia estimada.",
    },
];

function getBotAnswer(message) {
    const text = message.toLowerCase();

    const found = respostas.find((item) =>
        item.keywords.some((keyword) => text.includes(keyword))
    );

    if (found) return found.answer;

    return "Posso te ajudar com dúvidas sobre PF, PJ, Simples Nacional, INSS, CPP, Anexo III, Anexo IV e relatório em PDF.";
}

export default function TaxAssistant() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        {
            type: "bot",
            text: "Olá! Sou a assistente tributária do DAFWEB. Posso explicar PF, PJ, INSS, CPP, Simples Nacional e os resultados da simulação.",
        },
    ]);

    function sendMessage(e) {
        e.preventDefault();

        if (!message.trim()) return;

        const userMessage = {
            type: "user",
            text: message,
        };

        const botMessage = {
            type: "bot",
            text: getBotAnswer(message),
        };

        setChat((prev) => [...prev, userMessage, botMessage]);
        setMessage("");
    }

    return (
        <>
            <button className="assistant-float" onClick={() => setOpen(!open)}>
                {open ? "×" : "💬"}
            </button>

            {open && (
                <div className="assistant-box">
                    <div className="assistant-header">
                        <div>
                            <strong>Assistente DAFWEB</strong>
                            <span>Online agora</span>
                        </div>
                    </div>

                    <div className="assistant-messages">
                        {chat.map((item, index) => (
                            <div
                                key={index}
                                className={`assistant-message ${item.type}`}
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>

                    <div className="assistant-suggestions">
                        <button onClick={() => setMessage("O que é CPP?")}>
                            O que é CPP?
                        </button>
                        <button onClick={() => setMessage("Advogado usa qual anexo?")}>
                            Advogado
                        </button>
                        <button onClick={() => setMessage("O que é PJ?")}>
                            PJ
                        </button>
                    </div>

                    <form className="assistant-form" onSubmit={sendMessage}>
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua dúvida..."
                        />

                        <button type="submit">Enviar</button>
                    </form>
                </div>
            )}
        </>
    );
}