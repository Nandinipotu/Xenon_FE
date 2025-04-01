import { SxProps, Theme } from '@mui/material';

interface SidebarStylesType {
  drawer: SxProps<Theme>;
  drawerPaper: SxProps<Theme>;
  drawerHeader: SxProps<Theme>;
  closeButton: SxProps<Theme>;
  newChatButton: SxProps<Theme>;
  sectionTitle: SxProps<Theme>;
  list: SxProps<Theme>;
  listItem: SxProps<Theme>;
  listItemContent: SxProps<Theme>;
  listItemIcon: SxProps<Theme>;
  listItemText: SxProps<Theme>;
  divider: SxProps<Theme>;
  bottomList: SxProps<Theme>;
  bottomListItem: SxProps<Theme>;
  deleteDialog: SxProps<Theme>;
  dialogTitle: SxProps<Theme>;
  dialogContent: SxProps<Theme>;
  dialogContentText: SxProps<Theme>;
  dialogActions: SxProps<Theme>;
  cancelButton: SxProps<Theme>;
  deleteButton: SxProps<Theme>;
  menuPaper: SxProps<Theme>;
  menuItem: SxProps<Theme>;
}

export const sidebarStyles = (mode: 'light' | 'dark'): SidebarStylesType => ({
  drawer: {
    width: {
      xs: '80%', 
      sm: 280,
      md: 260
    },
    flexShrink: 0,
    cursor: 'pointer',
  },
  drawerPaper: {
    width: {
      xs: '80%', 
      sm: 280,
      md: 260
    },
    border: 'none',
    backgroundColor: mode === 'dark' ? '#202123' : '#f8f9fa',
    color: mode === 'dark' ? '#ffffff' : '#202123',
    boxSizing: 'border-box',
    // paddingTop: '70px',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 1,
  },
  closeButton: {
    color: mode === 'dark' ? '#ffffff' : '#202123',
  },
  newChatButton: {
    margin: (theme) => theme.spacing(1, 2),
    color: mode === 'dark' ? '#ffffff' : '#202123',
    fontSize: "14px",
    width:"80%",
    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-start',
    textAlign: 'left',
    '&:hover': {
      borderColor: mode === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
  },
  sectionTitle: {
    padding: (theme) => theme.spacing(1, 2),
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.6)',
    fontSize: '12px',
    marginTop: 2,
  },
  list: {
    padding: 0,
  },
  listItem: {
    padding: (theme) => theme.spacing(0.5, 1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-selected': {
      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      transition: 'all 0.3s ease-in-out',
    },
  },
  listItemContent: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: (theme) => theme.spacing(0.5, 0),
  },
  listItemIcon: {
    minWidth: 24,
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    marginRight: 1.5,
  },
  listItemText: {
    fontSize: '14px',
    fontWeight: 400,
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
  },
  divider: {
    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    margin: (theme) => theme.spacing(1, 0),
  },
  bottomList: {
    padding: 0,
  },
  bottomListItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: (theme) => theme.spacing(0.5, 2),
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
  },
  deleteDialog: {
    backgroundColor: mode === 'dark' ? '#2A2A2A' : '#FFFFFF',
    borderRadius: '12px',
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
    maxWidth: 400,
    width: '100%',
  },
  dialogTitle: {
    fontWeight: 600,
    fontSize: '18px',
    paddingTop: '24px',
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
  },
  dialogContent: {
    borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
    paddingBottom: '16px',
  },
  dialogContentText: {
    fontSize: '14px',
    marginBottom: '16px',
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
  },
  dialogActions: {
    padding: '16px',
    display: 'flex',
    gap: '8px',
  },
  cancelButton: {
    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    textTransform: 'none',
    borderRadius: '100px',
    padding: '6px 18px',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
    },
  },
  deleteButton: {
    backgroundColor: '#E53935',
    color: 'white',
    textTransform: 'none',
    borderRadius: '100px',
    padding: '6px 18px',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  },
  // Menu styles updated for proper theme switching
  menuPaper: {
    backgroundColor: mode === 'dark' ? '#2A2A2A' : '#FFFFFF',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
    borderRadius: '8px',
    minWidth: '160px',
  },
  menuItem: {
    fontSize: '14px',
    padding: '8px 16px',
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
  },
});