import type React from "react";
import { useAuth, useUser } from "../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "./Logout";
import { me } from "../services/auth";
import { toast } from "react-toastify";

interface UserProfile {
  username: string;
  email: string;
  profilePicture: string | null;
}

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const location = useLocation();
  const { token } = useAuth();
  const excludedPaths = ["/login", "/register", "/verify-otp", "*"];
  const defaultAvatar = 'src/assets/default_avatar.png'
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const { handleLogout } = useLogout();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await me(token);
        console.log("User: ", response);
        
        setUser(response.user);
      } catch (error) {
        toast.error("Failed to fetch user profile");
      }
    };

    if (token) getProfile();
  }, [handleLogout, token, setUser]);

  return (
    <>
      <header className="bg-white shadow-md">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-semibold text-gray-700">Home</Link>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              {user && (
                <div className="flex items-center space-x-2">
                  <img src={user.profilePicture || defaultAvatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <p className="text-lg text-gray-700">Hello, <span className="font-semibold">{user.username}</span></p>
                </div>
              )}
              <Link to="/profile" className="text-lg text-gray-700">Profile</Link>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button onClick={handleLogout} className="text-lg text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg text-gray-700">Login</Link>
              <Link to="/signup" className="text-lg text-gray-700">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
    </>
  );
};

export default Header;
