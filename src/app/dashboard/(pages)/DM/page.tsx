'use client';
import { datas } from "@/app/auth";
import { useState } from "react";


export default function DM() {
    const { user_data } = datas()
    const { token, client, expiry, uid } = user_data
    const [message, setMessage] = useState()

    const sendMessage = async () => {

        const send = await fetch('http://206.189.91.54/api/v1/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    "receiver_id": id_no,
                    "receiver_class": "User",
                    "body": message
                }
            )
        })

        const body = await send.json()
        console.log(body)


    }

    return (
        <>DM page</>
    )
}
