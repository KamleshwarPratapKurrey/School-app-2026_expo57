import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  colors: typeof Colors.light;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme() as Theme | null;

  // const [theme, setTheme] = useState<Theme>(systemTheme || "light");
  const [theme, setTheme] = useState<Theme>("light");

  // Load saved theme //imp.
  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await AsyncStorage.getItem("theme");

      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    }

    loadTheme();
  }, []);

  // Save theme when changed //imp.
  useEffect(() => {
    AsyncStorage.setItem("theme", theme);
  }, [theme]);

  // my ADDITIONAL LOGIC TO set theme
  useEffect(() => {
    setTheme(systemTheme || "light");
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: ThemeContextType = {
    theme,
    colors: Colors[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
