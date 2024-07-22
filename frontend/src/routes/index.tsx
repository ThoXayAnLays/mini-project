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
import OfferByNft from "../pages/OfferByNft";
import AuctionByNft from "../pages/AuctionByNft";
import CollectionDetail from "../pages/CollectionDetail";
import Offers from "../pages/Offer";
import Auction from "../pages/Auction";

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
        {
          path: "/collection/:collectionId",
          element: (
            <>
              <Header /> <CollectionDetail /> <Footer />
            </>
          ),
        },
        {
          path: "/offer-by-nft/:nftId",
          element: (
            <>
              <Header /> <OfferByNft /> <Footer />
            </>
          ),
        },{
          path: "/auction-by-nft/:nftId",
          element: (
            <>
              <Header /> <AuctionByNft /> <Footer />
            </>
          )
        },
        {
          path: "/offers/:nftId",
          element: (
            <>
              <Header /> <Offers /> <Footer />
            </>
          )
        },
        {
          path: "/auctions/:nftId",
          element: (
            <>
              <Header /> <Auction /> <Footer />
            </>
          )
        }
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
};

export default AppRoutes;
