import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  
  const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000, 
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Nome obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "Email obrigatório";
    }

    if (!formData.password) {
      newErrors.password = "Senha obrigatória";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      
      await api.post("/cadastro", {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
      });

      // Tela de login
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Erro ao registrar usuário");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <span className="hero-badge">DAFWEB</span>

        <h1>
          Crie sua conta e comece suas análises tributárias
        </h1>

        <p>
          Tenha acesso a comparativos completos entre PF e PJ, gráficos,
          relatórios e simulações inteligentes.
        </p>

        <div className="auth-benefits">
          <div>
            <strong>PF × PJ</strong>
            <span>Análise automatizada</span>
          </div>

          <div>
            <strong>Dashboard</strong>
            <span>Métricas financeiras</span>
          </div>

          <div>
            <strong>PDF</strong>
            <span>Exportação profissional</span>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-header">
          <h2>Criar conta</h2>
          <p>Cadastre-se para acessar a plataforma.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group-modern">
            <label>Nome completo</label>

            <input
              type="text"
              placeholder="Seu nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />

            {errors.name && (
              <small className="error-text">{errors.name}</small>
            )}
          </div>

          <div className="input-group-modern">
            <label>Email</label>

            <input
              type="email"
              placeholder="voce@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />

            {errors.email && (
              <small className="error-text">{errors.email}</small>
            )}
          </div>

          <div className="input-group-modern">
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />

            {errors.password && (
              <small className="error-text">{errors.password}</small>
            )}
          </div>

          <div className="input-group-modern">
            <label>Confirmar senha</label>

            <input
              type="password"
              placeholder="Repita sua senha"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />

            {errors.confirmPassword && (
              <small className="error-text">
                {errors.confirmPassword}
              </small>
            )}
          </div>

          <button className="compare-button" type="submit">
            Criar conta
          </button>
        </form>

        <p className="auth-footer">
          Já possui conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}