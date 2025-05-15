/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            light: '#3b82f6',
            DEFAULT: '#3b82f6',
            dark: '#1e3a8a',
          },
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
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
        fontFamily: {
          sans: [
            'Inter',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
          ],
        },
        backgroundImage: {
          'gradient-primary': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          'gradient-secondary': 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
          'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        },
        boxShadow: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };
  