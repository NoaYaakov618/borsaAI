import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Auth.css";

export default function RegisterForm() {
  const { register } = useGame();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
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
        <h2>{t.createAccount}</h2>
        <p className="auth-subtitle">{t.registerSubtitle}</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>{t.username}</label>
          <input name="username" value={form.username} onChange={handleChange} required autoFocus />
          <label>{t.email}</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>{t.password}</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? t.creatingAccount : t.signUpBtn}
          </button>
        </form>
        <p className="auth-footer">
          {t.haveAccount} <Link to="/login">{t.logInLink}</Link>
        </p>
      </div>
    </div>
  );
}
