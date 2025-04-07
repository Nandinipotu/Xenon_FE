import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import { homeStyles } from "./HomeStyles";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer/Footer";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
 
const Home: React.FC = () => {
  const { mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'guest' | 'google' | null>(null); // Tracks user type
  const styles = homeStyles(mode);
  const location = useLocation();
  const navigate = useNavigate();
  
 
  // Handle authentication check as the first effect
  useEffect(() => {
    const processGoogleAuth = () => {
      // Parse the URL parameters
      const params = new URLSearchParams(location.search);
      
      const name = params.get('name');
      const googleUserType = params.get('userType');
      const email = params.get('email');
      const picture = params.get('picture');
      const token = params.get('token');
      
      // Check if this is a Google auth redirect
      if (googleUserType === 'google' && token) {
        console.log("Google authentication detected in URL");
        
        // Store in cookies
        Cookies.set("jwt", token, { path: "/", secure: true, sameSite: "Strict" });
        Cookies.set("userType", 'google', { path: "/", secure: true, sameSite: "Strict" });
        
        if (email) {
          Cookies.set("email", email, { path: "/", secure: true, sameSite: "Strict" });
        }
        
        if (picture) {
          Cookies.set("picture", picture, { path: "/", secure: true, sameSite: "Strict" });
        }
        
        if (name) {
          Cookies.set("name", name, { path: "/", secure: true, sameSite: "Strict" });
        }
        
        // Set the state to force re-render with Google user type
        setUserType('google');
        
        // Remove the query parameters by redirecting to the clean URL
        // This is optional - only use if you want to clean the URL
        // navigate('/chatbot', { replace: true });
        
        console.log(" Google auth details stored in cookies");

        window.location.href = '/chatbot';
        return true;
      }
      return false;
    };

    const checkExistingAuth = () => {
      // Check cookies for existing auth
      const existingUserType = Cookies.get("userType");
      const token = Cookies.get("jwt");
      
      console.log("Checking existing auth - UserType:", existingUserType);
      console.log("Checking existing auth - Token:", token ? "exists" : "none");
      
      // Set user type state based on cookies
      if (existingUserType === 'google' || existingUserType === 'guest') {
        setUserType(existingUserType);
      }
    };
    
    // First try to process Google auth from URL
    const isGoogleAuth = processGoogleAuth();
    
    // If no Google auth in URL, check existing cookies
    if (!isGoogleAuth) {
      checkExistingAuth();
    }
    
    // Mark auth check as complete to allow rendering
    setAuthChecked(true);
    
  }, [location.search, navigate]);

  
  // Force component rerender after cookies are set
  useEffect(() => {
    // This will run after userType state is updated
    if (authChecked && userType) {
      console.log(" Component updated with userType:", userType);
    }
  }, [authChecked, userType]);
 
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
 
  // Don't render until auth is checked
  if (!authChecked) {
    return <div>Loading...</div>;
  }
 
  return (
    <Box sx={styles.root} display="flex" height="100vh">
      {/* Pass userType down to components that need it */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userType={userType} // Add this prop to your Sidebar component
      />
 
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s ease",
          marginLeft: sidebarOpen
            ? {
                xs: 0,
                sm: "250px",
              }
            : 0,
        }}
      >
        <Header 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen} 
          userType={userType} // Add this prop to your Header component
        />
 
        <Box component="main" sx={{ ...styles.content, pb: "28px" }}>
          <ChatArea /> {/* Add this prop to your ChatArea component */}
        </Box>
 
        <Footer sidebarOpen={sidebarOpen}  /> {/* Add this prop to your Footer component */}
      </Box>
    </Box>
  );
};
 
export default Home;