import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
    return (
        <main className="landing-page">
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>
            <nav className="landing-nav">
                <div className="landing-logo">
                    <div className="brand-icon">D</div>
                    <strong>DAFWEB</strong>
                </div>

                <div className="landing-actions">
                    <Link to="/login">Entrar</Link>

                    <Link to="/register" className="landing-button">
                        Criar conta
                    </Link>
                </div>
            </nav>

            <section className="landing-hero">
                <motion.div
                    className="landing-content"
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                >
                    <span className="hero-pill">Plataforma Tributária Inteligente</span>

                    <h1>
                        Compare PF e PJ com uma análise tributária visual, rápida e
                        profissional.
                    </h1>

                    <p>
                        Simule impostos, renda líquida, economia anual, pró-labore, INSS,
                        CPP e gere relatórios PDF com uma experiência moderna.
                    </p>

                    <div className="landing-cta">
                        <Link to="/login" className="primary-cta">
                            Iniciar simulação
                        </Link>

                        <a href="#features" className="secondary-cta">
                            Ver recursos
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    className="landing-preview"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.65, delay: 0.15 }}
                >
                    <div className="preview-glow"></div>

                    <div className="preview-top">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className="preview-header">
                        <div>
                            <small>Economia anual</small>
                            <strong>R$ 32.400</strong>
                        </div>

                        <div className="preview-badge">+18.2%</div>
                    </div>

                    <div className="preview-analytics">
                        <div className="analytics-card purple">
                            <small>PF</small>
                            <strong>R$ 4.412</strong>
                            <span>Carga tributária</span>
                        </div>

                        <div className="analytics-card green">
                            <small>PJ</small>
                            <strong>R$ 1.977</strong>
                            <span>Modelo otimizado</span>
                        </div>
                    </div>

                    <div className="preview-chart advanced-chart">
                        <div className="chart-line"></div>

                        <span style={{ height: "42%" }}></span>
                        <span style={{ height: "68%" }}></span>
                        <span style={{ height: "38%" }}></span>
                        <span style={{ height: "90%" }}></span>
                        <span style={{ height: "58%" }}></span>
                        <span style={{ height: "76%" }}></span>
                    </div>

                    <div className="preview-footer-stats">
                        <div>
                            <small>Economia mensal</small>
                            <strong>R$ 2.435</strong>
                        </div>

                        <div>
                            <small>Melhor regime</small>
                            <strong>PJ</strong>
                        </div>

                        <div>
                            <small>Eficiência</small>
                            <strong>+18%</strong>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="how-section">
                <div className="section-title-block">
                    <span>Fluxo inteligente</span>

                    <h2>Como funciona a análise tributária</h2>

                    <p>
                        Um fluxo rápido e visual para comparar diferentes estruturas
                        tributárias.
                    </p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">01</div>

                        <span>Renda</span>

                        <h3>Informe seus dados</h3>

                        <p>
                            Digite profissão, renda mensal e custos operacionais.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">02</div>

                        <span>Simulação</span>

                        <h3>Compare PF e PJ</h3>

                        <p>
                            O sistema calcula impostos, INSS, CPP e renda líquida.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">03</div>

                        <span>Insights</span>

                        <h3>Analise os resultados</h3>

                        <p>
                            Visualize gráficos, métricas anuais e eficiência tributária.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">04</div>

                        <span>Relatório</span>

                        <h3>Exporte em PDF</h3>

                        <p>
                            Gere um relatório profissional com todos os dados da análise.
                        </p>
                    </div>
                </div>
            </section>

            <section id="features" className="landing-features">
                <div className="feature-card">
                    <span>📊</span>

                    <h3>Dashboard visual</h3>

                    <p>
                        Resultados organizados em gráficos, métricas anuais e análises
                        inteligentes.
                    </p>
                </div>

                <div className="feature-card">
                    <span>📄</span>

                    <h3>Relatório em PDF</h3>

                    <p>
                        Gere relatórios profissionais automaticamente com poucos cliques.
                    </p>
                </div>

                <div className="feature-card">
                    <span>🤖</span>

                    <h3>Assistente tributária</h3>

                    <p>
                        Chat inteligente para auxiliar em dúvidas sobre PF, PJ, INSS e CPP.
                    </p>
                </div>
            </section>
        </main>
    );
}