import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define type for creating theme based on mode
export const createAppTheme = (mode: 'light' | 'dark') => {
  let theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode
            primary: {
              main: '#343541',
            },
            secondary: {
              main: '#202123',
            },
            background: {
              default: '#ffffff',
              paper: '#f7f7f8',
            },
            text: {
              primary: '#343541',
              secondary: '#6e6e80',
            },
          }
        : {
            // Dark mode
            primary: {
              main: '#c5c5d2',
            },
            secondary: {
              main: '#ececf1',
            },
            background: {
              default: '#343541',
              paper: '#444654',
            },
            text: {
              primary: '#ececf1',
              secondary: '#c5c5d2',
            },
          }),
    },
    typography: {
      fontFamily: '"Söhne", "Helvetica Neue", Helvetica, Arial, sans-serif',
      button: {
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  // Apply responsive font sizes
  theme = responsiveFontSizes(theme);

  return theme;
};