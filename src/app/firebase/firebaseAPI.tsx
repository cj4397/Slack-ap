import React from 'react'
import { getDatabase, set, ref, get, child, serverTimestamp, remove } from 'firebase/database'
import { useAuth } from './firebaseAuth'

interface Online {
    email: string,
    username: string
}

interface List {
    email: string,
    username: string,
    created_at: number
}

export default function FirebaseAPI() {
    const { email, userName, friends, groups } = useAuth()
    const db = getDatabase();
    const dbRef = ref(getDatabase())
    const reEmail: string = email.split('.').join('')
    const localTime = new Date().getTime();

    const getOnlineUsers = async () => {
        let users: Online[] = []
        await get(child(dbRef, `online`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    users.push(childData)
                    console.log(childData);
                })
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        return users
    }

    const getAllGroups = async (groupList: string[]) => {
        let groups: { group: string, details: List }[] = []
        await get(child(dbRef, `groupList`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    const childKey = childSnapshot.key
                    if (!groupList.includes(childKey)) {
                        groups.push({ group: childKey, details: childData })
                    }

                    console.log(childData);
                })
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        return groups
    }

    const getAllUsers = async () => {
        let users: List[] = []
        await get(child(dbRef, `userList`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    const childKey = childSnapshot.key
                    if (childKey !== reEmail) {
                        users.push(childData)
                    }

                    console.log(childData);
                })
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        return users
    }

    const getFriendNotifications = async () => {
        interface FriendRequest {
            sender: string,
            email: string,
            created_at: number
        }
        interface Messages {
            sender: string,
            email: string,
            created_at: number
        }
        let requestList: FriendRequest[] = []
        let messageList: Messages[] = []


        await get(child(dbRef, `notifications/${reEmail}/request`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    requestList.push(childData)
                    console.log(childData);
                })
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        await get(child(dbRef, `notifications/${reEmail}/messages`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    messageList.push(childData)
                    console.log(childData);
                })

                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        return { request: requestList, message: messageList }

    }

    const getGroupNotifications = async () => {
        interface JoinRequest {
            sender: string,
            email: string,
            created_at: number
        }
        interface GroupRequestNotification {
            group: string,
            data: JoinRequest
        }
        interface GroupMessageNotification {
            group: string,
            data: GroupMessages
        }
        interface GroupMessages {
            sender: string,
            email: string,
            created_at: number
        }
        let requestList: GroupRequestNotification[] = []
        let messageList: GroupMessageNotification[] = []

        groups.forEach(async (group) => {
            await get(child(dbRef, `group_notifications/${group.name}/request`)).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        requestList.push({ group: group.name, data: childData })
                        console.log(childData);
                    })
                    console.log(snapshot.val());
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            await get(child(dbRef, `group_notifications/${group.name}/message`)).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        messageList.push({ group: group.name, data: childData })
                        console.log(childData);
                    })
                    console.log(snapshot.val());
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        })


        return { request: requestList, message: messageList }
    }

    const getFriendMessages = async (friendEmail: string) => {
        interface Messages {
            message: string,
            sender: string,
            email: string,
            created_at: number
        }
        const friend = friendEmail.split('.').join('')
        const channelName = [reEmail, friend].sort().join("+")
        const messageList: { timestamp: number, data: Messages }[] = []

        await get(child(dbRef, `direct_messages/${channelName}/messages`)).then((snapshot) => {
            if (snapshot.exists()) {

                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    const childKey = childSnapshot.key
                    messageList.push({ timestamp: parseInt(childKey), data: childData })
                    console.log(childData);
                })

                console.log(snapshot.val());
            } else {
                console.log("No data available");

            }
        }).catch((error) => {
            console.error(error);
        });
        if (messageList.length === 0) {
            return 'No Conversations made'
        } else {
            return messageList
        }

    }

    const getGroupMessages = async (groupName: string) => {
        interface Messages {
            message: string,
            sender: string,
            email: string,
            created_at: number
        }
        const messageList: Messages[] = []

        await get(child(dbRef, `groups/${groupName}/messages`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    messageList.push(childData)
                    console.log(childData);
                })

                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        return messageList
    }

    const getGroupDetails = async (groupName: string) => {
        interface Members {
            username: string,
            email: string,
            created_at: number
        }
        interface Officers {
            username: string,
            email: string,
            created_at: number
        }
        let officers: Officers[] = []
        let members: Members[] = []

        await get(child(dbRef, `groups/${groupName}/officers`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    officers.push(childData)
                })
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        await get(child(dbRef, `groups/${groupName}/members`)).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    members.push(childData)
                })
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        return { officers: officers, members: members }
    }

    const sendDirectMessage = (friendName: string, friendEmail: string, message: string) => {
        const friend = friendEmail.split('.').join('')
        const channelName = [reEmail, friend].sort().join("+")
        const localTime = new Date().getTime();

        set(ref(db, `direct_messages/${channelName}/messages/${localTime}`), {
            created_at: serverTimestamp(),
            sender: userName,
            email: email,
            message: message
        }).catch((error) => {
            console.error(error);
        });
        set(ref(db, `notifications/${friend}/messages/${localTime}`), {
            created_at: serverTimestamp(),
            sender: userName,
            email: email
        }).catch((error) => {
            console.error(error);
        });


    }

    const sendGroupMessage = (groupName: string, sender: string, senderEmail: string, message: string) => {

        set(ref(db, `groups/${groupName}/messages/${localTime}`), {
            created_at: serverTimestamp(),
            sender: sender,
            email: senderEmail,
            message: message
        }).catch((error) => {
            console.error(error);
        });
        set(ref(db, `group_notifications/${groupName}/message/${localTime}`), {
            created_at: serverTimestamp(),
            sender: sender,
            email: senderEmail
        }).catch((error) => {
            console.error(error);
        });
    }

    const sendFriendRequest = (friendEmail: string) => {
        const emailKey: string = friendEmail.split('.').join('')
        set(ref(db, `notifications/${emailKey}/request/${reEmail}`), {
            created_at: serverTimestamp(),
            sender: userName,
            email: email
        }).catch((error) => {
            console.error(error);
        });
    }

    const sendGroupJoinRequest = (groupName: string) => {

        set(ref(db, `group_notifications/${groupName}/request/${reEmail}`), {
            created_at: serverTimestamp(),
            sender: userName,
            email: email
        }).catch((error) => {
            console.error(error);
        });

    }

    const acceptFriendRequest = (friendName: string, friendEmail: string) => {
        const friend = friendEmail.split('.').join('')
        const channelName = [reEmail, friend].sort().join("+")
        const emailKey: string = friendEmail.split('.').join('')

        set(ref(db, `users/${reEmail}/friends/${channelName}`), {
            created_at: serverTimestamp(),
            username: friendName,
            email: friendEmail
        }).catch((error) => {
            console.error(error);
        });

        remove(ref(db, `notifications/${reEmail}/request/${emailKey}`))

    }

    const acceptGroupJoinRequest = (groupName: string, friendName: string, friendEmail: string) => {
        const emailKey: string = friendEmail.split('.').join('')
        set(ref(db, `groups/${groupName}/members/${emailKey}`), {
            created_at: serverTimestamp(),
            username: friendName,
            email: friendEmail
        }).catch((error) => {
            console.error(error);
        });

        set(ref(db, `users/${emailKey}/groups/${groupName}`), {
            officer: false
        }).catch((error) => {
            console.error(error);
        });

        remove(ref(db, `group_notifications/${groupName}/request/${emailKey}`))
    }

    const createGroup = (groupName: string) => {
        set(ref(db, `groups/${groupName}/officers/${reEmail}`), {
            created_at: serverTimestamp(),
            username: userName,
            email: email
        }).catch((error) => {
            console.error(error);
        });
        set(ref(db, `groupList/${groupName}`), {
            created_at: serverTimestamp(),
            username: userName,
            email: email
        }).catch((error) => {
            console.error(error);
        });

        set(ref(db, `users/${reEmail}/groups/${groupName}`), {
            officer: true
        }).catch((error) => {
            console.error(error);
        });
    }


    // const getAllUsers = () => {
    //     const dbRef = ref(db, '/users');
    //     let users: { key: string, data: Data }[] = []
    //     onValue(dbRef, (snapshot) => {

    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             if (childKey !== re_email) {
    //                 users.push({ key: childKey, data: childData })
    //             }
    //         });

    //     })
    //     return users
    // }

    // const getAllGroups = (groups: { group: string, members: Group }[]) => {
    //     const dbRef = ref(db, '/groups');
    //     let groupList: { group: string, members: { emailKey: string, data: Data }[] }[] = []
    //     let groupJoined: string[] = []
    //     groups.forEach((e) => {
    //         groupJoined.push(e.group)
    //     })
    //     onValue(dbRef, (snapshot) => {

    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             if (!groupJoined.includes(childKey)) {
    //                 let Glist: { emailKey: string, data: Data }[] = []
    //                 console.log(childData.member)

    //                 const test = (value: unknown): value is Data => {
    //                     if (typeof value != "object") {
    //                         throw new Error(`Unexpected type: ${typeof value}`);
    //                     }
    //                     if (value == null) {
    //                         throw new Error("Unexpected value: null");
    //                     }
    //                     return true;
    //                 }

    //                 const object = (value: any): value is object => {
    //                     if (typeof value != "object") {
    //                         throw new Error(`Unexpected type: ${typeof value}`);
    //                     }

    //                     if (value == null) {
    //                         throw new Error("Unexpected value: null");
    //                     }
    //                     return true;
    //                 }
    //                 if (object(childData.member)) {
    //                     for (const [key, value] of Object.entries(childData.member)) {
    //                         try {
    //                             if (test(value)) {
    //                                 Glist.push({ emailKey: key, data: value })
    //                             }
    //                         } catch (error) {
    //                             console.log(error)
    //                         }

    //                     };
    //                 }

    //                 groupList.push({ group: childKey, members: Glist })
    //             }

    //         });

    //     })
    //     console.log(groupList)
    //     return groupList
    // }


    // const getUserDetails = async () => {
    //     interface User {
    //         created_at: number, username: string, email: string
    //     }

    //     interface Data {
    //         username: string,
    //         email: string,
    //         notification: unknown
    //     }



    //     let userDetails: User | undefined
    //     let friendList: { email: string, username: string }[] = []
    //     let groupList: { group: string, members: Group }[] = []

    //     await get(child(dbRef, `users/${re_email}`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             const x = snapshot.val()

    //             const test = (value: unknown): value is Data => {
    //                 if (typeof value != "object") {
    //                     throw new Error(`Unexpected type: ${typeof value}`);
    //                 }
    //                 if (value == null) {
    //                     throw new Error("Unexpected value: null");
    //                 }
    //                 return true;
    //             }


    //             userDetails = {
    //                 created_at: x.created_at,
    //                 email: x.email,
    //                 username: x.username
    //             }
    //             if (x.friends) {
    //                 let Flist = []

    //                 for (const [key, value] of Object.entries(x.friends)) {
    //                     try {
    //                         if (test(value)) {
    //                             Flist.push({ email: value.email, username: value.username })
    //                         }
    //                     } catch (error) {
    //                         console.log(error)
    //                     }
    //                 }
    //                 friendList = Flist
    //             }

    //             if (x.groups) {
    //                 let Glist: { group: string, members: Group }[] = []

    //                 console.log(x.groups)
    //                 for (const [key, value] of Object.entries(x.groups)) {
    //                     const x = (value: unknown): value is Group => {
    //                         if (typeof value != "object") {
    //                             throw new Error(`Unexpected type: ${typeof value}`);
    //                         }
    //                         if (value == null) {
    //                             throw new Error("Unexpected value: null");
    //                         }
    //                         return true;
    //                     }


    //                     if (x(value)) {

    //                         Glist.push({ group: key, members: value })

    //                     }

    //                     // console.log(`${key}: ${value}`);
    //                 }
    //                 console.log(Glist)
    //                 groupList = Glist

    //             }


    //             // console.log(snapshot.val());
    //         } else {
    //             console.log("No data available");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     console.log(groupList)

    //     return { details: userDetails, friends: friendList, groups: groupList }

    // }


    // const getAllOnlineUsers = async () => {
    //     // const dbRef = ref(db, '/users');
    //     let users: any = []

    //     // onValue(dbRef, (snapshot) => {
    //     await get(child(dbRef, `/users`)).then((snapshot) => {

    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             // console.log(childKey)
    //             // console.log(childData)
    //             if (childData.status === 'online' && childKey !== re_email) {
    //                 // console.log(re_email)
    //                 users.push(childData.email)
    //             }
    //         });

    //     })

    //     console.log(users)
    //     return users
    // }


    // const getAllFriendConnections = async () => {
    //     // const dbRef = ref(db, '/direct_message');
    //     interface User {
    //         username: string
    //     }

    //     let users: { email: string, data: User }[] = []
    //     await get(child(dbRef, `/direct_message`)).then((snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();

    //             if (childKey.includes(re_email)) {
    //                 for (const [email, data] of Object.entries(childData.member)) {
    //                     if (email !== re_email) {
    //                         const x = (value: unknown): value is User => {
    //                             if (typeof value != "object") {
    //                                 throw new Error(`Unexpected type: ${typeof value}`);
    //                             }
    //                             if (value == null) {
    //                                 throw new Error("Unexpected value: null");
    //                             }
    //                             return true;
    //                         }

    //                         try {
    //                             if (x(data)) {
    //                                 users.push({ email, data: data })
    //                             }
    //                         } catch (e) {
    //                             console.log(e)
    //                         }


    //                     }
    //                 }
    //             }
    //         });

    //     }).catch((error) => {
    //         console.error("No Direct Messages made");
    //         return 'No Direct Messages made'
    //     });




    //     // onValue(dbRef, (snapshot) => {

    //     //     snapshot.forEach((childSnapshot) => {
    //     //         const childKey = childSnapshot.key;
    //     //         const childData = childSnapshot.val();

    //     //         if (childKey.includes(re_email)) {
    //     //             for (const [email, data] of Object.entries(childData.member)) {
    //     //                 if (email !== re_email) {
    //     //                     users.push({ email, data })
    //     //                 }
    //     //             }
    //     //         }
    //     //     });
    //     // })

    //     console.log(users)
    //     return users
    // }

    // const getAllConversations = async () => {

    //     interface User {
    //         email: string,
    //         username: string
    //     }

    //     let users: { email: string, username: string }[] = []
    //     await get(child(dbRef, `/direct_message`)).then((snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();

    //             if (childKey.includes(re_email)) {
    //                 for (const [email, data] of Object.entries(childData.member)) {
    //                     if (email !== re_email) {
    //                         const x = (value: unknown): value is User => {
    //                             if (typeof value != "object") {
    //                                 throw new Error(`Unexpected type: ${typeof value}`);
    //                             }
    //                             if (value == null) {
    //                                 throw new Error("Unexpected value: null");
    //                             }
    //                             return true;
    //                         }

    //                         try {
    //                             if (x(data)) {
    //                                 users.push({ email: data.email, username: data.username })
    //                             }
    //                         } catch (e) {
    //                             console.log(e)
    //                         }


    //                     }
    //                 }
    //             }
    //         });

    //     }).catch((error) => {
    //         console.error(error);
    //     });


    //     console.log(users)
    //     return users
    // }


    // const getConversationMessage = async (FEmail: string, friend: string) => {
    //     interface Message {
    //         sender: string,
    //         message: string,
    //         created_at: number
    //     }
    //     const friendEmail = FEmail.split('.').join('')
    //     let email_list = [re_email, friendEmail].sort()
    //     let users: { timestamp: number, data: Message }[] = []
    //     let members = false
    //     let chat = false

    //     await get(child(dbRef, '/direct_message/' + email_list.join("+"))).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach((value) => {
    //                 const key = value.key
    //                 const data = value.val()
    //                 if (key === 'member') {
    //                     members = true
    //                 }
    //                 if (key === 'messages') {
    //                     chat = true
    //                 }
    //             })
    //         } else {
    //             console.log("No data available");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });

    //     if (!members) {
    //         await set(ref(db, '/direct_message/' + email_list.join("+") + '/member/' + friendEmail), {
    //             created_at: serverTimestamp(),
    //             username: friend,
    //             email: FEmail
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    //         await set(ref(db, '/direct_message/' + email_list.join("+") + '/member/' + re_email), {
    //             created_at: serverTimestamp(),
    //             username: userName,
    //             email: email
    //         }).catch((error) => {
    //             console.error(error);
    //         });

    //     }

    //     if (chat) {
    //         await get(child(dbRef, '/direct_message/' + email_list.join("+") + '/messages/')).then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 snapshot.forEach((value) => {
    //                     const timestamp = value.key
    //                     const data = value.val()
    //                     users.push({ timestamp: Number(timestamp), data })
    //                 })
    //             } else {
    //                 console.log("No data available");
    //             }
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    //         return users
    //     } else {
    //         return 'No Conversations made'
    //     }
    // }


    // const sendMessage = async (FEmail: string, message: string, sender: string) => {
    //     const friendEmail = FEmail.split('.').join('')
    //     let email_list = [re_email, friendEmail].sort()
    //     const d = new Date();
    //     let time = d.getTime();


    //     await set(ref(db, '/direct_message/' + email_list.join("+") + '/messages/' + time), {
    //         created_at: serverTimestamp(),
    //         sender: userName,
    //         message: message
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     await set(ref(db, '/users/' + friendEmail + '/friends' + '/notification/' + time), {
    //         created_at: serverTimestamp(),
    //         sender: userName,
    //         message: message
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }




    // const sendFriendRequest = async (FEmail: string) => {
    //     const friendEmail = FEmail.split('.').join('')
    //     await get(child(dbRef, '/users/' + friendEmail + '/friends/' + 'request/' + re_email)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             console.log("Duplicated Friend Request");
    //         } else {
    //             set(ref(db, '/users/' + friendEmail + '/friends/' + 'request/' + re_email), {
    //                 username: userName,
    //                 email: email
    //             }).catch((error) => {
    //                 console.error(error);
    //             });
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }


    // const acceptFriend = async (friendname: string, FEmail: string) => {
    //     const d = new Date();
    //     let time = d.getTime()
    //     console.log(time)
    //     const friendEmail = FEmail.split('.').join('')
    //     let email_list = [re_email, friendEmail].sort().join('+')
    //     await get(child(dbRef, 'users/' + re_email + "/" + 'friends/' + 'request/' + friendEmail)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             set(ref(db, 'users/' + re_email + "/" + 'friends/' + email_list), {
    //                 username: friendname,
    //                 email: FEmail,
    //                 created_at: serverTimestamp()
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             set(ref(db, 'users/' + friendEmail + "/" + 'friends/' + email_list + '/notification/' + time), {
    //                 sender: userName,
    //                 message: 'We are now Friends'
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             set(ref(db, 'users/' + friendEmail + "/" + 'friends/' + email_list), {
    //                 username: userName,
    //                 email: email
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             remove(ref(db, 'users/' + re_email + "/" + 'friends/' + 'request/' + friendEmail))
    //         } else {
    //             console.log("No Friend Request Found");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }

    // const getFriendRequest = async () => {


    //     let users: { email: string, username: string }[] = []

    //     await get(child(dbRef, '/users/' + re_email + "/" + 'friends/' + 'request')).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach((childSnapshot) => {
    //                 const childData = childSnapshot.val();
    //                 users.push({ email: childData.email, username: childData.username })
    //             });


    //         } else {
    //             console.log("No Friend Request Found");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     return users
    // }

    // const getFriendNotification = async () => {
    //     interface Timestamp {
    //         message: string,
    //         username: string,
    //         created_at: number
    //     }
    //     interface Notification {
    //         timestamp: Timestamp
    //     }
    //     interface Data {
    //         email: string,
    //         username: string,
    //         created_at: number,
    //         notification?: Notification
    //     }

    //     let users: { channel: string, data: Data }[] = []

    //     await get(child(dbRef, '/users/' + re_email + "/" + 'friends/')).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach((childSnapshot) => {
    //                 const childKey = childSnapshot.key
    //                 const childData = childSnapshot.val();

    //                 users.push({ channel: childKey, data: childData })
    //             });


    //         } else {
    //             console.log("No Friend Request Found");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     return users
    // }

    // const getGroupMessageNotification = async () => {


    //     let users: { channel: string, data: Group }[] = []

    //     await get(child(dbRef, '/users/' + re_email + "/" + 'groups')).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach((childSnapshot) => {
    //                 const childKey = childSnapshot.key
    //                 const childData = childSnapshot.val();

    //                 users.push({ channel: childKey, data: childData })
    //             });


    //         } else {
    //             console.log("No Group Join Request Found");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     return users
    // }

    // const getGroupJoinRequest = async (groupName: { group: string, members: Group }[]) => {
    //     interface Join {
    //         sender: string,
    //         message: string,
    //         created_at: number
    //     }
    //     console.log(groupName)
    //     let groups: { group: string, members: Join[] }[] = []
    //     groupName.forEach(async (group) => {
    //         let groupinfo: Join[] = []
    //         if (group.members.officer) {
    //             await get(child(dbRef, `/groups/${group.group}/join`)).then((snapshot) => {
    //                 if (snapshot.exists()) {
    //                     console.log(snapshot)
    //                     snapshot.forEach((childSnapshot) => {

    //                         const childData = childSnapshot.val();
    //                         groupinfo.push(childData)


    //                     });


    //                 } else {
    //                     console.log("No Friend Request Found");
    //                 }
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             groups.push({ group: group.group, members: groupinfo })
    //         }



    //     })
    //     console.log(groups)
    //     return groups
    // }


    // const createGroup = async (name: string) => {
    //     get(child(dbRef, `groups/${name}`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             console.log("Duplicated Group Name");
    //         } else {

    //             set(ref(db, `groups/${name}/member/${re_email}`), {
    //                 username: userName,
    //                 email: email,
    //                 admin: true
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             set(ref(db, `groups/${name}/officers/${re_email}`), {
    //                 username: userName,
    //                 admin: true
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             set(ref(db, `users/${re_email}/groups/${name}`), {
    //                 officer: true,
    //                 timestamp: serverTimestamp()
    //             }).catch((error) => {
    //                 console.error(error);
    //             });
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }

    // const sendGroupJoinRequest = async (name: string) => {
    //     get(child(dbRef, `groups/${name}`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             set(ref(db, `groups/${name}/join/${re_email}`), {
    //                 email: email,
    //                 username: userName,
    //                 created_at: serverTimestamp()
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //         } else {
    //             console.log("No data available");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }

    // const acceptToGroup = async (name: string, userEmail: string, usersName: string, officer: boolean) => {
    //     get(child(dbRef, `groups/${name}`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             console.log("already available");
    //         } else {
    //             console.log("No data available");
    //             set(ref(db, `groups/${name}/member/${userEmail}`), {
    //                 username: usersName
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             set(ref(db, `users/${re_email}/groups/${name}`), {
    //                 officer: officer,
    //                 timestamp: serverTimestamp()
    //             }).catch((error) => {
    //                 console.error(error);
    //             });

    //             remove(ref(db, `groups/${name}/join/${userEmail}`))

    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }


    // const getGroupMembers = async (groupName: string) => {

    //     let groups: { email: string, username: string }[] = []
    //     await get(child(dbRef, `/groups/${groupName}/member`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach((childSnapshot) => {
    //                 // if (childSnapshot.key !== re_email) {
    //                 const childData = childSnapshot.val();
    //                 groups.push({ email: childData.email, username: childData.username })
    //                 // }

    //             });


    //         } else {
    //             console.log("No Friend Request Found");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     return groups
    // }

    // const getGroupMessages = async (groupName: string) => {
    //     interface Message {
    //         sender: string,
    //         message: string,
    //         created_at: number
    //     }

    //     let groups: Message[] = []
    //     await get(child(dbRef, `/groups/${groupName}/message`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach((childSnapshot) => {
    //                 // if (childSnapshot.key !== re_email) {
    //                 const childData = childSnapshot.val();
    //                 groups.push(childData)
    //                 // }

    //             });


    //         } else {
    //             console.log("No Friend Request Found");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     return groups
    // }




    // const sendGroupMessage = async (name: string, message: string, sender: string, members: { email: string, username: string }[]) => {
    //     const d = new Date();
    //     let time = d.getTime();
    //     await set(ref(db, `/groups/${name}/message/${time}`), {
    //         sender: sender,
    //         message: message,
    //         created_at: serverTimestamp()
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    //     members.forEach((member) => {
    //         const Remail: string = member.email.split('.').join('')
    //         set(ref(db, `/users/${Remail}/groups/${name}/notification/${time}`), {
    //             sender: sender,
    //             created_at: serverTimestamp()
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    //     });
    // }



    return {
        // getAllOnlineUsers,
        // getAllGroups,
        // getAllUsers,
        // getUserDetails,
        // sendMessage,
        // acceptFriend,
        // createGroup,
        // acceptToGroup,
        // sendGroupJoinRequest,
        // getGroupMessages,
        // sendGroupMessage,
        // sendFriendRequest,
        // getAllFriendConnections,
        // getFriendRequest,
        // getAllConversations,
        // getConversationMessage,
        // getGroupMembers,
        // getGroupJoinRequest,
        // getFriendNotification,
        // getGroupMessageNotification,
        getOnlineUsers,
        getAllGroups,
        getAllUsers,
        getFriendNotifications,
        getGroupNotifications,
        getFriendMessages,
        getGroupMessages,
        getGroupDetails,
        sendDirectMessage,
        sendGroupMessage,
        sendFriendRequest,
        acceptFriendRequest,
        sendGroupJoinRequest,
        acceptGroupJoinRequest,
        createGroup,
        db,
        reEmail

    }
}
