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
import logo from '../../assets/logo.png';
import { Facebook, LinkedIn, Reddit, Twitter, Close,  } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';


interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { mode } = useTheme();
  const styles = headerStyles(mode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [openShareDialog, setOpenShareDialog] = useState(false);


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
  const [linkCreated, setLinkCreated] = useState(false);

  const handleCreateLink = () => {
    setLinkCreated(true);
    navigator.clipboard.writeText(window.location.href);
    // alert('Link created and copied to clipboard!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // alert('Link copied to clipboard!');
  };
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
         
  <img src={logo} alt="Logo" style={{ height: '30px', width: 'auto' }} />
</Typography>
   
          
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
  onClick={() => setOpenShareDialog(true)}
  sx={{
    border: '1px solid', 
    borderRadius: '20px',        
    padding: '4px 6px',         
   
  }}
>
  Share
</Button>


<Dialog
      open={openShareDialog}
      onClose={() => setOpenShareDialog(false)}      maxWidth="xs"
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
          <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          position: 'relative',
        }}
      >
        Public link created
        <IconButton
          onClick={() => setOpenShareDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#555',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#555',
          marginBottom: '12px',
        }}
      >
        A public link to your chat has been created. Manage previously shared chats at any time via 
        <a href="#" style={{ textDecoration: 'underline' }}> Settings</a>.
      </DialogContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#f1f1f1',
          borderRadius: '30px',
          marginBottom: '16px',
        }}
      >
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginRight: '8px',
            flex: 1,
          }}
        >
          {window.location.href}
        </Typography>
        <Button
          variant="contained"
          onClick={linkCreated ? handleCopyLink : handleCreateLink}
          sx={{
            color: '#fff',
            borderRadius: '20px',
            padding: '6px 16px',
          
          }}
        >
          {linkCreated ? 'Copy link' : 'Create link'}
        </Button>
      </Box>

      {linkCreated && (
         <DialogActions sx={{ justifyContent: 'center' }}>
         <IconButton
           size="large"
           aria-label="LinkedIn"
           onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
         >
           <LinkedIn />
         </IconButton>
         <IconButton
           size="large"
           aria-label="Facebook"
           onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
         >
           <Facebook />
         </IconButton>
         <IconButton
           size="large"
           aria-label="Reddit"
           onClick={() => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`, '_blank')}
         >
           <Reddit />
         </IconButton>
         <IconButton
           size="large"
           aria-label="Twitter"
           onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20out%20this%20chat!`, '_blank')}
         >
           <Twitter />
         </IconButton>
       </DialogActions>
      )}
    </Dialog>

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
  sx={{
    '& .MuiList-root': {
      listStyle: 'none',
      margin: 0,
      padding: '0px',
      outline: 0,
      
    },
    '& .MuiMenuItem-root': {
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // Space between icon and text
      
    },
  }}
>
  <MenuItem onClick={handleLogoutClick}>
    <LogoutIcon sx={{fontSize:"20px"}}  />
    Logout
  </MenuItem>
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
