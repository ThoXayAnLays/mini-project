import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useCallback, useEffect } from "react";

export const useLogout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setToken('');
    navigate("/", { replace: true });
  }, [navigate, setToken]);

  return { handleLogout };
};

const Logout = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <>Logout Page</>;
};

export default Logout;
