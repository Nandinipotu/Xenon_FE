import React from 'react';
import Home from '../pages/Home';
import Login from '../components/login/login';

export interface RouteType {
  path: string;
  element: React.ReactNode;
}

const routes: RouteType[] = [
    {path: '/', element: <Login />},
  { path: '/chatbot', element: <Home /> },
];

export default routes;
