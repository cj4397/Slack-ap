'use client';
import { datas } from "@/app/auth";
import { useEffect, useState } from "react";



export default function Seach() {
    const { user_data } = datas()
    const { token, client, expiry, uid } = user_data


    const userListData = async () => {
        const getUsersResponse = await fetch('http://206.189.91.54/api/v1/users', {
            method: 'GET',
            headers: {
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            }
        })
        const body = await getUsersResponse.json()
        setUserList(body)
        console.log(userList)
        return body
    }
    const [userList, setUserList] = useState()



    useEffect(() => {
        // userListData()
        console.log(userList)
    })


    // const showUsers = async () => {

    //     const getUsersResponse = await fetch('http://206.189.91.54/api/v1/users', {
    //         method: 'GET',
    //         headers: {
    //             'access-token': token,
    //             'client': client,
    //             'expiry': expiry,
    //             'uid': uid,
    //         }
    //     })

    //     const body = await getUsersResponse.json()
    //     console.log(body)


    // }


    return (
        <>
            Seach page
            <button onClick={() => showUsers()}>users</button>


        </>
    )
}
