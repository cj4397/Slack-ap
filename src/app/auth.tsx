'use client'
import { useMemo, createContext, useContext } from "react";

import useLocalStorage from "@/app/Storage";

interface AuthContextProps {
  userData: object | null;
  user: any | null;
  signup: (data: { user_info?: object; user_data?: object }) => void;
  login: (data: { user_info?: object; user_data?: object }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function Auth(props: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage("User", null);
  const [userData, setUserData] = useLocalStorage("UserData", null);

  const login = (data: { user_info?: object; user_data?: object }) => {
    const { user_info, user_data } = data;
    setUser(user_info);
    setUserData(user_data);
  };

  const signup = (data: { user_info?: object; user_data?: object }) => {
    const { user_info, user_data } = data;
    setUser(user_info);
    setUserData(user_data);
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
  };

  const value = useMemo(
    () => ({
      userData,
      user,
      signup,
      login,
      logout,
    }),
    [userData, user]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
