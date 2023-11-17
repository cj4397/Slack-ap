'use client'
import { useState, useEffect, useMemo, createContext, useContext } from "react";

import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import firebase_app from "./config";

const auth = getAuth(firebase_app)


const initialState = {
    user: {},

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

export default function FirebaseAuth(props: { children: React.ReactNode }) {
    const [user, setUser]: any = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser('');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = () => {
        signOut(auth)
        setUser('');
    };

    const value = useMemo(
        () => ({

            user,
            logout,
        }),
        [user]
    );


    return <AuthContext.Provider value={value}>{loading ? <div>Loading...</div> : props.children}</AuthContext.Provider>
}
