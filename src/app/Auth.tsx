'use client';
import { useMemo, createContext, useContext } from "react";
import useLocalStorage from "@/app/Storage";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export default function Auth(props: {
  children: React.ReactNode
}) {
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

  return <AuthContext.Provider value={value}> {props.children}</AuthContext.Provider>
}
