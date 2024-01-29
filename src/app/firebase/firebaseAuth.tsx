'use client'
import { useState, useEffect, useMemo, createContext, useContext } from "react";
import useLocalStorage from "../Storage";
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { getDatabase, set, ref, update, get, child, serverTimestamp } from 'firebase/database'
import firebase_app from "./config";



const auth: any = getAuth(firebase_app)



const initialState = {
    userName: '',
    email: '',
    createdAt: 0,
    friends: [{ details: { email: '', username: '', created_at: 0 }, name: '' }],
    groups: [{ details: { officer: false }, name: '' }],
    user: {},
    signIn: (email: string) => { },
    signUp: (name: string, email: string, uid: string) => { },
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
    const [email, setEmail] = useLocalStorage("Email", '');
    const [userName, setUserName] = useLocalStorage("Username", '');
    const [createdAt, setCreatedAt] = useLocalStorage("CreatedAt", 0);
    const [friends, setFriends] = useLocalStorage('Friends', [])
    const [groups, setGroups] = useLocalStorage('Groups', [])
    const [user, setUser]: any = useState('');
    const [loading, setLoading] = useState(true);

    const db = getDatabase();
    const dbRef = ref(getDatabase())






    useEffect(() => {

        const unsubscribe = () => {
            const result = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);

                    setEmail(user.email)
                } else {
                    setUser('');
                }
                setLoading(false);
            })
            return result
        };

        unsubscribe()
    }, []);



    const signIn = async (email: string) => {
        await update(ref(db, 'users/' + email.split('.').join('')), {
            status: 'online'
        });

        await get(child(dbRef, `users/${email.split('.').join('')}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                const result = snapshot.val()
                setCreatedAt(result.created_at)
                if (result.friends) {
                    let friendList = []
                    for (const [key, value] of Object.entries(result.friends)) {
                        friendList.push({ name: key, details: value })
                    }
                    setFriends(friendList)
                }

                if (result.groups) {
                    let groupList = []
                    for (const [key, value] of Object.entries(result.groups)) {
                        groupList.push({ name: key, details: value })
                    }
                    setGroups(groupList)
                }


                setUserName(result.username)

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    }

    const signUp = (name: string, email: string) => {
        setUserName(name)
        setEmail(email)
        setCreatedAt(serverTimestamp())
        set(ref(db, 'users/' + email.split('.').join('')), {
            username: name,
            email: email,
            created_at: serverTimestamp()
        });

    }



    const logout = async () => {
        await update(ref(db, 'users/' + email.split('.').join('')), {
            status: 'offline'
        });
        signOut(auth)
        setUser('')
        setUserName('')
        setEmail('')

    };

    const value = useMemo(
        () => ({
            friends,
            groups,
            signIn,
            signUp,
            user,
            logout,
            email,
            userName,
            createdAt
        }),
        [user]
    );


    return <AuthContext.Provider value={value}>
        {loading ? <div>Loading...</div> : props.children}
    </AuthContext.Provider>
}
