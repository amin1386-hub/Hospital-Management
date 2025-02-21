import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

const githubDark = {
    background: '#0A192F',
    paper: '#112240',
    border: '#1E3A8A',
    primary: '#2563EB',
    secondary: '#3B82F6',
    text: '#E2E8F0',
    textSecondary: '#94A3B8',
  };

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...(darkMode ? {
        primary: {
            main: githubDark.primary,
            dark: '#1E40AF',
            light: '#3B82F6',
          },
          secondary: {
            main: githubDark.secondary,
            dark: '#1E3A8A',
            light: '#60A5FA',
          },
          background: {
            default: githubDark.background,
            paper: githubDark.paper,
          },
          text: {
            primary: githubDark.text,
            secondary: githubDark.textSecondary,
          },
          divider: githubDark.border,
        } : {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          main: '#1976d2',
        },
        background: {
          default: '#131313',
          paper: '#000000',
        },
        text: {
          primary: '#172B4D',
          secondary: '#6B778C',
        },
      }),
    },
    direction: 'rtl',
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: 'Vazir, sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            borderRadius: 8,
            ...(theme.palette.mode === 'dark' && {
              borderColor: githubDark.border,
              borderWidth: 1,
              borderStyle: 'solid',
            }),
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            ...(theme.palette.mode === 'dark' && {
              borderColor: githubDark.border,
              borderWidth: 1,
              borderStyle: 'solid',
            }),
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: theme.palette.divider,
          }),
        },
      },
    },
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}