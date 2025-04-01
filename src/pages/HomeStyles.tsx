import { SxProps, Theme } from '@mui/material';

interface HomeStylesType {
  root: SxProps<Theme>;
  container: SxProps<Theme>;
  content: SxProps<Theme>;
}

export const homeStyles = (mode: 'light' | 'dark'): HomeStylesType => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: mode === 'light' ? '#ffffff' : '#343541',
  },
  container: {
    display: 'flex',
    flex: 1,
    marginTop: '48px',
   
    
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 30px)',
    paddingTop: '30px',
    overflow: 'hidden',
    transition: 'margin-left 0.3s',
    
  },
});