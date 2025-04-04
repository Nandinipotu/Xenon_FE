import React, { use, useEffect } from 'react';
import { Box, Button, Divider, Typography, TextField, Stack } from '@mui/material';
import { Google, Apple, Phone, Microsoft } from '@mui/icons-material';
import googleicon from '../../assets/google.png'
import microsofticon from '../../assets/microsoft.png'
import guesticon from '../../assets/guest2.png'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { useDispatch } from 'react-redux';
import { fetchGoogleAccount } from 'store/slices/login';
import { Guestlogin } from 'store/slices/guestLoginSlice';
import Cookies from 'js-cookie';
import AnimatedBackground from '../ThemeToggle/AnimatedBackground';


const Login: React.FC = () => {

    const navigate = useNavigate();

    const handleNavigate = async () => {
        try {
            // Check if the guest token already exists in cookies
            const guestToken = Cookies.get("jwt");
            
            if (!guestToken) {
                // Dispatch the Guestlogin action only if the token is not present
                const resultAction = await dispatch(Guestlogin());
    
                if (Guestlogin.fulfilled.match(resultAction)) {
                    console.log("Login successful:", resultAction.payload.token);
                    navigate('/chatbot');
                } else {
                    console.error("Login failed:", resultAction.payload);
                }
            } else {
                // If the token already exists, directly navigate to the chatbot page
                console.log("Guest token already exists:", guestToken);
                navigate('/chatbot');
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };
    
    
    
    

const dispatch = useAppDispatch();


const handleGoogleLogin = () => {
    
    // window.location.href = "http://localhost:8090/oauth2/authorization/google";
    window.location.href = "https://sparkapi-50025700077.development.catalystappsail.in/login/oauth2/code/google";
};





    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
            <AnimatedBackground />
            <Box width={400} p={4} >
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome back
                </Typography>



                <Stack spacing={2} sx={{ marginTop: 2 }}>
    <Button
                        className='continue_button'

        startIcon={
            <img
                src={googleicon}
                alt="Google"
                style={{ width: 20, height: 20 , marginRight: 8  }}
            />
        }
        fullWidth
        variant="outlined"
        onClick={handleGoogleLogin}
        style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '14px 16px', minHeight: 50 }}
    >
        Continue with Google
    </Button>
  
    <Button
                        className='continue_button'

        startIcon={
            <img
                src={guesticon}
                alt="Guest"
                style={{ width: 20, height: 20, marginRight: 7  }}
            />
        }
        onClick={handleNavigate}
        fullWidth
        variant="outlined"
        style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '14px 16px', minHeight: 50 ,}}
    >
        Continue as Guest
    </Button>
</Stack>


                {/* <Button
                    fullWidth
                    variant="contained"
                    className='continue_button'
                    // color="success"
                    size="large"
                    sx={{ mt: 5, mb: 2,padding: '14px 16px', minHeight: 50 }}
                >
                    Continue
                </Button> */}
            </Box>
        </Box>
    );
};

export default Login;
