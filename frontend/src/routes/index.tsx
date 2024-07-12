// src/config/routes.ts
import type React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOTP";
import NotFound from "../pages/NotFound";
import ProfilePage from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswod from "../pages/ResetPassword";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AppRoutes: React.FC = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: (
        <>
          <Header /> <Home /> <Footer />
        </>
      ),
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/profile",
          element: (
            <>
              <Header /> <ProfilePage /> <Footer />
            </>
          ),
        },
        // {
        //   path: "/logout",
        //   element: <Logout />,
        // },
      ],
    },
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
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswod />,
    },
  ];

  const notFound = [
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    ...notFound,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;

  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/signup" element={<Register />} />
  //       <Route path="/verify-otp" element={<VerifyOtp />} />

  //         <Route path="/" element={<ProtectedRoute />}>
  //           <Route path="/profile" element={<ProfilePage />} />
  //           <Route path="/logout" element={<div>Logged out</div>} />
  //         </Route>

  //       <Route path="*" element={<NotFound />} />
  //     </Routes>
  //   </Router>
  // );
};

export default AppRoutes;
