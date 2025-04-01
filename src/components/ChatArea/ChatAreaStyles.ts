

import { SxProps, Theme } from '@mui/material';

export const chatAreaStyles = (mode: 'light' | 'dark') => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flex: 1,
    overflow: 'hidden',
  } as SxProps<Theme>,
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: {
      xs: 2,
      sm: 4
    },
    overflow: 'auto',
    
  } as SxProps<Theme>,
  welcomeSection: {
    maxWidth: 720,
    width: '100%',
    textAlign: 'center',
    margin: '0 auto',
    marginBottom: 4,
    
  } as SxProps<Theme>,
  title: {
    fontSize: {
      xs: '1.5rem',
      sm: '2rem'
    },
    fontWeight: 600,
    marginBottom: 3,
    color: mode === 'light' ? '#343541' : '#f7f7f8',
  } as SxProps<Theme>,
  suggestionGrid2: {
    justifyContent: 'center',
    marginTop: 3,
  } as SxProps<Theme>,
  suggestionCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderRadius: 2,
    cursor: 'pointer',
    backgroundColor: mode === 'light' ? '#f7f7f8' : '#444654',
    border: `1px solid ${mode === 'light' ? '#e5e5e5' : '#565869'}`,
    '&:hover': {
      backgroundColor: mode === 'light' ? '#eaeaea' : '#565869',
    },
    transition: 'background-color 0.2s',
    height: '100%',
  } as SxProps<Theme>,
  suggestionIcon: {
    color: mode === 'light' ? '#343541' : '#f7f7f8',
    marginRight: 1.5,
    fontSize: '1.2rem',
  } as SxProps<Theme>,
  suggestionText: {
    color: mode === 'light' ? '#343541' : '#f7f7f8',
    fontWeight: 500,
    fontSize: '0.95rem',
    textAlign: 'left',
  } as SxProps<Theme>,
  footerContainer: {
    width: '100%',
    marginTop: 'auto',
  } as SxProps<Theme>,
  divider: {
    backgroundColor: mode === 'light' ? '#e5e5e5' : '#565869',
  } as SxProps<Theme>,
  footerContent: {
    padding: 2,
    paddingBottom: 3,
    display: 'flex',
      flexDirection: 'column',
      gap: 1,
  } as SxProps<Theme>,
  termsSection: {
    textAlign: 'center',
    marginBottom: 2,
  } as SxProps<Theme>,
  termsText: {
    color: mode === 'light' ? '#6e6e80' : '#c5c5d2',
    fontSize: '0.75rem',
  } as SxProps<Theme>,
  termsButton: {
    fontSize: '0.75rem',
    padding: 0,
    minWidth: 0,
    color: mode === 'light' ? '#343541' : '#f7f7f8',
    fontWeight: 500,
    textTransform: 'none',
    textDecoration: 'underline',
  } as SxProps<Theme>,
});

export const chatInputStyles = (mode: 'light' | 'dark') => ({
  container: {
    maxWidth: 768,
    width: '100%',
    margin: '0 auto',
  } as SxProps<Theme>,
  inputPaper: (isFocused: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: mode === 'light' ? '#ffffff' : '#40414f',
    border: `1px solid ${isFocused 
      ? (mode === 'light' ? '#000000' : '#ffffff') 
      : (mode === 'light' ? '#e5e5e5' : '#565869')}`,
    padding: 1,
    paddingRight: 1.5,
    transition: 'border-color 0.2s',
    boxShadow: isFocused 
      ? `0 0 0 1px ${mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`
      : 'none',
  }) as SxProps<Theme>,
  textField: {
    '& .MuiInputBase-root': {
      fontSize: '0.95rem',
    },
  } as SxProps<Theme>,
  input: {
    padding: 1,
    fontSize: '0.95rem',
    color: mode === 'light' ? '#343541' : '#f7f7f8',
  } as SxProps<Theme>,
  actionButton: {
    color: mode === 'light' ? '#6e6e80' : '#c5c5d2',
    padding: 0.5,
  } as SxProps<Theme>,
  endButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  } as SxProps<Theme>,
  sendButton: {
    backgroundColor: mode === 'light' ? '#f7f7f8' : '#565869',
    color: mode === 'light' ? '#343541' : '#f7f7f8',
    '&:hover': {
      backgroundColor: mode === 'light' ? '#eaeaea' : '#6e6e80',
    },
    '&.Mui-disabled': {
      backgroundColor: mode === 'light' ? '#f7f7f8' : '#444654',
      color: mode === 'light' ? '#bebebf' : '#6e6e80',
    },
    padding: 0.5,
  } as SxProps<Theme>,
});