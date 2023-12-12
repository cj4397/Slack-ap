import React from 'react'
import { getDatabase, set, ref, get, child, onValue, serverTimestamp, remove } from 'firebase/database'
import { useAuth } from './firebaseAuth'
import { forEachChild } from 'typescript'

interface Data {
    email: string,
    username: string,
    created_at: number
}

export default function FirebaseAPI() {
    const { email, userName } = useAuth()
    const db = getDatabase();
    const dbRef = ref(getDatabase())
    const re_email: string = email.split('.').join('')


    const getAllUsers = () => {
        const dbRef = ref(db, '/users');
        let users: { key: string, data: Data }[] = []
        onValue(dbRef, (snapshot) => {

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childKey !== re_email) {
                    users.push({ key: childKey, data: childData })
                }
            });

        })
        return users
    }

    const getAllGroups = (groups: string[]) => {
        const dbRef = ref(db, '/Groups');
        let groupList: { group: string, members: { emailKey: Data }[] }[] = []
        onValue(dbRef, (snapshot) => {

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (!groups.includes(childKey)) {
                    groupList.push({ group: childKey, members: childData.member })
                }

            });

        })
        console.log(groupList)
        return groupList
    }


    const getUserDetails = async () => {
        interface User {
            created_at: number, username: string, email: string
        }

        interface Data {
            username: string,
            email: string,
            notification: unknown
        }



        let userDetails: User | undefined
        let friendList: { email: string, username: string }[] = []
        let groupList: string[] = []

        await get(child(dbRef, `users/${re_email}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val()

                const test = (value: unknown): value is Data => {
                    if (typeof value != "object") {
                        throw new Error(`Unexpected type: ${typeof value}`);
                    }
                    if (value == null) {
                        throw new Error("Unexpected value: null");
                    }
                    return true;
                }


                userDetails = {
                    created_at: x.created_at,
                    email: x.email,
                    username: x.username
                }
                if (x.friends) {
                    let Flist = []

                    for (const [key, value] of Object.entries(x.friends)) {
                        try {
                            if (test(value)) {
                                Flist.push({ email: value.email, username: value.username })
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    friendList = Flist
                }

                if (x.groups) {
                    let Glist = []

                    for (const [key, value] of Object.entries(x.groups)) {

                        Glist.push(key)


                        // console.log(`${key}: ${value}`);
                    }
                    groupList = Glist

                }


                // console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });


        return { details: userDetails, friends: friendList, groups: groupList }

    }


    const getAllOnlineUsers = async () => {
        // const dbRef = ref(db, '/users');
        let users: any = []

        // onValue(dbRef, (snapshot) => {
        await get(child(dbRef, `/users`)).then((snapshot) => {

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(childKey)
                // console.log(childData)
                if (childData.status === 'online' && childKey !== re_email) {
                    // console.log(re_email)
                    users.push(childData.email)
                }
            });

        })

        console.log(users)
        return users
    }


    const getAllFriendConnections = async () => {
        // const dbRef = ref(db, '/direct_message');
        interface User {
            username: string
        }

        let users: { email: string, data: User }[] = []
        await get(child(dbRef, `/direct_message`)).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();

                if (childKey.includes(re_email)) {
                    for (const [email, data] of Object.entries(childData.member)) {
                        if (email !== re_email) {
                            const x = (value: unknown): value is User => {
                                if (typeof value != "object") {
                                    throw new Error(`Unexpected type: ${typeof value}`);
                                }
                                if (value == null) {
                                    throw new Error("Unexpected value: null");
                                }
                                return true;
                            }

                            try {
                                if (x(data)) {
                                    users.push({ email, data: data })
                                }
                            } catch (e) {
                                console.log(e)
                            }


                        }
                    }
                }
            });

        }).catch((error) => {
            console.error("No Direct Messages made");
            return 'No Direct Messages made'
        });




        // onValue(dbRef, (snapshot) => {

        //     snapshot.forEach((childSnapshot) => {
        //         const childKey = childSnapshot.key;
        //         const childData = childSnapshot.val();

        //         if (childKey.includes(re_email)) {
        //             for (const [email, data] of Object.entries(childData.member)) {
        //                 if (email !== re_email) {
        //                     users.push({ email, data })
        //                 }
        //             }
        //         }
        //     });
        // })

        console.log(users)
        return users
    }

    const getAllConversations = async () => {

        interface User {
            email: string,
            username: string
        }

        let users: { email: string, username: string }[] = []
        await get(child(dbRef, `/direct_message`)).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();

                if (childKey.includes(re_email)) {
                    for (const [email, data] of Object.entries(childData.member)) {
                        if (email !== re_email) {
                            const x = (value: unknown): value is User => {
                                if (typeof value != "object") {
                                    throw new Error(`Unexpected type: ${typeof value}`);
                                }
                                if (value == null) {
                                    throw new Error("Unexpected value: null");
                                }
                                return true;
                            }

                            try {
                                if (x(data)) {
                                    users.push({ email: data.email, username: data.username })
                                }
                            } catch (e) {
                                console.log(e)
                            }


                        }
                    }
                }
            });

        }).catch((error) => {
            console.error(error);
        });


        console.log(users)
        return users
    }


    const getConversationMessage = async (FEmail: string, friend: string) => {
        interface Message {
            sender: string,
            message: string,
            created_at: number
        }
        const friendEmail = FEmail.split('.').join('')
        let email_list = [re_email, friendEmail].sort()
        let users: { timestamp: number, data: Message }[] = []
        let members = false
        let chat = false

        await get(child(dbRef, '/direct_message/' + email_list.join("+"))).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((value) => {
                    const key = value.key
                    const data = value.val()
                    if (key === 'member') {
                        members = true
                    }
                    if (key === 'messages') {
                        chat = true
                    }
                })
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        if (!members) {
            await set(ref(db, '/direct_message/' + email_list.join("+") + '/member/' + friendEmail), {
                created_at: serverTimestamp(),
                username: friend,
                email: FEmail
            }).catch((error) => {
                console.error(error);
            });
            await set(ref(db, '/direct_message/' + email_list.join("+") + '/member/' + re_email), {
                created_at: serverTimestamp(),
                username: userName,
                email: email
            }).catch((error) => {
                console.error(error);
            });

        }

        if (chat) {
            await get(child(dbRef, '/direct_message/' + email_list.join("+") + '/messages/')).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((value) => {
                        const timestamp = value.key
                        const data = value.val()
                        users.push({ timestamp: Number(timestamp), data })
                    })
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
            return users
        } else {
            return 'No Conversations made'
        }
    }


    const sendMessage = async (FEmail: string, message: string, sender: string) => {
        const friendEmail = FEmail.split('.').join('')
        let email_list = [re_email, friendEmail].sort()
        const d = new Date();
        let time = d.getTime();


        await set(ref(db, '/direct_message/' + email_list.join("+") + '/messages/' + time), {
            created_at: serverTimestamp(),
            sender: userName,
            message: message
        }).catch((error) => {
            console.error(error);
        });
        await set(ref(db, '/users/' + friendEmail + '/friends' + '/notification/' + time), {
            created_at: serverTimestamp(),
            sender: userName,
            message: message
        }).catch((error) => {
            console.error(error);
        });
    }




    const sendFriendRequest = async (FEmail: string) => {
        const friendEmail = FEmail.split('.').join('')
        await get(child(dbRef, '/users/' + friendEmail + '/friends/' + 'request/' + re_email)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Duplicated Friend Request");
            } else {
                set(ref(db, '/users/' + friendEmail + '/friends/' + 'request/' + re_email), {
                    username: userName,
                    email: email
                }).catch((error) => {
                    console.error(error);
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }


    const acceptFriend = async (friendname: string, FEmail: string) => {
        const d = new Date();
        let time = d.getTime()
        console.log(time)
        const friendEmail = FEmail.split('.').join('')
        let email_list = [re_email, friendEmail].sort().join('+')
        await get(child(dbRef, 'users/' + re_email + "/" + 'friends/' + 'request/' + friendEmail)).then((snapshot) => {
            if (snapshot.exists()) {
                set(ref(db, 'users/' + re_email + "/" + 'friends/' + email_list), {
                    username: friendname,
                    email: FEmail,
                    created_at: serverTimestamp()
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, 'users/' + friendEmail + "/" + 'friends/' + email_list + '/notification/' + time), {
                    sender: userName,
                    message: 'We are now Friends'
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, 'users/' + friendEmail + "/" + 'friends/' + email_list), {
                    username: userName,
                    email: email
                }).catch((error) => {
                    console.error(error);
                });

                remove(ref(db, 'users/' + re_email + "/" + 'friends/' + 'request/' + friendEmail))
            } else {
                console.log("No Friend Request Found");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const getFriendRequest = async () => {


        let users: { email: string, username: string }[] = []

        await get(child(dbRef, '/users/' + re_email + "/" + 'friends/' + 'request')).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    users.push({ email: childData.email, username: childData.username })
                });


            } else {
                console.log("No Friend Request Found");
            }
        }).catch((error) => {
            console.error(error);
        });
        return users
    }


    const createGroup = async (name: string) => {
        get(child(dbRef, `groups/${name}}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Duplicated Group Name");
            } else {

                set(ref(db, `groups/${name}/member/${re_email}`), {
                    username: userName,
                    email: email,
                    admin: true
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, `groups/${name}/officers/${re_email}`), {
                    username: userName,
                    admin: true
                }).catch((error) => {
                    console.error(error);
                });

                set(ref(db, `users/${re_email}/groups/${name}`), {
                    timestamp: serverTimestamp()
                }).catch((error) => {
                    console.error(error);
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const sendGroupJoinRequest = async (name: string) => {
        get(child(dbRef, `groups/${name}}`)).then((snapshot) => {
            if (snapshot.exists()) {


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


    const getGroupMembers = async (groupName: string) => {

        let groups: { email: string, username: string }[] = []
        await get(child(dbRef, `/groups/${groupName}/member`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    // if (childSnapshot.key !== re_email) {
                    const childData = childSnapshot.val();
                    groups.push({ email: childData.email, username: childData.username })
                    // }

                });


            } else {
                console.log("No Friend Request Found");
            }
        }).catch((error) => {
            console.error(error);
        });
        return groups
    }

    const getGroupMessages = async (groupName: string) => {
        interface Message {
            sender: string,
            message: string,
            created_at: number
        }

        let groups: Message[] = []
        await get(child(dbRef, `/groups/${groupName}/message`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    // if (childSnapshot.key !== re_email) {
                    const childData = childSnapshot.val();
                    groups.push(childData)
                    // }

                });


            } else {
                console.log("No Friend Request Found");
            }
        }).catch((error) => {
            console.error(error);
        });
        return groups
    }


    const sendGroupMessage = async (name: string, message: string, sender: string, members: { email: string, username: string }[]) => {
        const d = new Date();
        let time = d.getTime();
        await set(ref(db, `/groups/${name}/message/${time}`), {
            sender: sender,
            message: message,
            created_at: serverTimestamp()
        }).catch((error) => {
            console.error(error);
        });
        members.forEach((member) => {
            const Remail: string = member.email.split('.').join('')
            set(ref(db, `/users/${Remail}}/groups/notification/${time}`), {
                sender: sender,
                created_at: serverTimestamp()
            }).catch((error) => {
                console.error(error);
            });
        });
    }



    return {
        getAllOnlineUsers,
        getAllGroups,
        getAllUsers,
        getUserDetails,
        sendMessage,
        acceptFriend,
        createGroup,
        acceptToGroup,
        sendGroupJoinRequest,
        getGroupMessages,
        sendGroupMessage,
        sendFriendRequest,
        getAllFriendConnections,
        getFriendRequest,
        getAllConversations,
        getConversationMessage,
        getGroupMembers,
        db,
        re_email

    }
}
