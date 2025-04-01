import { SxProps, Theme } from '@mui/material';

interface ThemeToggleStylesType {
  button: SxProps<Theme>;
  icon: SxProps<Theme>;
}

export const themeToggleStyles = (mode: 'light' | 'dark'): ThemeToggleStylesType => ({
  button: {
    padding: 1,
    color: mode === 'light' ? '#343541' : '#f7f7f8',
  },
  icon: {
    fontSize: '1.2rem',
  },
});