'use client';
import { datas } from "@/app/auth";


export default function DM() {
    const { user_data } = datas()
    const { token, client, expiry, uid } = user_data

    const sendMessage = async () => {

        const send = await fetch('http://206.189.91.54/api/v1/users', {
            method: 'GET',
            headers: {
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            }
        })

        const body = await send.json()
        console.log(body)


    }

    return (
        <>DM page</>
    )
}
