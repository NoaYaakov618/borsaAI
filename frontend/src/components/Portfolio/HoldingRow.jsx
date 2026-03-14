import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Portfolio.css";

export default function HoldingRow({ holding }) {
  const { sellAsset } = useGame();
  const { t } = useLanguage();
  const [qty, setQty] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);

  const pnlPositive = holding.unrealized_pnl >= 0;

  const handleSell = async () => {
    const quantity = parseFloat(qty);
    if (!quantity || quantity <= 0) return;
    setBusy(true);
    setFeedback(null);
    try {
      await sellAsset(holding.asset.symbol, quantity);
      setFeedback({ type: "success", msg: t.sold(quantity, holding.asset.symbol) });
      setQty("");
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="holding-row">
      <div className="holding-info">
        <span className="holding-symbol">{holding.asset.symbol}</span>
        <span className="holding-name">{holding.asset.name}</span>
      </div>

      <div className="holding-stats">
        <div>
          <span className="stat-label">{t.shares}</span>
          <span className="stat-value">{holding.quantity}</span>
        </div>
        <div>
          <span className="stat-label">{t.avgCost}</span>
          <span className="stat-value">🪙 {holding.avg_buy_price.toFixed(4)}</span>
        </div>
        <div>
          <span className="stat-label">{t.value}</span>
          <span className="stat-value">🪙 {holding.current_value.toFixed(4)}</span>
        </div>
        <div>
          <span className="stat-label">{t.pnl}</span>
          <span className={`stat-value ${pnlPositive ? "positive" : "negative"}`}>
            {pnlPositive ? "+" : ""}{holding.unrealized_pnl.toFixed(4)}
            ({pnlPositive ? "+" : ""}{holding.unrealized_pnl_pct.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="holding-sell-row">
        <input
          type="number"
          min="0.01"
          step="0.01"
          max={holding.quantity}
          placeholder={t.qty}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="qty-input-sm"
        />
        <button onClick={handleSell} disabled={busy || !qty} className="sell-btn">
          {busy ? "…" : t.sell}
        </button>
      </div>

      {feedback && (
        <p className={`holding-feedback ${feedback.type}`}>{feedback.msg}</p>
      )}
    </div>
  );
}
