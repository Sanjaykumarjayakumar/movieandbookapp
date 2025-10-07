import React, { useState, useEffect } from "react";
import { LanguageContext } from "../hooks/useLanguage";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en-US"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
