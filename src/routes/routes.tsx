import React from 'react';
import Home from '../pages/Home';
import Login from '../components/login/login';
// import About from '../pages/About';
// import Contact from '../pages/Contact';

export interface RouteType {
  path: string;
  element: React.ReactNode;
}

const routes: RouteType[] = [
    {path: '/', element: <Login />},
  { path: '/chatbot', element: <Home /> },
  { path: '/chatbot/:sessionId', element: <Home /> },
//   { path: '/about', element: <About /> },
//   { path: '/contact', element: <Contact /> },
];

export default routes;
