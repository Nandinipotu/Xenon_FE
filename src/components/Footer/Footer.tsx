// import React, { useState} from 'react';
// import { Box, Typography, useTheme as useMuiTheme, useMediaQuery, Dialog, DialogTitle, IconButton } from '@mui/material';
// import { footerStyles } from './FooterStyles';
// import { useTheme } from '../../context/ThemeContext';
// import partyPopper from "../../assets/party-popper.png";
// import CloseIcon from '@mui/icons-material/Close';
// import lnImage from "../../assets/ln3.jpg";
// import nandhiniImage from "../../assets/nandhini2.jpg";
// import arulImage from "../../assets/arul.jpg";
// import hariImage from "../../assets/hari2.jpg";
// import lpImage from "../../assets/logapriyan3.jpg";
// import jpImage from "../../assets/jayapriya.jpg";

// interface TeamMember {
//   id: string;
//   name: string;
//   email: string;
//   picture: string;
// }

// const Footer: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
//   const [open, setOpen] = useState(false);
//   const { mode } = useTheme();
//   const muiTheme = useMuiTheme();
//   const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(muiTheme.breakpoints.down('md'));
//   const styles = footerStyles(mode, sidebarOpen);

//   // Static team members data
//   const teamMembers: TeamMember[] = [
//     {
//       id: "1",
//       name: "Lakshmi Narayanan",
//       email: "lnarayanan.b@hepl.com",
//       picture: lnImage
//     },
//     {
//       id: "2",
//       name: "Arul",
//       email: "arul.s@hepl.com",
//       picture: arulImage
//     },
//     {
//       id: "3",
//       name: "Potu Nandini",
//       email: "nandini.ve@hepl.com",
//       picture: nandhiniImage
//     },
//     {
//       id: "4",
//       name: "Harihara Guru",
//       email: "harihara.m@hepl.com",
//       picture: hariImage
//     },
//     {
//       id: "5",
//       name: "Logapriyan",
//       email: "logapriyan.p@hepl.com",
//       picture: lpImage
//     },
//     {
//       id: "6",
//       name: "Jayapriya",
//       email: "jayapriya.s@hepl.com",
//       picture: jpImage
//     }
//   ];

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   // Calculate sizes based on screen width
//   const getMemberSize = () => {
//     if (isMobile) return { width: '70px', height: '140px' };
//     if (isTablet) return { width: '80px', height: '160px' };
//     return { width: '90px', height: '180px' };
//   };

//   const { width, height } = getMemberSize();

//   // Calculate the offset amount for the up-down pattern
//   const getOffset = () => {
//     if (isMobile) return 20;
//     if (isTablet) return 25;
//     return 30;
//   };

//   const offset = getOffset();

//   return (
//     <>
//       <Box sx={styles.footer}>
//         <Box sx={styles.contentContainer}>
//           <Typography variant="caption" sx={styles.text}>
//            Neural AI can make mistakes.
//           </Typography>
//           <Box sx={styles.iconContainer} onClick={handleClickOpen}>
//             <img src={partyPopper} alt="Party Popper" style={styles.popperImage} />
//           </Box>
//         </Box>
//       </Box>

//       <Dialog 
//         open={open} 
//         onClose={handleClose} 
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: { 
//             borderRadius: 2,
//             padding: { xs: 1, sm: 2 },
//             maxHeight: '80vh',
//             margin: { xs: '10px', sm: '20px' },
//             width: { xs: 'calc(100% - 20px)', sm: 'calc(100% - 40px)' }
//           }
//         }}
//       >
//         <DialogTitle sx={{ position: 'relative', textAlign: 'center', paddingBottom: 0, paddingTop: { xs: 1, sm: 2 } }}>
//           <IconButton 
//             color="inherit" 
//             onClick={handleClose} 
//             sx={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               padding: 0,
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Typography variant="h6">Neural AI Development Team</Typography>
//           <Typography variant="subtitle1" sx={{ mt: 1 }}>
//           </Typography>
//         </DialogTitle>

//         <Box sx={{ 
//           p: { xs: 1, sm: 2 }, 
//           mt: 1,
//           display: 'flex',
//           justifyContent: 'center',
//           overflowX: 'auto'
//         }}>
//           <Box sx={{ 
//             display: 'flex',
//             flexWrap: 'wrap',
//             justifyContent: 'center',
//             gap: { xs: 2, sm: 3, md: 4 }, 
//             alignItems: 'flex-start',  // Changed to flex-start to support the up/down pattern
//             maxWidth: '100%',
//             minHeight: { xs: '160px', sm: '200px', md: '240px' },  // Added minimum height to accommodate offset
//             py: { xs: 2, sm: 3, md: 4 },  // Added padding for visual spacing
//           }}>
//             {teamMembers.map((member, index) => (
//               <Box 
//                 key={member.id}
//                 sx={{ 
//                   position: 'relative',
//                   width: width,
//                   height: height,
//                   marginTop: index % 2 === 0 ? 0 : `${offset}px`,  // Apply offset to odd indices using margin
//                   transition: 'margin 0.3s ease',  // Smooth transition for the offset
//                   flexShrink: 0,  // Prevent the items from shrinking
//                   '&:hover .info-overlay': {
//                     opacity: 1,
//                   },
//                 }}
//               >
//                 <img 
//                   src={member.picture}
//                   alt={`Team member - ${member.name}`} 
//                   style={{ 
//                     width: '100%', 
//                     height: '100%', 
//                     borderRadius: '69px', 
//                     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
//                     objectFit: 'cover',     
//                   }} 
//                 />
//                 <Box 
//                   className="info-overlay"
//                   sx={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     borderRadius: '69px',
//                     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     color: 'white',
//                     padding: '4px',
//                     opacity: 0,
//                     transition: 'opacity 0.3s ease-in-out',
//                     textAlign: 'center',
//                   }}
//                 >
//                   <Typography 
//                     variant="subtitle2" 
//                     sx={{ 
//                       fontWeight: 'bold', 
//                       mb: 0.5,
//                       fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
//                       wordBreak: 'break-word',
//                       maxWidth: '90%',
//                       overflowWrap: 'break-word'
//                     }}
//                   >
//                     {member.name}
//                   </Typography>
//                   <Typography 
//                     variant="body2" 
//                     sx={{ 
//                       fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' }, 
//                       wordBreak: 'break-word', 
//                       maxWidth: '90%',
//                       overflowWrap: 'break-word'
//                     }}
//                   >
//                     {member.email}
//                   </Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       </Dialog>      
//     </>
//   );
// };

// export default Footer;


import React, { useState } from 'react';
import { Box, Typography, useTheme as useMuiTheme, useMediaQuery, Dialog, DialogTitle, IconButton, Button, Snackbar, Alert } from '@mui/material';
import { footerStyles } from './FooterStyles';
import { useTheme } from '../../context/ThemeContext';
import partyPopper from "../../assets/party-popper.png";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import lnImage from "../../assets/ln3.jpg";
import nandhiniImage from "../../assets/nandhini2.jpg";
import arulImage from "../../assets/arul.jpg";
import hariImage from "../../assets/hari2.jpg";
import lpImage from "../../assets/logapriyan3.jpg";
import jpImage from "../../assets/jayapriya.jpg";
import { MdSend } from "react-icons/md";
import { sendAppreciationMail } from '../../api/endpoints'; // Import from your endpoints file

// for fetch token from cookies 
// import { getSenderEmailFromToken } from '../../utils/tokenUtils'; // Import from token utils

interface TeamMember {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const Footer: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('md'));
  const styles = footerStyles(mode, sidebarOpen);

  // Static team members data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Lakshmi Narayanan",
      email: "lnarayanan.b@hepl.com",
      picture: lnImage
    },
    {
      id: "2",
      name: "Arul",
      email: "arul.s@hepl.com",
      picture: arulImage
    },
    {
      id: "3",
      name: "Potu Nandini",
      email: "nandini.ve@hepl.com",
      picture: nandhiniImage
    },
    {
      id: "4",
      name: "Harihara Guru",
      email: "harihara.m@hepl.com",
      picture: hariImage
    },
    {
      id: "5",
      name: "Logapriyan",
      email: "logapriyan.p@hepl.com",
      picture: lpImage
    },
    {
      id: "6",
      name: "Jayapriya",
      email: "jayapriya.s@hepl.com",
      picture: jpImage
    }
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Function to send appreciation email
  const handleSendAppreciation = async (receiverEmail: string) => {
    try {

      // to fetch token from cookies 


      // const senderEmail = getSenderEmailFromToken();
      
      // if (!senderEmail) {
      //   setSnackbarMessage('Unable to get your email from session. Please log in again.');
      //   setSnackbarSeverity('error');
      //   setSnackbarOpen(true);
      //   return;
      // }

      const senderEmail = "hariharaguru@gmail.com";

      // Call the API to send email using the endpoint function
      await sendAppreciationMail(receiverEmail, senderEmail);
      
      setSnackbarMessage(`Appreciation email sent successfully to ${receiverEmail}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending appreciation email:', error);
      setSnackbarMessage('Failed to send appreciation email. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Calculate sizes based on screen width
  const getMemberSize = () => {
    if (isMobile) return { width: '70px', height: '140px' };
    if (isTablet) return { width: '80px', height: '160px' };
    return { width: '90px', height: '180px' };
  };

  const { width, height } = getMemberSize();

  // Calculate the offset amount for the up-down pattern
  const getOffset = () => {
    if (isMobile) return 20;
    if (isTablet) return 25;
    return 30;
  };

  const offset = getOffset();

  return (
    <>
      <Box sx={styles.footer}>
        <Box sx={styles.contentContainer}>
          <Typography variant="caption" sx={styles.text}>
           Neural AI can make mistakes.
          </Typography>
          {/* {userType === "google" && ( */}
          <Box sx={styles.iconContainer} onClick={handleClickOpen}>
            <img src={partyPopper} alt="Party Popper" style={styles.popperImage} />
          </Box>
          {/* )} */}
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
            padding: { xs: 1, sm: 2 },
            maxHeight: '80vh',
            margin: { xs: '10px', sm: '20px' },
            width: { xs: 'calc(100% - 20px)', sm: 'calc(100% - 40px)' }
          }
        }}
      >
        <DialogTitle sx={{ position: 'relative', textAlign: 'center', paddingBottom: 0, paddingTop: { xs: 1, sm: 2 } }}>
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
          <Typography variant="h6" sx={{fontWeight: 'bold',}}>
            Neural AI Development Team</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
          </Typography>
        </DialogTitle>

        <Box sx={{ 
          p: { xs: 1, sm: 2 }, 
          mt: 1,
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 2, sm: 3, md: 4 }, 
            alignItems: 'flex-start',
            maxWidth: '100%',
            minHeight: { xs: '160px', sm: '200px', md: '240px' },
            py: { xs: 2, sm: 3, md: 4 },
          }}>
            {teamMembers.map((member, index) => (
              <Box 
                key={member.id}
                sx={{ 
                  position: 'relative',
                  width: width,
                  height: height,
                  marginTop: index % 2 === 0 ? 0 : `${offset}px`,
                  transition: 'margin 0.3s ease',
                  flexShrink: 0,
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
                    padding: '4px',
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
                      fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                      wordBreak: 'break-word',
                      maxWidth: '90%',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' }, 
                      wordBreak: 'break-word', 
                      maxWidth: '90%',
                      overflowWrap: 'break-word',
                      mb: 1
                    }}
                  >
                    {member.email}
                  </Typography>
                  <Box
  component="span"
  onClick={(e) => {
    e.stopPropagation();
    handleSendAppreciation(member.email);
  }}
  sx={{
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '50%', // Circular icon button
    fontSize: { xs: '1rem', sm: '1.2rem' }, // Adjust icon size
    padding: { xs: '6px', sm: '8px' }, // Space around the icon
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: { xs: '32px', sm: '36px' }, // Adjust the button size
    height: { xs: '32px', sm: '36px' },
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#191970',
      color: 'white',
    },
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }}
>
  <MdSend />
</Box>

                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Dialog>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>      
    </>
  );
};

export default Footer;