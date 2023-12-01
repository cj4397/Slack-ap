import React from 'react'
import { getDatabase, set, ref, update, get, child, query, equalTo, orderByChild, onValue, serverTimestamp, remove } from 'firebase/database'
import { useAuth } from './firebaseAuth'

export default function FirebaseAPI() {
    const { user, email, userName }: any = useAuth()
    const db = getDatabase();
    const dbRef = ref(getDatabase())
    const re_email = email.split('.').join('')

    const getAllUsers = async () => {
        const dbRef = ref(db, '/users');
        let users: any = await []
        await onValue(dbRef, (snapshot) => {

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childKey !== re_email) {
                    users.push({ key: childKey, data: childData })
                }

            });

        })
        console.log(await users)
        return await users
    }

    const getUserDetails = async () => {
        // const dbRef = ref(getDatabase());
        let x: any
        const result: any = await get(child(dbRef, `users/${re_email}`)).then((snapshot) => {
            if (snapshot.exists()) {
                x = snapshot.val()
                // console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        console.log(x)
        return x
    }

    const getAllOnlineUsers = () => {
        const dbRef = ref(db, '/users');
        let users: any = []
        onValue(dbRef, (snapshot) => {

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData === 'online') {
                    users.push({ key: childKey, status: childData })
                }
            });

        })

        console.log(users)
        return users
    }

    const sendMessage = async (ID: string, message: string, sender: string) => {

        let email_list = [re_email, ID].sort()
        await set(ref(db, 'direct_message/' + email_list.join("+") + '/' + serverTimestamp()), {
            sender: sender,
            message: message
        }).catch((error) => {
            console.error(error);
        });
    }

    const sendGroupMessage = async (name: string, message: string, sender: string) => {

        await set(ref(db, `groups/${name}}/message/${serverTimestamp()}`), {
            sender: sender,
            message: message
        }).catch((error) => {
            console.error(error);
        });
    }

    const addFriend = async (friendname: string, FEmail: string) => {
        console.log(re_email)
        const friendEmail = FEmail.split('.').join('')
        await set(ref(db, 'users/' + re_email + "/" + 'friends' + "/" + friendEmail), {
            username: friendname
        }).catch((error) => {
            console.error(error);
        });
    }

    const createGroup = async (name: string) => {
        get(child(dbRef, `groups/${name}}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("already available");
            } else {
                console.log("No data available");
                set(ref(db, `groups/${name}}/member/${re_email}`), {
                    username: userName,
                    email: email,
                    admin: true
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, `groups/${name}}/member/officers/${re_email}`), {
                    username: userName,
                    admin: true
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, `users/${re_email}}/groups/${name}`), {
                    timestamp: serverTimestamp()
                }).catch((error) => {
                    console.error(error);
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const joinGroup = async (name: string) => {
        get(child(dbRef, `groups/${name}}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("already available");
            } else {
                console.log("No data available");
                set(ref(db, `groups/${name}}/join/${re_email}`), {
                    username: userName
                }).catch((error) => {
                    console.error(error);
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const acceptToGroup = async (name: string, userEmail: string, usersName: string) => {
        get(child(dbRef, `groups/${name}}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("already available");
            } else {
                console.log("No data available");
                set(ref(db, `groups/${name}}/member/${userEmail}`), {
                    username: usersName
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, `users/${re_email}}/groups/${name}`), {
                    timestamp: serverTimestamp()
                }).catch((error) => {
                    console.error(error);
                });

                remove(ref(db, `groups/${name}}/join/${userEmail}`))

            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const getFriends = async () => {
        const dbRef = ref(db, `/users/${re_email}/friends`);
        let friends: any = []
        await onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                friends.push({ email: childKey, data: childData })
            });
        })
        return friends
    }

    const getGroups = async () => {
        const dbRef = ref(db, `/users/${re_email}/groups`);
        let groups: any = []
        await onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                groups.push({ key: childKey, data: childData })
            });
        })
        return groups
    }


    return {
        getAllOnlineUsers,
        getAllUsers,
        getUserDetails,
        sendMessage,
        addFriend,
        createGroup,
        acceptToGroup,
        joinGroup,
        getFriends,
        getGroups,
        sendGroupMessage

    }
}
