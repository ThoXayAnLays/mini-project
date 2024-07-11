// src/config/routes.ts
import type React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOTP";

const AppRoutes: React.FC = () => {
  const token = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/profile",
      element: <div>User Profile</div>,
    },
    // {
    //   path: "/logout",
    //   element: <Logout />,
    // },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Register />,
    },
    {
      path: "/verify-otp",
      element: <VerifyOtp />,
    },
  ];

  return (
    <Router>
      <Routes>
        {/* Routes accessible to all users */}
        <Route path="/" element={<Home />} />

        {/* Routes accessible only to authenticated users */}
        {token && routesForAuthenticatedOnly.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Routes accessible only to non-authenticated users */}
        {!token && routesForNotAuthenticatedOnly.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
