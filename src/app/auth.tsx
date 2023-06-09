'use client';
import { useMemo, createContext, useContext } from "react";

import useLocalStorage from "@/app/Storage";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function Datas(props: {
    children: React.ReactNode
}) {


    const [user, setUser] = useLocalStorage("User", null)
    const [user_data, setUserData] = useLocalStorage("UserData", null)
    const [userFriendList, setFriendList] = useLocalStorage("Friends", [])


    const login = (data: any) => {
        type data = {
            user_info?: object;
            user_data?: object;
        };
        console.log(data)
        const { user_info, user_data } = data
        setUser(user_info)
        setUserData(user_data)
    };

    const signup = (data: any) => {
        type data = {
            user_info?: object;
            user_data?: object;
        };
        const { user_info, user_data } = data
        setUser(user_info)
        setUserData(user_data)
    };

    const logout = () => {
        setUser(null);
        setUserData(null);
    };

    const addFriend = (data: any) => {
        if (userFriendList.findIndex((e: any) => e === data) === -1) {
            userFriendList.push(data)
        }

        setFriendList(userFriendList)
    }


    const value = useMemo(
        () => ({
            user_data,
            user,
            signup,
            login,
            logout,
            addFriend,
        }),
        [user]
    );

    console.log('hi')

    return <AuthContext.Provider value={value}> {props.children}</AuthContext.Provider>

}