import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Dashboard.css";

export default function SessionBonusCard() {
  const { bonusReady, bonusSecsLeft, claimSessionBonus } = useGame();
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Local countdown that ticks every second between server polls
  const [localSecs, setLocalSecs] = useState(bonusSecsLeft);

  useEffect(() => {
    setLocalSecs(bonusSecsLeft);
  }, [bonusSecsLeft]);

  useEffect(() => {
    if (bonusReady || localSecs <= 0) return;
    const id = setInterval(() => setLocalSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [bonusReady, localSecs]);

  const mins = Math.floor(localSecs / 60);
  const secs = localSecs % 60;

  const handleCollect = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const data = await claimSessionBonus();
      setFeedback({ type: "success", msg: `+${data.coins_awarded} 🪙` });
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="daily-reward-card">
      <div className="daily-reward-icon">⏱️</div>
      <div>
        <p className="daily-reward-title">{t.sessionBonusCardTitle}</p>
        <p className="daily-reward-sub">{t.sessionBonusCardSub}</p>
      </div>
      <button
        onClick={handleCollect}
        disabled={busy || !bonusReady}
        className={`daily-claim-btn ${bonusReady ? "bonus-ready" : ""}`}
      >
        {busy
          ? "…"
          : bonusReady
            ? t.sessionBonusCollect
            : t.sessionBonusCooldown(mins, secs)}
      </button>
      {feedback && (
        <p className={`daily-feedback ${feedback.type}`}>{feedback.msg}</p>
      )}
    </div>
  );
}
