'use client';

import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Database } from "@/app/fetchings";
import { Datas } from "@/app/auth";



export default function DM() {
    const { getChannels } = Database()
    const [channels, setChannels] = useState([])
    const [groupId, setGroupId] = useState(null)
    const [groupName, setGroupName] = useState('')
    const [open, setOpen] = useState(false)
    const [msopen, setMSOpen] = useState(false)
    const [createGC, setCreateGC] = useState(false)
    const [addmember, setAddMember] = useState(false)

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

    const addMember = (id: any) => {
        setGroupName(id.name)
        setGroupId(id.id)
        setAddMember(true)
    }


    return (
        <>Search panel
            <button onClick={() => setCreateGC(true)}>Create Group Chat</button>
            <CreateGroup open={createGC} setOpen={setCreateGC}></CreateGroup>

            {channels !== undefined ? (channels.map((e: any) => (

                <div key={e.id}>

                    <div>
                        <p><b>{e.name}</b></p>
                        <p>Group ID: {e.id}</p>
                        <p>Made By: {e.owner_id}</p>
                    </div>
                    <button onClick={() => details(e.id)}>Group Details</button>
                    <button onClick={() => groupMessages({ id: e.id, name: e.name })}>Group Messages</button>
                    <button onClick={() => addMember({ name: e.name, id: e.id })}>Add a Member</button>
                </div>

            ))) :
                <h1>Their  is no Joined Group</h1>
            }


            <DetailModal groupId={groupId} open={open} setOpen={setOpen}></DetailModal>

            <ReceiveMessage groupName={groupName} groupId={groupId} open={msopen} setOpen={setMSOpen}></ReceiveMessage>

            <AddGroupModal groupId={groupId} groupName={groupName} open={addmember} setOpen={setAddMember} />
        </>
    )
}

function DetailModal(props: any) {
    const { open, setOpen, groupId } = props
    const { getDetails } = Database()
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
                                <p>{e.user_id}</p>
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

    const { sendMessageAPI, getMessage } = Database()
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

function CreateGroup(props: any) {
    const { open, setOpen } = props
    const { user } = Datas()
    const { createGroupAPI } = Database()
    const [groupName, setGroupName]: any = useState(null)


    const handleClose = () => {
        setOpen(false);
    };




    const submitHandler = (e: any) => {
        e.preventDefault();
        createGroupAPI({ name: groupName, id: user.id })

    }



    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={submitHandler}>
                    <DialogContent>
                        <h1>To <strong><i>Create Group</i></strong>:</h1>



                        <input
                            type="text"
                            name="body" id=""
                            onChange={(e: any) => setGroupName(e.target.value)}
                        />

                    </DialogContent>
                    <button type="submit">Submit</button>

                </form>
            </Dialog>
        </>
    )
}

function AddGroupModal(props: any) {
    const { open, setOpen, groupName, groupId } = props
    const [member, setMember] = useState()
    const { joinGroupAPI } = Database()


    const handleClose = () => {
        setOpen(false);
    };


    const submitHandler = (e: any) => {
        e.preventDefault();
        joinGroupAPI({ group: groupId, member: member })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={submitHandler}>
                <DialogContent>
                    <h1>To <strong><i>Add to Group:{groupName}</i></strong>:</h1>



                    <input
                        type="number"
                        name="body" id=""
                        onChange={(e: any) => setMember(e.target.value)}
                    />

                </DialogContent>

                <button type="submit">Submit</button>

            </form>
        </Dialog>
    )
}