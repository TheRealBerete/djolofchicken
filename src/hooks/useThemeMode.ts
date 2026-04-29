import { useState, useEffect, useCallback } from "react";

type ThemeMode = "light" | "dark" | "auto";

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme-mode") as ThemeMode) || "auto";
  });

  const [resolved, setResolved] = useState<"light" | "dark">("light");

  const resolveTheme = useCallback((m: ThemeMode) => {
    if (m === "auto") {
      const hour = new Date().getHours();
      return hour >= 7 && hour < 19 ? "light" : "dark";
    }
    return m;
  }, []);

  useEffect(() => {
    const resolvedTheme = resolveTheme(mode);
    setResolved(resolvedTheme);
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    localStorage.setItem("theme-mode", mode);
  }, [mode, resolveTheme]);

  useEffect(() => {
    if (mode !== "auto") return;
    const interval = setInterval(() => {
      const resolvedTheme = resolveTheme("auto");
      setResolved(resolvedTheme);
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }, 60000);
    return () => clearInterval(interval);
  }, [mode, resolveTheme]);

  const toggle = () => {
    setMode((prev) => {
      const resolvedPrev = resolveTheme(prev);
      return resolvedPrev === "dark" ? "light" : "dark";
    });
  };

  const cycle = () => {
    setMode((prev) => {
      if (prev === "auto") return "light";
      if (prev === "light") return "dark";
      return "auto";
    });
  };

  return { mode, resolved, setMode, toggle, cycle };
}
