import React, { createContext, useContext, useState, useEffect } from 'react';

export const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'sl', label: 'Slovenščina', flag: '🇸🇮' }
];

export const TRANSLATIONS = {
  en: {
    assistant: "Interview Assistant",
    prepare: "Prepare",
    allPrepareTools: "All Prepare Tools",
    questionBank: "Question Bank",
    mockInterview: "Mock Interviews",
    resumeMaker: "Resume Maker",
    headshots: "AI Headshots",
    dashboard: "Dashboard",
    freeBadge: "100% Free",
    startLive: "Start Free Live Session",
    stealthMode: "Stealth Overlay",
    undetectable: "UNDETECTABLE",
    snapScreen: "Snap LeetCode / Screen",
    pricing: "Pricing",
    howItWorks: "How It Works",
    faq: "FAQ"
  },
  es: {
    assistant: "Interview Assistant",
    prepare: "Preparación",
    allPrepareTools: "Todas las herramientas",
    questionBank: "Banco de Preguntas",
    mockInterview: "Simulación de Entrevista",
    resumeMaker: "Creador de CV",
    headshots: "Retratos IA",
    dashboard: "Panel",
    freeBadge: "100% Gratis",
    startLive: "Iniciar Sesión en Vivo",
    stealthMode: "Modo Oculto",
    undetectable: "INDETECTABLE",
    snapScreen: "Capturar Pantalla / LeetCode",
    pricing: "Precios",
    howItWorks: "Cómo funciona",
    faq: "Preguntas frecuentes"
  },
  fr: {
    assistant: "Interview Assistant",
    prepare: "Préparation",
    allPrepareTools: "Tous les outils",
    questionBank: "Banque de Questions",
    mockInterview: "Entretien Blanc",
    resumeMaker: "Créateur de CV",
    headshots: "Portraits IA",
    dashboard: "Tableau de Bord",
    freeBadge: "100% Gratuit",
    startLive: "Démarrer Session en Direct",
    stealthMode: "Mode Furtif",
    undetectable: "INDÉTECTABLE",
    snapScreen: "Scanner LeetCode / Écran",
    pricing: "Tarifs",
    howItWorks: "Comment ça marche",
    faq: "FAQ"
  },
  de: {
    assistant: "Interview Assistant",
    prepare: "Vorbereitung",
    allPrepareTools: "Alle Werkzeuge",
    questionBank: "Fragenkatalog",
    mockInterview: "Bewerbungsgespräch Üben",
    resumeMaker: "Lebenslauf-Ersteller",
    headshots: "KI-Bewerbungsfotos",
    dashboard: "Dashboard",
    freeBadge: "100% Kostenlos",
    startLive: "Live-Sitzung Starten",
    stealthMode: "Stealth-Modus",
    undetectable: "UNENTDECKBAR",
    snapScreen: "LeetCode / Bildschirm Scannen",
    pricing: "Preise",
    howItWorks: "So funktioniert es",
    faq: "FAQ"
  },
  sl: {
    assistant: "Call Assistant",
    prepare: "Priprava",
    allPrepareTools: "Vsa orodja",
    questionBank: "Zbirka Vprašanj",
    mockInterview: "Poskusni Razgovor",
    resumeMaker: "Izdelovalec Življenjepisa",
    headshots: "Poslovni Portreti",
    dashboard: "Nadzorna Plošča",
    freeBadge: "100% Brezplačno",
    startLive: "Začni Sejo v Živo",
    stealthMode: "Nevidni Način",
    undetectable: "NEZAZNAVNO",
    snapScreen: "Zajemi LeetCode / Zaslon",
    pricing: "Cene",
    howItWorks: "Kako deluje",
    faq: "Pogosta vprašanja"
  }
};

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem('parakeet_locale') || 'en');

  const changeLocale = (code) => {
    setLocale(code);
    localStorage.setItem('parakeet_locale', code);
  };

  const t = (key) => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const currentLocaleData = LOCALES.find(l => l.code === locale) || LOCALES[0];

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, t, currentLocaleData, locales: LOCALES }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
