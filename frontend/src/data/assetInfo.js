/**
 * Educational info for each asset, in both languages.
 * Shown in the AssetInfoModal when the user clicks the ⓘ button.
 */

const RISK = {
  LOW:    { en: "Low",    he: "נמוך"   },
  MEDIUM: { en: "Medium", he: "בינוני" },
  HIGH:   { en: "High",   he: "גבוה"   },
};

const assetInfo = {
  APPL: {
    en: {
      typeLabel: "Stock",
      typeExplain: "A stock is a small piece of ownership in a company. When the company does well, your piece becomes worth more!",
      risk: RISK.HIGH.en,
      rewardVsRisk: "Stocks can grow a lot over time, but they can also drop sharply. High reward, high risk.",
      example: "Imagine you own a tiny slice of a pizza restaurant. If the restaurant becomes popular, your slice is worth more. If it closes, you lose your money.",
    },
    he: {
      typeLabel: "מניה",
      typeExplain: "מניה היא חלק קטן בבעלות על חברה. כאשר החברה מצליחה, החלק שלך שווה יותר!",
      risk: RISK.HIGH.he,
      rewardVsRisk: "מניות יכולות לצמוח הרבה לאורך זמן, אך גם לרדת בחדות. סיכון גבוה, פוטנציאל רווח גבוה.",
      example: "דמיין שיש לך פרוסה קטנה בבעלות פיצרייה. אם הפיצרייה מצליחה, הפרוסה שלך שווה יותר. אם היא נסגרת, אתה מפסיד.",
    },
  },
  RIVR: {
    en: {
      typeLabel: "Stock",
      typeExplain: "A stock is a small piece of ownership in a company. Riviera Motors makes electric cars.",
      risk: RISK.HIGH.en,
      rewardVsRisk: "New tech companies can grow very fast, but they are also risky — they might not succeed.",
      example: "Buying this stock is like betting that electric cars will replace regular cars. If they do, you win big!",
    },
    he: {
      typeLabel: "מניה",
      typeExplain: "מניה היא חלק בבעלות על חברה. ריביירה מוטורס מייצרת מכוניות חשמליות.",
      risk: RISK.HIGH.he,
      rewardVsRisk: "חברות טכנולוגיה חדשות יכולות לצמוח מהר מאוד, אך הן גם מסוכנות — ייתכן שלא יצליחו.",
      example: "לקנות את המניה הזאת זה כמו להמר שמכוניות חשמליות יחליפו מכוניות רגילות. אם יקרה כך — תרוויח הרבה!",
    },
  },
  GROC: {
    en: {
      typeLabel: "Stock",
      typeExplain: "A stock in a grocery chain. People always need to buy food, so this company is more stable than tech stocks.",
      risk: RISK.MEDIUM.en,
      rewardVsRisk: "Steady growth with smaller swings. Less exciting, but less scary too.",
      example: "Think of the supermarket your family shops at. It probably won't double in value overnight, but it rarely closes down either.",
    },
    he: {
      typeLabel: "מניה",
      typeExplain: "מניה ברשת סופרמרקטים. אנשים תמיד צריכים לקנות אוכל, אז החברה הזו יציבה יותר ממניות טכנולוגיה.",
      risk: RISK.MEDIUM.he,
      rewardVsRisk: "צמיחה יציבה עם תנודות קטנות יותר. פחות מרגש, אבל גם פחות מפחיד.",
      example: "חשוב על הסופרמרקט שהמשפחה שלך קונה בו. הוא כנראה לא יכפיל את ערכו בן לילה, אבל הוא גם כמעט לא נסגר.",
    },
  },
  BNKX: {
    en: {
      typeLabel: "Stock",
      typeExplain: "A stock in a bank. Banks earn money by lending to others. They are usually stable but can struggle in recessions.",
      risk: RISK.MEDIUM.en,
      rewardVsRisk: "Moderate growth. Banks can be hurt by economic crises, but they are heavily regulated to stay safe.",
      example: "A bank is like a piggy bank for the whole city. It usually keeps your money safe, but during a crisis it can run into trouble.",
    },
    he: {
      typeLabel: "מניה",
      typeExplain: "מניה בבנק. בנקים מרוויחים כסף על ידי הלוואות לאחרים. הם בדרך כלל יציבים אך יכולים להיתקל בקשיים במיתון.",
      risk: RISK.MEDIUM.he,
      rewardVsRisk: "צמיחה מתונה. בנקים יכולים להיפגע ממשברים כלכליים, אך הם מפוקחים היטב.",
      example: "בנק הוא כמו קופת חיסכון של כל העיר. בדרך כלל הכסף בטוח שם, אבל במשבר — גם הבנק יכול להיתקל בצרות.",
    },
  },
  ENRG: {
    en: {
      typeLabel: "Stock",
      typeExplain: "A stock in a renewable energy company that makes solar panels. The green energy industry is growing fast.",
      risk: RISK.HIGH.en,
      rewardVsRisk: "High potential if clean energy adoption accelerates, but government policy changes can hurt it quickly.",
      example: "If your town decides to put solar panels on every roof, this company wins big. But if cheap oil comes back, solar companies can struggle.",
    },
    he: {
      typeLabel: "מניה",
      typeExplain: "מניה בחברת אנרגיה מתחדשת שמייצרת פאנלים סולאריים. תעשיית האנרגיה הירוקה צומחת מהר.",
      risk: RISK.HIGH.he,
      rewardVsRisk: "פוטנציאל גבוה אם אנרגיה נקייה תתפשט, אך שינויי מדיניות ממשלתית יכולים לפגוע בה מהר.",
      example: "אם העיר שלך תחליט לשים פאנלים סולאריים על כל גג, החברה הזו מרוויחה הרבה. אבל אם נפט זול יחזור, חברות סולאריות עלולות להתקשות.",
    },
  },
  MKT500: {
    en: {
      typeLabel: "Index Fund",
      typeExplain: "An index fund tracks 500 companies at once. Instead of betting on one company, you spread your money across many — reducing risk.",
      risk: RISK.MEDIUM.en,
      rewardVsRisk: "Lower risk than single stocks because one bad company barely affects the whole fund. Steady long-term growth.",
      example: "Instead of betting all your pocket money on one horse in a race, you bet a little on every horse. You might not win the jackpot, but you rarely lose everything.",
    },
    he: {
      typeLabel: "קרן מדד",
      typeExplain: "קרן מדד עוקבת אחרי 500 חברות בבת אחת. במקום להמר על חברה אחת, אתה מפזר את הכסף על הרבה חברות — ומפחית סיכון.",
      risk: RISK.MEDIUM.he,
      rewardVsRisk: "סיכון נמוך יותר ממניות בודדות כי חברה אחת גרועה כמעט לא משפיעה על הקרן כולה. צמיחה יציבה לטווח ארוך.",
      example: "במקום לשים את כל כסף הכיס שלך על סוס אחד במרוץ, אתה מהמר קצת על כל סוס. אולי לא תזכה בפוט הגדול, אבל כמעט לא תפסיד הכול.",
    },
  },
  TECH20: {
    en: {
      typeLabel: "Index Fund",
      typeExplain: "An index fund focused on 20 top technology companies. More growth potential than the broad market, but also more volatile.",
      risk: RISK.MEDIUM.en,
      rewardVsRisk: "Tech companies can grow very fast. Concentrating on just tech means bigger wins AND bigger losses than the full market.",
      example: "Imagine owning a piece of the 20 most popular apps on your phone. If apps boom, you do great. If everyone suddenly hates screens, you lose more.",
    },
    he: {
      typeLabel: "קרן מדד",
      typeExplain: "קרן מדד המתמקדת ב-20 חברות הטכנולוגיה המובילות. פוטנציאל צמיחה גבוה יותר מהשוק הרחב, אך גם תנודתית יותר.",
      risk: RISK.MEDIUM.he,
      rewardVsRisk: "חברות טכנולוגיה יכולות לצמוח מהר מאוד. התמקדות בטק בלבד אומרת ניצחונות גדולים יותר — ותבוסות גדולות יותר — מהשוק הכולל.",
      example: "דמיין שיש לך חלק מ-20 האפליקציות הפופולריות ביותר בטלפון שלך. אם אפליקציות פורחות — אתה מצוין. אם כולם פתאום שונאים מסכים — אתה מפסיד יותר.",
    },
  },
  MMFND: {
    en: {
      typeLabel: "Money Market Fund",
      typeExplain: "A money market fund puts your money in very safe, short-term investments. It's like a savings account that grows slowly but almost never shrinks.",
      risk: RISK.LOW.en,
      rewardVsRisk: "Very low risk — your money is almost always safe. But the growth is also very slow. Good for storing coins you don't want to risk.",
      example: "Think of it like hiding your money under a mattress, except the mattress pays you a tiny bit of interest every night for keeping your coins there.",
    },
    he: {
      typeLabel: "קרן כספית",
      typeExplain: "קרן כספית מכניסה את כספך להשקעות בטוחות מאוד לטווח קצר. זה כמו חשבון חיסכון שצומח לאט אך כמעט אף פעם לא מתכווץ.",
      risk: RISK.LOW.he,
      rewardVsRisk: "סיכון נמוך מאוד — הכסף שלך כמעט תמיד בטוח. אבל הצמיחה גם היא איטית מאוד. טוב לשמירת מטבעות שאתה לא רוצה לסכן.",
      example: "חשוב על זה כמו להחביא את הכסף מתחת למזרן, רק שהמזרן משלם לך קצת ריבית כל לילה על כך שהמטבעות שם.",
    },
  },
};

export default assetInfo;
