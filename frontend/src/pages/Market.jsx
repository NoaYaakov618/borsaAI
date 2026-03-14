import { useGame } from "../context/GameContext";
import { useLanguage } from "../context/LanguageContext";
import AssetCard from "../components/Market/AssetCard";
import "../components/Market/Market.css";

export default function MarketPage() {
  const { assets, events, loading } = useGame();
  const { t } = useLanguage();

  if (loading) return <p style={{ color: "#94a3b8", padding: "2rem" }}>{t.loadingMarket}</p>;

  return (
    <div>
      {events.length > 0 && (
        <div className="events-banner">
          {events.slice(0, 5).map((e) => (
            <div key={e.id} className={`event-item event-${e.event_type}`}>
              {e.event_type === "crash" ? "📉" : "📈"} {e.description}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "1rem 1.5rem 0" }}>
        <h2 style={{ color: "#f8fafc", margin: 0 }}>{t.liveMarket}</h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          {t.marketSubtitle}
        </p>
      </div>

      <div className="market-grid">
        {assets.map((asset) => (
          <AssetCard key={asset.symbol} asset={asset} />
        ))}
      </div>
    </div>
  );
}
