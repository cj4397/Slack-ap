'use client';
import { datas } from "@/app/auth";
import { useEffect, useState } from "react";



export default function Seach() {
    const { user_data } = datas()
    const { token, client, expiry, uid } = user_data
    const [userList, setUserList] = useState([])
    const [userId, setUserid] = useState()
    const [userEmail, setUseriEmail] = useState()


    // const getUsersResponse = await fetch('http://206.189.91.54/api/v1/users', {
    //     method: 'GET',
    //     headers: {
    //         'access-token': token,
    //         'client': client,
    //         'expiry': expiry,
    //         'uid': uid,
    //     }
    // })

    // const body = await getUsersResponse.json()


    // const UserList = body.data


    // // console.log(userList.map((e) => e.id))
    // const Userid = body.data.map((e) => e.id)
    // const UseriEmail = body.data.map((e) => e.email)

    // console.log(UserList)






    async function getUsers() {
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


        setUserList(body.data)


        // console.log(userList.map((e) => e.id))


        console.log(userList)


    }

    useEffect(() => {
        getUsers()
        console.log(userList)
    }, [token, client, expiry, uid])









    const showUsers = async () => {

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
        console.log(body)


    }


    const make_list = userList.map((e) => (


        <div key={e.id}>

            <p>{e.id}</p>
            <p>{e.email}</p>
        </div>



    ))

    return (
        <>
            Seach page
            <button onClick={() => showUsers()}>users</button>

            {make_list}

        </>
    )
}
