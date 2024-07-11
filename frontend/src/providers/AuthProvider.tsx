import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../libs/axiosInstance";

interface AuthContextValue {
  token: null | string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  setToken: (newToken: any) => void;
}

const AuthContext = createContext<AuthContextValue>({ token: null, setToken: () => {} });

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const AuthProvider = ( children: any ) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Function to set the authentication token
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const setToken = (newToken: any) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      // biome-ignore lint/style/useTemplate: <explanation>
            axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token',token);
    } else {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      // biome-ignore lint/performance/noDelete: <explanation>
            delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
    }
  }, [token]);

  // Memoized value of the authentication context
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;