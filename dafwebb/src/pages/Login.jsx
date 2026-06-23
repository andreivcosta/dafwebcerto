import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 

export default function Login() {
  // CONFIGURAÇÃO DA API: Apontando o back-end 
  const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
  });

  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Faz a chamada real para a rota /login do seu server.js
      const resposta = await api.post("/login", {
        email: formData.email,
        senha: formData.password, // Mapeado para 'senha' (como o Node espera)
      });

      // Se o login der certo, salvamos o token de segurança no navegador
      localStorage.setItem("token", resposta.data.token);

      // Só agora, com tudo validado, ele permite entrar na Home
      navigate("/home");
    } catch (error) {
      console.log(error);
      
      // Se o Node responder com erro de e-mail/senha inválidos, ele cai aqui
      if (error.response && error.response.data && error.response.data.erro) {
        alert(error.response.data.erro);
      } else {
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <span className="hero-badge">DAFWEB</span>

        <h1>
          Análise tributária inteligente para profissionais
        </h1>

        <p>
          Compare PF e PJ, visualize impostos, gere relatórios e tome decisões
          com mais clareza.
        </p>

        <div className="auth-benefits">
          <div>
            <strong>PF × PJ</strong>
            <span>Comparação automática</span>
          </div>

          <div>
            <strong>PDF</strong>
            <span>Relatório exportável</span>
          </div>

          <div>
            <strong>Dashboard</strong>
            <span>Gráficos e métricas</span>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-header">
          <h2>Entrar na plataforma</h2>
          <p>Acesse sua simulação tributária.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group-modern">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="voce@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern">
            <label>Senha</label>

            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="compare-button" type="submit">
            Entrar
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/register">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}