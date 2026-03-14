import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, portfolioAPI, marketAPI, gameAPI } from "../services/api";

const GameContext = createContext(null);

const STATUS_POLL_INTERVAL = 30_000; // poll bonus status every 30 s

export function GameProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [portfolio, setPortfolio]         = useState(null);
  const [assets, setAssets]               = useState([]);
  const [events, setEvents]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [toast, setToast]                 = useState(null);
  const [bonusReady, setBonusReady]       = useState(false);
  const [bonusSecsLeft, setBonusSecsLeft] = useState(0);

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    authAPI.me()
      .then((d) => setUser(d.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Market data refresh ───────────────────────────────────────────────────
  const refreshMarket = useCallback(async () => {
    try {
      const [assetsData, eventsData] = await Promise.all([
        marketAPI.listAssets(),
        marketAPI.recentEvents(),
      ]);
      setAssets(assetsData.assets);
      setEvents(eventsData.events);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const refreshPortfolio = useCallback(async () => {
    if (!user) return;
    try {
      const data = await portfolioAPI.getPortfolio();
      setPortfolio(data);
    } catch (e) {
      setError(e.message);
    }
  }, [user]);

  useEffect(() => {
    refreshMarket();
    const id = setInterval(refreshMarket, 15_000);
    return () => clearInterval(id);
  }, [refreshMarket]);

  useEffect(() => {
    if (user) refreshPortfolio();
  }, [user, refreshPortfolio]);

  // ── Session bonus status polling ──────────────────────────────────────────
  const refreshBonusStatus = useCallback(async () => {
    if (!user) return;
    try {
      const data = await gameAPI.sessionBonusStatus();
      setBonusReady(data.ready);
      setBonusSecsLeft(data.seconds_remaining ?? 0);
    } catch {
      // silently ignore
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setBonusReady(false);
      setBonusSecsLeft(0);
      return;
    }
    refreshBonusStatus();
    const id = setInterval(refreshBonusStatus, STATUS_POLL_INTERVAL);
    return () => clearInterval(id);
  }, [user, refreshBonusStatus]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (credentials) => {
    const data = await authAPI.register(credentials);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setPortfolio(null);
    setBonusReady(false);
  };

  // ── Trade actions ─────────────────────────────────────────────────────────
  const buyAsset = async (symbol, quantity) => {
    const data = await portfolioAPI.buy({ symbol, quantity });
    await Promise.all([refreshPortfolio(), refreshMarket()]);
    return data;
  };

  const sellAsset = async (symbol, quantity) => {
    const data = await portfolioAPI.sell({ symbol, quantity });
    await Promise.all([refreshPortfolio(), refreshMarket()]);
    return data;
  };

  const claimDaily = async () => {
    const data = await gameAPI.claimDaily();
    await refreshPortfolio();
    return data;
  };

  const claimSessionBonus = async () => {
    const data = await gameAPI.sessionBonus();
    setBonusReady(false);
    setBonusSecsLeft(600); // optimistic: reset to full cooldown
    setToast({ coins: data.coins_awarded });
    await Promise.all([refreshPortfolio(), refreshBonusStatus()]);
    return data;
  };

  const dismissToast = () => setToast(null);

  return (
    <GameContext.Provider
      value={{
        user, portfolio, assets, events, loading, error,
        toast, dismissToast,
        bonusReady, bonusSecsLeft,
        login, register, logout,
        buyAsset, sellAsset, claimDaily, claimSessionBonus,
        refreshMarket, refreshPortfolio,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};
