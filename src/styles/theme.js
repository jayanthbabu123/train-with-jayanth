/** @type {import('tailwindcss').Config} */
const theme = {
  colors: {
    primary: {
      50: '#e6f1ff',
      100: '#cce3ff',
      200: '#99c7ff',
      300: '#66abff',
      400: '#338fff',
      500: '#0073ff', // Main primary color
      600: '#005ccc',
      700: '#004599',
      800: '#002e66',
      900: '#001733',
    },
    brand: {
      light: '#0284c7',  // Our light blue
      DEFAULT: '#0284c7', // Default brand color
      dark: '#0369a1',   // Our dark blue
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    background: {
      light: '#ffffff',
      dark: '#0f172a',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      light: '#f8fafc',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Poppins, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    secondary: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    accent: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

module.exports = theme; 