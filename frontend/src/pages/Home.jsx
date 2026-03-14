import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useLanguage } from "../context/LanguageContext";
import DailyReward from "../components/Dashboard/DailyReward";
import SessionBonusCard from "../components/Dashboard/SessionBonusCard";
import "../components/Dashboard/Dashboard.css";

export default function Home() {
  const { user, portfolio, events } = useGame();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#f8fafc" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{t.heroTitle}</h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: 500, margin: "0 auto 2rem" }}>
          {t.heroSubtitle}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/register" style={styles.btnPrimary}>{t.getStarted}</Link>
          <Link to="/login"    style={styles.btnSecondary}>{t.logIn}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <p className="dashboard-welcome">{t.welcomeBack(user.username)}</p>

      <DailyReward />
      <SessionBonusCard />

      {portfolio && (
        <div className="dashboard-grid" style={{ marginTop: "1rem" }}>
          <SummaryTile label={t.cash}        value={`🪙 ${portfolio.coins.toFixed(2)}`} />
          <SummaryTile label={t.investments} value={`🪙 ${portfolio.portfolio_value.toFixed(2)}`} />
          <SummaryTile label={t.totalValue}  value={`🪙 ${portfolio.total_value.toFixed(2)}`} />
          <SummaryTile label={t.positions}   value={portfolio.holdings.length} />
        </div>
      )}

      {events.length > 0 && (
        <>
          <h3 style={{ color: "#f8fafc", margin: "1.5rem 0 0.75rem" }}>{t.recentMarketNews}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {events.map((e) => (
              <div key={e.id} style={styles.eventRow}>
                <span style={e.event_type === "crash" ? styles.crash : styles.boom}>
                  {e.event_type === "crash" ? t.crash : t.boom}
                </span>
                <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>{e.description}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div style={{
      background: "#1e293b", border: "1px solid #334155", borderRadius: 10,
      padding: "1rem 1.25rem",
    }}>
      <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </span>
      <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fbbf24" }}>{value}</span>
    </div>
  );
}

const styles = {
  btnPrimary: {
    background: "#38bdf8", color: "#0f172a", padding: "0.75rem 2rem",
    borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "1rem",
  },
  btnSecondary: {
    background: "transparent", color: "#cbd5e1", padding: "0.75rem 2rem",
    borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "1rem",
    border: "1px solid #334155",
  },
  eventRow: {
    background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
    padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
  },
  crash: { color: "#f87171", fontWeight: 700, fontSize: "0.8rem", minWidth: 80 },
  boom:  { color: "#4ade80", fontWeight: 700, fontSize: "0.8rem", minWidth: 80 },
};
