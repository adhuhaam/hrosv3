import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({
    theme: 'light',
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemTheme = useSystemColorScheme();
    const [theme, setTheme] = useState<Theme>('light');

    // Load theme from storage or use systemTheme initially
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('theme');
                if (storedTheme === 'light' || storedTheme === 'dark') {
                    setTheme(storedTheme);
                } else {
                    setTheme(systemTheme || 'light');
                }
            } catch (error) {
                console.warn('Failed to load theme from storage', error);
                setTheme(systemTheme || 'light');
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            await AsyncStorage.setItem('theme', newTheme);
        } catch (error) {
            console.error('Failed to toggle theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
