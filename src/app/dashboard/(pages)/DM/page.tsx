'use client';
import { datas } from "@/app/auth";
import { useEffect, useState } from "react";

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import { database } from "@/app/fetchings";


export default function Seach() {
    const { getUsers } = database()
    const { addFriend } = datas()
    const [userList, setUserList] = useState([])
    const [userId, setUserid] = useState(null)
    const [userEmail, setUseriEmail] = useState()
    const [open, setOpen] = useState(false)


    useEffect(() => {
        async function usersget() {
            const result = await getUsers()
            setUserList(result.data)
        }
        usersget()
    }, [getUsers])


    const addFriendList = (id: number) => {
        addFriend(id)
    }

    const sendMessage = (id: any) => {
        setUserid(id[0])
        setUseriEmail(id[1])
        console.log(id[0], id[1])

        setOpen(true)


    }


    const make_list = userList.map((e: any) => (
        <div key={e.id}>
            <p>{e.id}</p>
            <p>{e.email}</p>
            <button onClick={() => sendMessage([e.id, e.email])}>message</button>
            <button onClick={() => addFriendList(e.id)}>add friend</button>
        </div>
    ))

    return (
        <>
            Seach panel

            {make_list}

            <Modal userEmail={userEmail} userId={userId} open={open} setOpen={setOpen}></Modal>

        </>
    )
}


function Modal(props: any) {
    const { open, setOpen, userId, userEmail } = props
    const { user } = datas()
    const { getMessageUser, sendMessageAPIUser } = database()
    const [message, setMessage] = useState()
    const [chat, setChat] = useState([])

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function messagesUser(id: any) {
            const result = await getMessageUser(userId)
            setChat(result.data)
        }
        if (userId !== null) {
            messagesUser(userId)
        }

    }, [userId])


    const submitHandler = (e: any) => {
        e.preventDefault();
        sendMessageAPIUser({ userId: userId, message: message })
    }

    const time = (date: any) => {
        const hours = new Date(date).getHours()
        const min = new Date(date).getMinutes()
        const sec = new Date(date).getSeconds()
        return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }

    const conversation = chat.map((e: any) => (
        <div key={e.id}>
            {e.receiver.id === user.data.id ? (
                <div>
                    <p>{e.body}</p>
                    <span>{time(e.created_at)}</span>
                </div>
            ) : (
                <div >
                    <p>{e.body}</p>
                    <span>{time(e.created_at)}</span>
                </div>
            )}

        </div>
    ))
    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={submitHandler}>
                    <DialogContent>
                        <h1>To <strong><i>{userEmail}</i></strong>:</h1>

                        {conversation}

                        <textarea
                            name="body" id="" cols={30} rows={10}
                            onChange={(e: any) => setMessage(e.target.value)}
                        ></textarea>

                    </DialogContent>
                    <button type="submit">Submit</button>
                    <input type="submit" value="Send Request" />
                </form>
            </Dialog>
        </>
    )
}