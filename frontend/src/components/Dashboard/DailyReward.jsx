import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Dashboard.css";

export default function DailyReward() {
  const { claimDaily, user } = useGame();
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const alreadyClaimed = user?.last_daily_reward === today;

  const handleClaim = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const data = await claimDaily();
      setFeedback({ type: "success", msg: data.message });
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="daily-reward-card">
      <div className="daily-reward-icon">🪙</div>
      <div>
        <p className="daily-reward-title">{t.dailySalary}</p>
        <p className="daily-reward-sub">{t.dailySalarySub}</p>
      </div>
      <button
        onClick={handleClaim}
        disabled={busy || alreadyClaimed}
        className={`daily-claim-btn ${alreadyClaimed ? "claimed" : ""}`}
      >
        {alreadyClaimed ? t.claimed : busy ? "…" : t.claim}
      </button>
      {feedback && (
        <p className={`daily-feedback ${feedback.type}`}>{feedback.msg}</p>
      )}
    </div>
  );
}
