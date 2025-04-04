import { SxProps, Theme } from '@mui/material';

interface HeaderStylesType {
  appBar: SxProps<Theme>;
  toolbar: SxProps<Theme>;
  leftContent: SxProps<Theme>;
  rightContent: SxProps<Theme>;
  logo: SxProps<Theme>;
  menuButton: SxProps<Theme>;
  navButton: SxProps<Theme>;
  signUpButton: SxProps<Theme>;
  avatar: SxProps<Theme>;
}

export const headerStyles = (mode: 'light' | 'dark'): HeaderStylesType => ({
  appBar: {
    backgroundColor: mode === 'light' ? '#ffffff' : '#343541',
    borderBottom: `1px solid ${mode === 'light' ? '#e5e5e5' : '#444654'}`,
    // zIndex: (theme) => theme.zIndex.drawer + 1,

  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: (theme) => theme.spacing(0, 1),
    // backgroundColor:"red",
    // minHeight: 'px',
  },
  leftContent: {
    display: 'flex',
    alignItems: 'center',
    marginLeft:"10px"
  },
  rightContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  menuButton: {
    marginRight: 1,
    padding: 0.5,
    '& svg': {
      fontSize: '20px', 
    }
  },
  navButton: {
    minWidth: 'auto',
    fontWeight: 500,
    fontSize: '12px',
  },
  signUpButton: {
    borderRadius: '4px',
    fontWeight: 500,
    fontSize: '14px',
    backgroundColor: mode === 'light' ? '#000000' : '#ffffff',
    color: mode === 'light' ? '#ffffff' : '#000000',
    '&:hover': {
      backgroundColor: mode === 'light' ? '#333333' : '#e0e0e0',
    },
  },
  avatar: {
    width: 28,
    height: 28,
    cursor: 'pointer',
  },
});