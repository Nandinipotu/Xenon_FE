import React, { useEffect } from 'react';
import { Box, Button, Divider, Typography, TextField, Stack } from '@mui/material';
import { Google, Apple, Phone, Microsoft } from '@mui/icons-material';
import googleicon from '../../assets/google.png'
import microsofticon from '../../assets/microsoft.png'
import guesticon from '../../assets/guest1.png'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { useDispatch } from 'react-redux';
import { fetchGoogleAccount } from 'store/slices/login';
import { Guestlogin } from 'store/slices/guestLoginSlice';


const Login: React.FC = () => {

    const navigate = useNavigate();

    const handleNavigate = async () => {
        try {
            const resultAction = await dispatch(Guestlogin());
    
            if (Guestlogin.fulfilled.match(resultAction)) {
                console.log('Login successful:', resultAction.payload.token);
                navigate('/chatbot');  
            } else {
                console.error('Login failed:', resultAction.payload);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    
    

const dispatch = useAppDispatch();


const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8090/oauth2/authorization/google';
}

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
            <Box width={400} p={4} >
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome back
                </Typography>



                <Stack spacing={2} sx={{ marginTop: 2 }}>
    <Button
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
    {/* <Button
        startIcon={
            <img
                src={microsofticon}
                alt="Microsoft"
                style={{ width: 20, height: 20,marginRight: 8  }}
            />
        }
        fullWidth
        variant="outlined"
        style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '14px 16px', minHeight: 50 }}
    >
        Continue with Microsoft Account
    </Button> */}
    <Button
        startIcon={
            <img
                src={guesticon}
                alt="Guest"
                style={{ width: 20, height: 20, marginRight: 8  }}
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


                <Button
                    fullWidth
                    variant="contained"
                    className='continue_button'
                    // color="success"
                    size="large"
                    sx={{ mt: 5, mb: 2,padding: '14px 16px', minHeight: 50 }}
                >
                    Continue
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
