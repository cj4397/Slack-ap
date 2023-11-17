'use client'
import { useMemo, createContext, useContext } from "react";

import useLocalStorage from "@/app/Storage";

// interface AuthContextProps {
//   userData: object | any;
//   user: Data;
//   signup: (data: { user_info?: object; user_data?: object }) => void;
//   login: (data: { user_info?: object; user_data?: object }) => void;
//   logout: () => void;
// }
// interface Data {
//   data: User
// }

// interface User {
//   id: number;
//   email: string;

// }

const initialState = {

  userData: {},
  user: { data: { id: 0, email: '' } },
  signup: (user_info?: object, user_data?: object) => { },
  login: (user_info?: object, user_data?: object) => { },
  logout: () => { },
};

const AuthContext = createContext(initialState);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function Auth(props: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage("User", '');
  const [userData, setUserData] = useLocalStorage("UserData", '');

  const login = (user_info?: object, user_data?: object) => {

    setUser(user_info);
    setUserData(user_data);
  };

  const signup = (user_info?: object, user_data?: object) => {

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
