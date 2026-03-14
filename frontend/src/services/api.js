const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login:    (body) => request("/auth/login",    { method: "POST", body: JSON.stringify(body) }),
  logout:   ()     => request("/auth/logout",   { method: "POST" }),
  me:       ()     => request("/auth/me"),
};

// ── Market ───────────────────────────────────────────────────────────────────
export const marketAPI = {
  listAssets:    ()       => request("/market/assets"),
  getAsset:      (symbol) => request(`/market/assets/${symbol}`),
  assetHistory:  (symbol, limit = 30) => request(`/market/assets/${symbol}/history?limit=${limit}`),
  recentEvents:  (limit = 10) => request(`/market/events?limit=${limit}`),
};

// ── Portfolio ─────────────────────────────────────────────────────────────────
export const portfolioAPI = {
  getPortfolio:     ()     => request("/portfolio/"),
  buy:              (body) => request("/portfolio/buy",  { method: "POST", body: JSON.stringify(body) }),
  sell:             (body) => request("/portfolio/sell", { method: "POST", body: JSON.stringify(body) }),
  getTransactions:  (limit = 50) => request(`/portfolio/transactions?limit=${limit}`),
};

// ── Game ─────────────────────────────────────────────────────────────────────
export const gameAPI = {
  claimDaily:          () => request("/game/claim-daily",          { method: "POST" }),
  sessionBonusStatus:  () => request("/game/session-bonus/status"),
  sessionBonus:        () => request("/game/session-bonus",        { method: "POST" }),
};
