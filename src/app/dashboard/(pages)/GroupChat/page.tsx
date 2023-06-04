'use client';

import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import { database } from "@/app/fetchings";



export default function DM() {
    const { getChannels, joinGroupAPI } = database()
    const [channels, setChannels] = useState([])
    const [groupId, setGroupId] = useState(null)
    const [groupName, setGroupName] = useState()
    const [open, setOpen] = useState(false)
    const [msopen, setMSOpen] = useState(false)


    useEffect(() => {
        async function getCH() {
            const result = await getChannels()
            setChannels(result.data)
        }
        getCH()

    }, [getChannels])

    const details = (id: any) => {
        setGroupId(id)
        setOpen(true)
    }

    const groupMessages = (id: any) => {
        setGroupId(id.id)
        setGroupName(id.name)
        setMSOpen(true)
    }



    const joinGroup = (id: any) => {
        joinGroupAPI(id)
    }



    const make_list = channels.map((e: any) => (


        <div key={e.id}>

            <div>
                <p><b>{e.name}</b></p>
                <p>Group ID: {e.id}</p>
                <p>Made By: {e.owner_id}</p>
            </div>
            <button onClick={() => details(e.id)}>Group Details</button>
            <button onClick={() => groupMessages({ id: e.id, name: e.name })}>Group Messages</button>
            <button onClick={() => joinGroup(e.id)}>Join Group</button>
        </div>
    ))


    return (
        <>Search panel


            {make_list}
            <DetailModal groupId={groupId} open={open} setOpen={setOpen}></DetailModal>

            <ReceiveMessage groupName={groupName} groupId={groupId} open={msopen} setOpen={setMSOpen}></ReceiveMessage>

        </>
    )
}

function DetailModal(props: any) {
    const { open, setOpen, groupId } = props
    const { getDetails } = database()
    const [groupDetails, setGroupDetails]: any = useState(null)

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        async function final(groupId: any) {
            const result = await getDetails(groupId)
            console.log(result)
            setGroupDetails(result.data)
        }
        if (groupId !== null) {
            final(groupId)
        }

        console.log('shange')
    }, [groupId])

    const time = (date: any) => {
        const hours = new Date(date).getHours()
        const min = new Date(date).getMinutes()
        const sec = new Date(date).getSeconds()
        return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }



    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>


                {groupDetails !== null &&
                    <div>
                        <p>Group Name: {groupDetails.name}</p>
                        <p>Group ID: {groupDetails.id}</p>
                        <p>Group Owner: {groupDetails.owner_id}</p>
                        <p>Group Creation Date: {time(groupDetails.created_at)}</p>
                        <div>Group Members:  {groupDetails.channel_members.map((e: any) => (
                            <div key={e.id}>
                                <p>{e.id}</p>
                            </div>
                        ))}</div>
                    </div>
                }

            </DialogContent>
        </Dialog>

    )
}

function ReceiveMessage(props: any) {
    const { open, setOpen, groupId, groupName } = props

    const { sendMessageAPI, getMessage } = database()
    const [groupMessages, setGroupMessages]: any = useState(null)
    const [message, setMessage] = useState('')

    const handleClose = () => {
        setOpen(false);
    };

    async function giveMessage(groupId: number) {
        const result = await getMessage(groupId)
        setGroupMessages(result.data)
    }
    useEffect(() => {

        if (groupId !== null) {
            giveMessage(groupId)

        }
    }, [groupId])

    const submitHandler = (e: any) => {
        e.preventDefault();
        sendMessageAPI({ groupId: groupId, message: message })
        giveMessage(groupId)
    }

    const time = (date: any) => {
        const hours = new Date(date).getHours()
        const min = new Date(date).getMinutes()
        const sec = new Date(date).getSeconds()
        return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }


    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={submitHandler}>
                    <DialogContent>
                        <h1>To <strong><i>{groupName}</i></strong>:</h1>

                        {groupMessages !== null &&
                            groupMessages.map((e: any) => (
                                <div key={e.id}>

                                    <div>
                                        <p>{e.sender.id}</p>
                                        <p>{e.body}</p>
                                        <span>{time(e.created_at)}</span>
                                    </div>


                                </div>
                            ))
                        }

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