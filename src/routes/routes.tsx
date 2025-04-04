import React from "react";
import Home from "../pages/Home";
import Login from "../components/login/login";
import PageNotFound from "../pages/PageNotFound";
import PrivateRoute from "./privateRoutes";

export interface RouteType {
  path: string;
  element: React.ReactNode;
}

const routes: RouteType[] = [
  { path: "/", element: <Login /> },
  { path: "/chatbot", element: <PrivateRoute element={<Home />} /> },
  { path: "/chatbot/c/:sessionId", element: <PrivateRoute element={<Home />} /> },
  { path: "*", element: <PageNotFound /> },
];


export default routes;
