import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, portfolio, logout } = useGame();
  const { t, lang, toggle } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📈 BorsaAI
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/market">{t.market}</Link>
            <Link to="/portfolio">{t.portfolio}</Link>
            <span className="navbar-coins">
              🪙 {portfolio ? portfolio.coins.toFixed(2) : user.coins.toFixed(2)}
            </span>
            <span className="navbar-user">{user.username}</span>
            <button onClick={handleLogout} className="btn-ghost">{t.logout}</button>
          </>
        ) : (
          <>
            <Link to="/login">{t.login}</Link>
            <Link to="/register" className="btn-primary">{t.signUp}</Link>
          </>
        )}
        <button onClick={toggle} className="btn-ghost lang-toggle">
          {lang === "en" ? "עב" : "EN"}
        </button>
      </div>
    </nav>
  );
}
