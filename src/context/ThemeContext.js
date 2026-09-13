"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
const ThemeContext = createContext({});
function subscribe(callback) {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
}
function snapshot() {
  return document.documentElement.dataset.theme || "dark";
}
export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "dark");
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("inferanotes-theme", next);
    } catch {
      /* Storage may be disabled. */
    }
    window.dispatchEvent(new Event("theme-change"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
