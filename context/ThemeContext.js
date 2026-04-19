import React, { createContext, useState, useContext } from "react";

const themes = {
    light: {
        mode: 'light',
        background: 'rgba(255, 255, 255, 1)',
        background1: "#EEEEF3",
        background2: "#ffffff",
        text: 'rgba(0, 0, 0, 1)',
        text1: "#5F606B",
        icon: 'moon'
    },
    dark: {
        mode: 'dark',
        background: 'rgba(32, 32, 32, 1)',
        background1: "#5F606B",
        background2:"#2E2E2E",
        text: 'rgba(255, 255, 255, 1)',
        text1: "#fff",
        icon: 'sunny-outline'
    }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.light);

    const toggleTheme = () => {
        setTheme((prev) => (prev.mode === 'light' ? themes.dark : themes.light))
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);