import TopMetrics from "../components/TopMetrics";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import TaxAssistant from "../components/TaxAssistant";

import CalculatorForm from "../components/CalculatorForm";
import CompareResult from "../components/CompareResult";

import { compareTaxes } from "../util/tax";

import FAQ from "../components/FAQ";

export default function Home() {
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleLogout = () => navigate("/login");

  function handleCompare(data) {
    const comparison = compareTaxes({
      rendaMensal: Number(data.rendaMensal),
      custosMensais: Number(data.custosMensais),
      profissao: data.profissao,
    });

    setResult({
      ...comparison,

      input: {
        rendaMensal: data.rendaMensal,
        custosMensais: data.custosMensais,
        profissao: data.profissao,
        sendEmail: data.sendEmail,
        emailUser: data.emailUser,
        emailNAF: data.emailNAF,
      },
    });
  }

  function handleBack() {
    setResult(null);
  }

  return (
    <main className="app-shell">
      <Sidebar />

      <div className="main-content">
        <motion.header
          className="app-navbar"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="brand-area">
            <motion.div
              className="brand-icon"
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
            >
              D
            </motion.div>

            <div>
              <strong>DAFWEB</strong>
              <span>Calculadora Tributária</span>
            </div>
          </div>

          <nav className="nav-actions">
            <motion.button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? "☀️ Claro" : "🌙 Escuro"}
            </motion.button>

            <motion.a
              href="#faq"
              whileHover={{ scale: 1.05 }}
            >
              FAQ
            </motion.a>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sair
            </motion.button>
          </nav>
        </motion.header>

        <section className="app-content">
          <TopMetrics result={result} />
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
              >
                <CalculatorForm
                  onCompare={handleCompare}
                />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
              >
                <CompareResult
                  result={result}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <motion.section
          id="faq"
          className="faq-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <FAQ />
        </motion.section>

        <TaxAssistant />
      </div>
    </main>
  );
}