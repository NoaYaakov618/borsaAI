import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import assetInfo from "../../data/assetInfo.js";
import "./AssetInfoModal.css";

const RISK_COLOR = {
  Low:    "#4ade80",
  Medium: "#fbbf24",
  High:   "#f87171",
  נמוך:   "#4ade80",
  בינוני: "#fbbf24",
  גבוה:   "#f87171",
};

export default function AssetInfoModal({ asset, onClose }) {
  const { t, lang } = useLanguage();
  const info = assetInfo[asset.symbol]?.[lang] ?? assetInfo[asset.symbol]?.en;

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="close">✕</button>

        <div className="modal-header">
          <span className="modal-symbol">{asset.symbol}</span>
          <span className="modal-asset-name">{asset.name}</span>
        </div>

        {info ? (
          <>
            <Section label={t.infoAssetType} value={info.typeLabel} />
            <Section label={t.infoWhatIs}>
              <p className="modal-text">{info.typeExplain}</p>
            </Section>
            <Section label={t.infoRisk}>
              <span
                className="risk-badge"
                style={{ background: RISK_COLOR[info.risk] + "22", color: RISK_COLOR[info.risk], borderColor: RISK_COLOR[info.risk] }}
              >
                {info.risk}
              </span>
            </Section>
            <Section label={t.infoRewardRisk}>
              <p className="modal-text">{info.rewardVsRisk}</p>
            </Section>
            <Section label={t.infoExample}>
              <p className="modal-text modal-example">💡 {info.example}</p>
            </Section>
          </>
        ) : (
          <p className="modal-text" style={{ color: "#64748b" }}>No info available.</p>
        )}

        <button className="modal-close-btn" onClick={onClose}>{t.infoClose}</button>
      </div>
    </div>
  );
}

function Section({ label, value, children }) {
  return (
    <div className="modal-section">
      <span className="modal-section-label">{label}</span>
      {value && <span className="modal-section-value">{value}</span>}
      {children}
    </div>
  );
}
