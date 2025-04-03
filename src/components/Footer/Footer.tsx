import React, { useState} from 'react';
import { Box, Typography, useTheme as useMuiTheme, useMediaQuery, Dialog, DialogTitle, IconButton, CircularProgress } from '@mui/material';
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const styles = footerStyles(mode, sidebarOpen);

  const handleClickOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError('');
    try {
        const response = await fetchTeamMember();
        console.log("Raw API Response:", response);

        if (response && response.status === 200 && response.data && Array.isArray(response.data.data)) {
            setTeamMembers(response.data.data);
        } else {
            setError("Invalid API Response");
            setTeamMembers([]);
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setTeamMembers([]);
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log('Team Members being rendered:', teamMembers);

  return (
    <>
      <Box sx={styles.footer}>
        <Box sx={styles.contentContainer}>
          <Typography variant="caption" sx={styles.text}>
           Neural AI can make mistakes.
          </Typography>
          <Box sx={styles.iconContainer} onClick={handleClickOpen}>
            <img src={partyPopper} alt="Party Popper" style={styles.popperImage} />
          </Box>
        </Box>
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            padding: 2,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ position: 'relative', textAlign: 'center', paddingBottom: 0 }}>
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
          <Typography variant="h6">Our Team</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Explore Our Success Stories and Innovative Projects
          </Typography>
        </DialogTitle>

        <Box sx={{ p: 3, mt: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
            }}>
              {teamMembers.map((member, index) => (
                <Box 
                  key={member.id}
                  sx={{ 
                    position: 'relative',
                    width: '100px',
                    height: '200px',
                    marginTop: index % 2 === 0 ? '20px' : '0px',
                    marginBottom: index % 2 !== 0 ? '20px' : '0px',
                    '&:hover .info-overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  <img 
                    src={member.picture}
                    alt={`Team member - ${member.name}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
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
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
                        fontSize: '0.9rem',
                        wordBreak: 'break-word',
                        maxWidth: '90px',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.75rem', 
                        wordBreak: 'break-word', 
                        maxWidth: '90px',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {member.email}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Dialog>      
    </>
  );
};

export default Footer;