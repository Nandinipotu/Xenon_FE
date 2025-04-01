import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { themeToggleStyles } from './ThemeToggleStyles';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const styles = themeToggleStyles(mode);

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTheme} color="inherit" sx={styles.button}>
        {mode === 'light' ? <DarkMode sx={styles.icon} /> : <LightMode sx={styles.icon} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;