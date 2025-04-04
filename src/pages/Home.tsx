import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import { homeStyles } from "./HomeStyles";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer/Footer";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { fetchGoogleAccount } from "store/slices/login";
import { useAppDispatch } from "store";

const Home: React.FC = () => {
  const { mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useAppDispatch();
  const styles = homeStyles(mode);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("jwt");

      if (!token) {
        try {
          await dispatch(fetchGoogleAccount() as any).unwrap();
        } catch (error) {
          console.error("Google authentication failed:", error);
        }
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, [dispatch]);

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
