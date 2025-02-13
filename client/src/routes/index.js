import React from "react";
import { Navigate } from "react-router-dom";

// Authentication related pages
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import Logout from "../pages/logout";
import HomePage from "../pages/home";
import InvoicePage from "../pages/Invoice";
import { AdminLogin } from "../pages/admin-login";
import { AdminRegister } from "../pages/admin-register";


const authProtectedRoutes = [
  // this route should be at the end of all other routes
  { path: "/home", component: <HomePage /> },
  { path: "/invoice", component: <InvoicePage /> },
];

const publicRoutes = [
  { path: "/", component: <Login /> },
  { path: "/admin-login", component: <AdminLogin /> },
  { path: "/admin-register", component: <AdminRegister /> },
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "/logout", component: <Logout /> },
  { path: "*", component: <Navigate to="/login" /> }
];

export { authProtectedRoutes, publicRoutes };
