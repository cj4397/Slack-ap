import { datas } from "./auth"
import { useMemo } from "react"

export function database() {
    const { user_data } = datas()
    const { token, client, expiry, uid } = user_data



    const createGroupAPI = async (id: any) => {
        const send = await fetch('http://206.189.91.54/api/v1/channel/add_member', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            },
            body: JSON.stringify(
                {
                    name: id.name,
                    user_ids: id.id
                }
            )
        })
        const body = await send.json()

    }

    const joinGroupAPI = async (id: number) => {
        const send = await fetch('http://206.189.91.54/api/v1/channel/add_member', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            },
            body: JSON.stringify(
                {
                    id: id,
                    member_id: id
                }
            )
        })
        const body = await send.json()
        console.log(body)


    }

    const sendMessageAPI = async (data: any) => {
        const send = await fetch('http://206.189.91.54/api/v1/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            },
            body: JSON.stringify(
                {
                    receiver_id: data.groupId,
                    receiver_class: "Channel",
                    body: String(data.message)
                }
            )
        })
        return send.json()
    }

    const sendMessageAPIUser = async (data: any) => {
        const send = await fetch('http://206.189.91.54/api/v1/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            },
            body: JSON.stringify(
                {
                    receiver_id: data.userId,
                    receiver_class: "User",
                    body: String(data.message)
                }
            )
        })
        return send.json()

    }

    const getChannels = async () => {
        const getUsersResponse = await fetch('http://206.189.91.54/api/v1/channels', {
            method: 'GET',
            headers: {
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            }
        })
        return getUsersResponse.json()
    }

    const getDetails = async (id: any) => {
        const getUsersResponse = await fetch(`http://206.189.91.54//api/v1/channels/${id}`, {
            method: 'GET',
            headers: {
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            }
        })
        return getUsersResponse.json()
    }

    const getMessage = async (Id: any) => {
        const response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${Id}&receiver_class=Channel`, {
            method: 'GET',
            headers: {
                'access-token': String(token),
                'client': String(client),
                'expiry': String(expiry),
                'uid': String(uid),
            }
        })

        return response.json()

    }

    const getUsers = async () => {
        const getUsersResponse = await fetch('http://206.189.91.54/api/v1/users', {
            method: 'GET',
            headers: {
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            }
        })
        return getUsersResponse.json()
    }

    const getMessageUser = async (Id: any) => {
        const response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${Id}&receiver_class=User`, {
            method: 'GET',
            headers: {
                'access-token': String(token),
                'client': String(client),
                'expiry': String(expiry),
                'uid': String(uid),
            }
        })

        return response.json()

    }


    const value = useMemo(
        () => ({
            createGroupAPI,
            joinGroupAPI,
            sendMessageAPI,
            sendMessageAPIUser,
            getChannels,
            getDetails,
            getMessage,
            getUsers,
            getMessageUser
        }),
        [user_data]
    );


    return value

}