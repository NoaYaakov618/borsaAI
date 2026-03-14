import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { LanguageProvider } from "./context/LanguageContext";
import { useGame } from "./context/GameContext";
import { useLanguage } from "./context/LanguageContext";
import Navbar from "./components/common/Navbar";
import Toast from "./components/common/Toast";
import Home from "./pages/Home";
import MarketPage from "./pages/Market";
import PortfolioPage from "./pages/Portfolio";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import "./styles/global.css";

function AppInner() {
  const { toast, dismissToast } = useGame();
  const { t } = useLanguage();

  const resolvedToast = toast
    ? {
        title: t.sessionBonusTitle,
        message: t.sessionBonusMsg(toast.coins),
      }
    : null;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/market"    element={<MarketPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/login"     element={<LoginForm />} />
        <Route path="/register"  element={<RegisterForm />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
      <Toast toast={resolvedToast} onDismiss={dismissToast} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </LanguageProvider>
  );
}
