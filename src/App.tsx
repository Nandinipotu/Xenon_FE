import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { AppThemeProvider } from './theme/ThemeProvider';
import Home from './pages/Home';
import Login from './components/login/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './routes/routes';

const App: React.FC = () => {

  

  return (
    <ThemeProvider>
      <AppThemeProvider>
      <BrowserRouter>
      <CssBaseline />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
          
        ))}
      </Routes>
    </BrowserRouter>
      </AppThemeProvider>
    </ThemeProvider>
  );
};

export default App;