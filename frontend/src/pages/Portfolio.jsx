import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useLanguage } from "../context/LanguageContext";
import HoldingRow from "../components/Portfolio/HoldingRow";
import { portfolioAPI } from "../services/api";
import "../components/Portfolio/Portfolio.css";

export default function PortfolioPage() {
  const { user, portfolio, refreshPortfolio } = useGame();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    refreshPortfolio();
    portfolioAPI.getTransactions(20).then((d) => setTransactions(d.transactions));
  }, [user]); // eslint-disable-line

  if (!portfolio) return <p style={{ color: "#94a3b8", padding: "2rem" }}>{t.loadingPortfolio}</p>;

  return (
    <div className="portfolio-page">
      <h2 style={{ color: "#f8fafc", margin: "0 0 1rem" }}>{t.myPortfolio}</h2>

      <div className="portfolio-summary">
        <div className="summary-card">
          <span className="summary-label">{t.cash}</span>
          <span className="summary-value">🪙 {portfolio.coins.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">{t.investments}</span>
          <span className="summary-value">🪙 {portfolio.portfolio_value.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">{t.totalValue}</span>
          <span className="summary-value">🪙 {portfolio.total_value.toFixed(2)}</span>
        </div>
      </div>

      <h3 className="section-title">{t.holdings}</h3>
      {portfolio.holdings.length === 0 ? (
        <p className="empty-state">{t.noHoldings}</p>
      ) : (
        <div className="holdings-list">
          {portfolio.holdings.map((h) => (
            <HoldingRow key={h.id} holding={h} />
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <>
          <h3 className="section-title">{t.recentTransactions}</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={tblStyle}>
              <thead>
                <tr>
                  {[t.txAsset, t.txType, t.txQty, t.txPrice, t.txTotal, t.txDate].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={tdStyle}>{tx.asset_symbol}</td>
                    <td style={{ ...tdStyle, color: tx.transaction_type === "buy" ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                      {tx.transaction_type.toUpperCase()}
                    </td>
                    <td style={tdStyle}>{tx.quantity}</td>
                    <td style={tdStyle}>🪙 {tx.price_per_unit.toFixed(4)}</td>
                    <td style={tdStyle}>🪙 {tx.total_cost.toFixed(4)}</td>
                    <td style={{ ...tdStyle, color: "#64748b" }}>
                      {new Date(tx.executed_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const tblStyle = {
  width: "100%", borderCollapse: "collapse", fontSize: "0.85rem",
};
const thStyle = {
  textAlign: "left", padding: "0.5rem 0.75rem", color: "#64748b",
  fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em",
  borderBottom: "1px solid #334155",
};
const tdStyle = {
  padding: "0.55rem 0.75rem", color: "#cbd5e1", borderBottom: "1px solid #1e293b",
};
