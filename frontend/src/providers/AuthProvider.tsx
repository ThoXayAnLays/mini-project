import type React from "react";
import { createContext, useState, useContext, useEffect, useMemo, type ReactNode } from "react";
import axiosInstance from "../libs/axiosInstance";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio: string;
  walletAddress: string;
  profilePicture: string | null;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface AuthContextValue {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

const AuthContext = createContext<AuthContextValue>({ token: null, setToken: () => {} });

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));

  const setToken = (newToken: string | null) => {
    if (newToken) {
      const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 1 day in milliseconds
      localStorage.setItem("token", newToken);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      // biome-ignore lint/performance/noDelete: <explanation>
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
    setToken_(newToken);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (expirationTime && new Date().getTime() > Number(expirationTime)) {
        setToken(null);
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // const setToken = (newToken: string | null) => {
  //   setToken_(newToken);
  // };

  // useEffect(() => {
  //   if (token) {
  //     // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  //     axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     localStorage.setItem("token", token);
  //   } else {
  //     // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  //     // biome-ignore lint/performance/noDelete: <explanation>
  //           delete axiosInstance.defaults.headers.common["Authorization"];
  //     localStorage.removeItem("token");
  //   }
  // }, [token]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const authContextValue = useMemo(() => ({ token, setToken }), [token]);
  const userContextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <UserContext.Provider value={userContextValue}>
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;


// import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
// import axiosInstance from "../libs/axiosInstance";

// interface AuthContextValue {
//   token: null | string;
//   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//   setToken: (newToken: any) => void;
// }

// const AuthContext = createContext<AuthContextValue>({ token: null, setToken: () => {} });

// interface AuthProviderProps {
//   children: ReactNode;
// }

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// const AuthProvider = ({ children }: AuthProviderProps) => {
//   // State to hold the authentication token
//   const [token, setToken_] = useState(localStorage.getItem("token"));

//   // Function to set the authentication token
//   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//   const setToken = (newToken: any) => {
//     setToken_(newToken);
//   };

//   useEffect(() => {
//     if (token) {
//       // biome-ignore lint/complexity/useLiteralKeys: <explanation>
//       // biome-ignore lint/style/useTemplate: <explanation>
//       axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
//       localStorage.setItem("token", token);
//     } else {
//       // biome-ignore lint/complexity/useLiteralKeys: <explanation>
//       // biome-ignore lint/performance/noDelete: <explanation>
//       delete axiosInstance.defaults.headers.common["Authorization"];
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   // Memoized value of the authentication context
//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   const contextValue = useMemo(
//     () => ({
//       token,
//       setToken,
//     }),
//     [token]
//   );

//   // Provide the authentication context to the children components
//   return (
//     <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export default AuthProvider;
