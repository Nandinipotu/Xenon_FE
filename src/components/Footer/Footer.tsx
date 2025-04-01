import React, { useState } from 'react';
import { Box, Typography, useTheme as useMuiTheme, useMediaQuery, Dialog, DialogTitle, IconButton } from '@mui/material';
import { footerStyles } from './FooterStyles';
import { useTheme } from '../../context/ThemeContext';
import partyPopper from "../../assets/party-popper.png";
import CloseIcon from '@mui/icons-material/Close';
import { fetchTeamMember } from 'api/endpoints';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const Footer: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const styles = footerStyles(mode, sidebarOpen);

  const handleClickOpen = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTeamMember();
      setTeamMember(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
    finally {
      setLoading(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Create an array of 6 positions for the gallery
  const positions = Array(6).fill(0).map((_, index) => index);

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

      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle sx={{ position: 'relative' }}>
          <IconButton 
            color="inherit" 
            onClick={handleClose} 
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

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
          <Typography variant="h6" gutterBottom>Our Team</Typography>
          <Typography variant="subtitle1" gutterBottom>
            Explore Our Success Stories and Innovative Projects
          </Typography>

          {loading && <Typography variant="body2">Loading team member...</Typography>}
          {error && <Typography variant="body2" color="error">{error}</Typography>}

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
            {positions.map((index) => (
              <Box 
                key={index}
                sx={{ 
                  marginTop: index % 2 === 0 ? '20px' : '0px',  
                  marginBottom: index % 2 !== 0 ? '20px' : '0px',
                  position: 'relative',
                  '&:hover .info-overlay': {
                    opacity: 1,
                  },
                }}
              >
                <img 
                  src={teamMember?.picture || 'https://via.placeholder.com/100x200'}
                  alt={`Team member`} 
                  style={{ 
                    width: '100px', 
                    height: '200px', 
                    borderRadius: '69px', 
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                    objectFit: 'cover',     
                  }} 
                />
                <Box 
                  className="info-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '69px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Reduced opacity from 0.7 to 0.6
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    padding: '8px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                    textAlign: 'center',
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 0.5,
                      fontSize: '0.9rem' 
                    }}
                  >
                    {teamMember?.name || 'Loading...'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1.5, 
                      fontSize: '0.75rem', 
                      wordBreak: 'break-word', 
                      maxWidth: '90px'
                    }}
                  >
                    {teamMember?.email || 'loading@example.com'}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '3px 6px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.65rem', 
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '	#bbbbbb', 
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    Send Appreciation Mail
                  </Box>
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
