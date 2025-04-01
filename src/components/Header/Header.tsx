import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { headerStyles } from './HeaderStyles';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { mode } = useTheme();
  const styles = headerStyles(mode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
      setAnchorEl(null);
  };

  const handleLogoutClick = () => {
      setAnchorEl(null);  
      setOpenDialog(true);  
  };

  const handleDialogClose = () => {
      setOpenDialog(false);
  };



  const navigate = useNavigate()

  const handleNavigateLogout = () => {
    navigate('/');
  }
  return (
    <AppBar
      position="fixed"
      color="inherit"
       className="custom-appbar"
      elevation={0}
      sx={{
    
        ...styles.appBar,
        transition: 'margin 0.3s ease, width 0.3s ease',
        marginLeft: sidebarOpen ? '250px' : '0',          
        width: `calc(100% - ${sidebarOpen ? '250px' : '0'})`, 
        height:"50px",
        marginTop:"-12px"
      }}
    >
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.leftContent}>
        <IconButton
  edge="start"
  color="inherit"
  aria-label="menu"
  onClick={toggleSidebar}
  sx={{ ...styles.menuButton, display: sidebarOpen ? 'none' : 'block' }}
>
  <MenuIcon />
</IconButton>
          <Typography variant="h6" component="div" sx={styles.logo}>
            
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ThemeToggle />
            <Avatar 
                onClick={handleAvatarClick} 
                sx={{ cursor: 'pointer', bgcolor: 'primary.main',        width: 24,  // Smaller width
                  height: 24, 
                  fontSize: '0.875rem'  }}
            >
                U
            </Avatar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem  className="Header_menu" onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>

            <Dialog
    open={openDialog}
    onClose={handleDialogClose}
    // fullWidth
    maxWidth="xs"
    PaperProps={{
        style: {
            borderRadius: '16px',  // Rounded corners
            padding: '10px',       // Inner padding
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',  // Soft shadow
        },
    }}
>
    <DialogTitle
        sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.25rem',
        }}
    >
          Are you sure you want <br/> to logout?
    </DialogTitle>
    <DialogContent
        sx={{
            textAlign: 'center',
            fontSize: '1rem',
            // color: '#555',
            marginBottom: '16px',
        }}
    >
         logout of chatbot?
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', gap: 2, display: 'flex', flexDirection: 'column-reverse' }}>
        <Button
            onClick={handleDialogClose}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: '12px', padding: '6px 24px' }}
        >
            Cancel
        </Button>
        <Button
            onClick={handleNavigateLogout}
            // color="error"
            variant="contained"
          
            fullWidth
            sx={{ borderRadius: '12px', padding: '6px 24px' }}
        >
            Logout
        </Button>
    </DialogActions>
</Dialog>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
