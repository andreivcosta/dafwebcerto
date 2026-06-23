import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-icon">D</div>

          <div>
            <strong>DAFWEB</strong>
            <span>Tax Dashboard</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="active">
          <span>📊</span>
          Dashboard
        </button>

        <button>
          <span>📈</span>
          Simulações
        </button>

        <button>
          <span>📄</span>
          Relatórios
        </button>

        <button>
          <span>🤖</span>
          Assistente IA
        </button>

        <button>
          <span>⚙️</span>
          Configurações
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>
        Sistema online
      </div>
    </aside>
  );
}