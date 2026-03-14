import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Auth.css";

export default function LoginForm() {
  const { login } = useGame();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t.welcomeBackTitle}</h2>
        <p className="auth-subtitle">{t.loginSubtitle}</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>{t.usernameOrEmail}</label>
          <input name="username" value={form.username} onChange={handleChange} required autoFocus />
          <label>{t.password}</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? t.loggingIn : t.logInBtn}
          </button>
        </form>
        <p className="auth-footer">
          {t.noAccount} <Link to="/register">{t.signUpFree}</Link>
        </p>
      </div>
    </div>
  );
}
