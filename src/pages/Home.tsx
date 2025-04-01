import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatArea from '../components/ChatArea/ChatArea';
import { homeStyles } from './HomeStyles';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer/Footer';

const Home: React.FC = () => {
  const { mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const styles = homeStyles(mode);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={styles.root} display="flex" height="100vh">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        sx={{
          flexGrow: 1,
          transition: 'margin 0.3s ease',
          marginLeft: sidebarOpen ? {
            xs: 0,
            sm: '250px',
          } : 0,
        }}
      >
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <Box component="main" sx={{...styles.content, pb:"28px",}}>
          <ChatArea />
        </Box>

        <Footer sidebarOpen={sidebarOpen} />
      </Box>
    </Box>
  );
};

export default Home;
