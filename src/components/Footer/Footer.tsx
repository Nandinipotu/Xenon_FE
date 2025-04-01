import React, { useState } from 'react';
import { Box, Typography, useTheme as useMuiTheme, useMediaQuery, Dialog, DialogTitle, IconButton } from '@mui/material';
import { footerStyles } from './FooterStyles';
import { useTheme } from '../../context/ThemeContext';
import partyPopper from "../../assets/party-popper.png";
import dummyImage from "../../assets/dummy.webp";
import dummyImage1 from "../../assets/OIP.jpg";
import CloseIcon from '@mui/icons-material/Close';

const Footer: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const styles = footerStyles(mode, sidebarOpen);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const imageUrls = [
    { id: 1, url: dummyImage },
    { id: 2, url: dummyImage1 },
    { id: 1, url: dummyImage },
    { id: 2, url: dummyImage1 },
    { id: 1, url: dummyImage },
    { id: 2, url: dummyImage1 },
    // Add more items as needed
  ];

  return (
    <>
      <Box sx={styles.footer}>
        <Box sx={styles.contentContainer}>
          <Typography variant="caption" sx={styles.text}>
            API can make mistakes.
          </Typography>
          <Box sx={styles.iconContainer} onClick={handleClickOpen}>
            <img src={partyPopper} alt="Party Popper" style={styles.popperImage} />
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}  maxWidth="md">
      <DialogTitle sx={{ position: 'relative' }}>
  <IconButton 
    color="inherit" 
    onClick={handleClose} 
    sx={{
      position: 'absolute', // Ensure it's positioned absolutely
      top: 8, // Position the button 8px from the top
      right: 8, // Position the button 8px from the right
      padding: 0, // Remove padding to make the icon clickable without extra space
    }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>


  {/* Dialog content */}
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: 0, 
      padding: 4 
    }}
  >
    {/* Text Content */}
    <Typography variant="h6" gutterBottom>Our Team</Typography>
    <Typography variant="subtitle1" gutterBottom>
      Explore Our Success Stories and Innovative Projects
    </Typography>

    {/* Image Gallery */}
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 2, 
        marginTop: 2 
      }}
    >
      {imageUrls.map((image, index) => (
        <Box 
          key={image.id}  // Use image.id instead of index for better key uniqueness
          sx={{ 
            marginTop: index % 2 === 0 ? '20px' : '0px',  
            marginBottom: index % 2 !== 0 ? '20px' : '0px',
            position: 'relative', // To position the message overlay
            '&:hover .message': {
              opacity: 1, // Show message on hover
            },
          }}
        >
          <img 
            src={image.url}  // Use dynamic URL here
            alt={`Image ${image.id}`} 
            style={{ 
              width: '100px', 
              height: '200px', 
              borderRadius: '69px', 
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
              objectFit: 'cover',     
            }} 
          />
          {/* Message overlay */}
          <Box 
            className="message"
            sx={{
              position: 'absolute',
              top: '50%', 
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              opacity: 0, // Initially hidden
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            Send Wishes
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
</Dialog>


    </>
  );
};

export default Footer;
