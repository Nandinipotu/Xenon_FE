import { SxProps, Theme } from '@mui/material';

interface FooterStylesType {
  footer: SxProps<Theme>;
  contentContainer: SxProps<Theme>;
  text: SxProps<Theme>;
  iconContainer: SxProps<Theme>;
  popperImage: React.CSSProperties;
}

export const footerStyles = (mode: 'light' | 'dark', sidebarOpen: boolean): FooterStylesType => ({
  footer: {
    backgroundColor: mode === 'light' ? '#ffffff' : '#343541', 

    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '4px 0',
    height: '28px',
    transition: 'width 0.3s ease, left 0.3s ease',
    ...(sidebarOpen && {
      // marginLeft: '250px',
      width: {
        xs: '100%',
        sm: 'calc(100% - 250px)',
        md: 'calc(100% - 250px)',
      },
      left: {
        xs: '0',
        sm: '250px',
        md: '250px',
      },
    }),
  },
  contentContainer: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    px: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    color: mode === 'light' ? '#6e6e80' : '#c5c5d2',
    textAlign: 'center',
    fontSize: '0.7rem'
  },
  iconContainer: {
    position: 'fixed',
    right: '16px',
    bottom: '4px', 
    display: 'flex',
    alignItems: 'center',
    transition:"none"
  },
  popperImage: {
    width: "16px", 
    height: "16px",
    cursor: "pointer",
  },
});