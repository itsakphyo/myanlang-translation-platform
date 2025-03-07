import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#00ACC1' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      '@media (min-width:600px)': {
        fontSize: '1.2rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  zIndex: {
    drawer: 1301,
    modal: 1400,
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;