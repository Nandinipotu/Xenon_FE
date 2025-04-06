import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import { homeStyles } from "./HomeStyles";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer/Footer";
import Cookies from "js-cookie";
 
const Home: React.FC = () => {
  const { mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const styles = homeStyles(mode);
 
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split("; ");
 
      const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
      const userTypeCookie = cookies.find((cookie) =>
        cookie.startsWith("userType=")
      );
 
      const token = jwtCookie?.split("=")[1];
      const userTypeRaw = userTypeCookie?.split("=")[1];
      const userType =
        userTypeRaw === "guest" || userTypeRaw === "google"
          ? userTypeRaw
          : null;
 
      console.log("✅ JWT Token from document.cookie:", token);
      console.log("👤 User Type from document.cookie:", userType);
 
      if (token) {
        // Save them into cookies using js-cookie for consistent access across your app
        Cookies.set("jwt", token, { path: "/", secure: true, sameSite: "Strict" });
      }
 
      if (userType) {
        Cookies.set("userType", userType, { path: "/", secure: true, sameSite: "Strict" });
      }
 
      setAuthChecked(true);
    };
 
    checkAuth();
  }, []);
 
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
 
  if (!authChecked) return <div></div>;
 
  return (
    <Box sx={styles.root} display="flex" height="100vh">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
 
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
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
 
        <Box component="main" sx={{ ...styles.content, pb: "28px" }}>
          <ChatArea />
        </Box>
 
        <Footer sidebarOpen={sidebarOpen} />
      </Box>
    </Box>
  );
};
 
export default Home;
 
 