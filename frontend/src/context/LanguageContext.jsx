import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navbar
    market: "Market",
    portfolio: "Portfolio",
    logout: "Logout",
    login: "Login",
    signUp: "Sign Up",

    // Home – logged out
    heroTitle: "📈 BorsaAI",
    heroSubtitle:
      "Learn how the stock market works by playing! Earn daily coins, invest in stocks and indices, and watch your portfolio grow — or crash.",
    getStarted: "Get Started Free",
    logIn: "Log In",

    // Home – logged in
    welcomeBack: (name) => `Welcome back, ${name}! 👋`,
    recentMarketNews: "Recent Market News",
    crash: "📉 CRASH",
    boom: "📈 BOOM",

    // Summary tiles
    cash: "Cash",
    investments: "Investments",
    totalValue: "Total Value",
    positions: "Positions",

    // Daily reward
    dailySalary: "Daily Salary",
    dailySalarySub: "Collect your 10 coins every day",
    claim: "Claim",
    claimed: "Claimed ✓",

    // Session bonus card
    sessionBonusCardTitle: "Active Time Reward",
    sessionBonusCardSub: "Stay logged in for 10 minutes to earn 50 coins",
    sessionBonusCollect: "Collect 50 Coins",
    sessionBonusCooldown: (m, s) => `Ready in ${m}m ${s}s`,

    // Market page
    liveMarket: "Live Market",
    marketSubtitle: "Prices update every simulated day. Buy and build your portfolio!",
    loadingMarket: "Loading market…",
    prev: "prev",
    qty: "Qty",
    buy: "Buy",
    bought: (qty, sym) => `Bought ${qty} ${sym}`,

    // Asset info modal
    infoAssetType: "Asset Type",
    infoWhatIs: "What is this?",
    infoRisk: "Risk Level",
    infoRewardRisk: "Reward vs. Risk",
    infoExample: "Example",
    infoClose: "Close",
    riskLow: "Low",
    riskMedium: "Medium",
    riskHigh: "High",

    // Asset type labels
    typeStock: "Stock",
    typeIndex: "Index",
    typeMoney: "Money Market",

    // Portfolio page
    myPortfolio: "My Portfolio",
    loadingPortfolio: "Loading portfolio…",
    holdings: "Holdings",
    noHoldings: "No holdings yet. Head to the Market to invest!",
    recentTransactions: "Recent Transactions",
    shares: "Shares",
    avgCost: "Avg cost",
    value: "Value",
    pnl: "P&L",
    sell: "Sell",
    sold: (qty, sym) => `Sold ${qty} ${sym}`,
    txAsset: "Asset",
    txType: "Type",
    txQty: "Qty",
    txPrice: "Price",
    txTotal: "Total",
    txDate: "Date",

    // Session bonus toast
    sessionBonusTitle: "Bonus Earned! 🎉",
    sessionBonusMsg: (n) => `You earned ${n} coins for staying active!`,

    // Auth – login
    welcomeBackTitle: "Welcome back",
    loginSubtitle: "Log in to your investment account",
    usernameOrEmail: "Username or Email",
    password: "Password",
    loggingIn: "Logging in…",
    logInBtn: "Log In",
    noAccount: "No account?",
    signUpFree: "Sign up free",

    // Auth – register
    createAccount: "Create your account",
    registerSubtitle: "Start with 5,000 free coins and learn to invest!",
    username: "Username",
    email: "Email",
    creatingAccount: "Creating account…",
    signUpBtn: "Sign Up",
    haveAccount: "Already have an account?",
    logInLink: "Log in",
  },

  he: {
    // Navbar
    market: "שוק",
    portfolio: "תיק השקעות",
    logout: "התנתק",
    login: "כניסה",
    signUp: "הרשמה",

    // Home – logged out
    heroTitle: "📈 BorsaAI",
    heroSubtitle:
      "למד איך שוק המניות עובד תוך כדי משחק! קבל מטבעות יומיים, השקע במניות ובמדדים, וצפה בתיק שלך צומח — או קורס.",
    getStarted: "התחל בחינם",
    logIn: "כניסה",

    // Home – logged in
    welcomeBack: (name) => `ברוך שובך, ${name}! 👋`,
    recentMarketNews: "חדשות שוק אחרונות",
    crash: "📉 קריסה",
    boom: "📈 גאות",

    // Summary tiles
    cash: "מזומן",
    investments: "השקעות",
    totalValue: "שווי כולל",
    positions: "פוזיציות",

    // Daily reward
    dailySalary: "משכורת יומית",
    dailySalarySub: "אסוף 10 מטבעות בכל יום",
    claim: "אסוף",
    claimed: "נאסף ✓",

    // Session bonus card
    sessionBonusCardTitle: "פרס זמן פעיל",
    sessionBonusCardSub: "הישאר מחובר 10 דקות וקבל 50 מטבעות",
    sessionBonusCollect: "אסוף 50 מטבעות",
    sessionBonusCooldown: (m, s) => `מוכן בעוד ${m}:${String(s).padStart(2,"0")}`,

    // Market page
    liveMarket: "שוק חי",
    marketSubtitle: "המחירים מתעדכנים בכל יום סימולציה. קנה ובנה את התיק שלך!",
    loadingMarket: "טוען שוק…",
    prev: "קודם",
    qty: "כמות",
    buy: "קנה",
    bought: (qty, sym) => `נקנו ${qty} ${sym}`,

    // Asset info modal
    infoAssetType: "סוג הנכס",
    infoWhatIs: "מה זה?",
    infoRisk: "רמת סיכון",
    infoRewardRisk: "תשואה מול סיכון",
    infoExample: "דוגמה",
    infoClose: "סגור",
    riskLow: "נמוך",
    riskMedium: "בינוני",
    riskHigh: "גבוה",

    // Asset type labels
    typeStock: "מניה",
    typeIndex: "מדד",
    typeMoney: "קרן כספית",

    // Portfolio page
    myPortfolio: "התיק שלי",
    loadingPortfolio: "טוען תיק…",
    holdings: "אחזקות",
    noHoldings: "אין אחזקות עדיין. עבור לשוק כדי להשקיע!",
    recentTransactions: "עסקאות אחרונות",
    shares: "יחידות",
    avgCost: "עלות ממוצעת",
    value: "שווי",
    pnl: "רווח/הפסד",
    sell: "מכור",
    sold: (qty, sym) => `נמכרו ${qty} ${sym}`,
    txAsset: "נכס",
    txType: "סוג",
    txQty: "כמות",
    txPrice: "מחיר",
    txTotal: "סה״כ",
    txDate: "תאריך",

    // Session bonus toast
    sessionBonusTitle: "בונוס הושג! 🎉",
    sessionBonusMsg: (n) => `קיבלת ${n} מטבעות על שהישארת מחובר!`,

    // Auth – login
    welcomeBackTitle: "ברוך שובך",
    loginSubtitle: "היכנס לחשבון ההשקעות שלך",
    usernameOrEmail: "שם משתמש או אימייל",
    password: "סיסמה",
    loggingIn: "מתחבר…",
    logInBtn: "כניסה",
    noAccount: "אין לך חשבון?",
    signUpFree: "הרשם בחינם",

    // Auth – register
    createAccount: "צור חשבון",
    registerSubtitle: "התחל עם 5,000 מטבעות חינם ולמד להשקיע!",
    username: "שם משתמש",
    email: "אימייל",
    creatingAccount: "יוצר חשבון…",
    signUpBtn: "הרשמה",
    haveAccount: "כבר יש לך חשבון?",
    logInLink: "כניסה",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    const dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggle = () => setLang((l) => (l === "en" ? "he" : "en"));
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
