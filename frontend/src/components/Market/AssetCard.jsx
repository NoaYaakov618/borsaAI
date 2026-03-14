import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import AssetInfoModal from "./AssetInfoModal";
import "./Market.css";

export default function AssetCard({ asset }) {
  const { buyAsset, user } = useGame();
  const { t } = useLanguage();
  const [qty, setQty] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const positive = asset.daily_change_pct >= 0;

  const TYPE_LABEL = {
    stock: t.typeStock,
    index: t.typeIndex,
    money_market: t.typeMoney,
  };

  const handleBuy = async () => {
    const quantity = parseFloat(qty);
    if (!quantity || quantity <= 0) return;
    setBusy(true);
    setFeedback(null);
    try {
      await buyAsset(asset.symbol, quantity);
      setFeedback({ type: "success", msg: t.bought(quantity, asset.symbol) });
      setQty("");
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="asset-card">
        <div className="asset-card-header">
          <div className="asset-card-header-left">
            <span className="asset-symbol">{asset.symbol}</span>
            <span className="asset-type-badge">{TYPE_LABEL[asset.asset_type] || asset.asset_type}</span>
            <button
              className="info-btn"
              onClick={() => setShowInfo(true)}
              aria-label={`Info about ${asset.symbol}`}
            >
              ⓘ
            </button>
          </div>
          <div className={`asset-change ${positive ? "positive" : "negative"}`}>
            {positive ? "▲" : "▼"} {Math.abs(asset.daily_change_pct).toFixed(2)}%
          </div>
        </div>

        <p className="asset-name">{asset.name}</p>
        <p className="asset-description">{asset.description}</p>

        <div className="asset-price-row">
          <span className="asset-price">🪙 {asset.current_price.toFixed(4)}</span>
          <span className="asset-prev">{t.prev} {asset.previous_price.toFixed(4)}</span>
        </div>

        {user && (
          <div className="asset-buy-row">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder={t.qty}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="qty-input"
            />
            <button onClick={handleBuy} disabled={busy || !qty} className="buy-btn">
              {busy ? "…" : t.buy}
            </button>
          </div>
        )}

        {feedback && (
          <p className={`asset-feedback ${feedback.type}`}>{feedback.msg}</p>
        )}
      </div>

      {showInfo && (
        <AssetInfoModal asset={asset} onClose={() => setShowInfo(false)} />
      )}
    </>
  );
}
