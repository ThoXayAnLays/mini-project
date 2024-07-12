import type React from "react";
import { useAuth } from "../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "./Logout";
import { me } from "../services/auth";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const [user, setUser] = useState();
  const location = useLocation();
  const { token } = useAuth();
  const excludedPaths = ["/login", "/register", "/verify-otp", "*"];
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const { handleLogout } = useLogout();

  useEffect(() => {
    const getProfile = async () => {
      // try {
      //   const { data } = await me(token);

      //   setUser({ username: data?.username, id: data?.user_id });
      // } catch (error) {
      //   if (error?.response?.status === 401) {
      //     return handleLogout();
      //   }

      //   toast.error("Something went wrong");
      //   console.log(error);
      // }
    };

    if (token) getProfile();
  }, [handleLogout, token]);

  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          {token ? (
            <>
              {/* <p className="text-xl text-black font-medium">
                Hello, <span className="font-semibold">{user?.username}</span>
              </p> */}
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
