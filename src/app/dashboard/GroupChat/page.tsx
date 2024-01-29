'use client'
import React, { useEffect, useState } from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/firebase/firebaseAuth'

interface Message {
    sender: string,
    message: string,
    created_at: number
}
interface Online {
    email: string,
    username: string
}

export default function page() {
    const { email, userName } = useAuth()
    const searchParams = useSearchParams()
    const groupName = searchParams.get('groupName')
    const [members, setMembers] = useState<{ email: string, username: string }[]>([])
    const [online, setOnline] = useState<Online[]>([])
    const [message, setMessage] = useState<Message[]>([])
    const [officers, setOfficers] = useState<{ email: string, username: string }[]>([])

    const { getGroupDetails, getOnlineUsers, getGroupMessages, sendGroupMessage } = FirebaseAPI()

    useEffect(() => {
        const getMembers = async () => {
            if (groupName !== null) {
                const result = await getGroupDetails(groupName)
                const messages = await getGroupMessages(groupName)
                setMessage(messages)
                console.log(result)
                setMembers(result.members)
                setOfficers(result.officers)
            }
            const users = await getOnlineUsers()
            setOnline(users)
        }
        getMembers()
    }, [])

    const time = (e: number) => {
        const now = new Date()

        if (new Date(e).getFullYear() === new Date(now).getFullYear()) {
            if ((new Date(e).getMonth() + 1) === (new Date(now).getMonth() + 1)) {
                if (new Date(e).getDate() === new Date(now).getDate()) {
                    if (new Date(e).getHours() === new Date(now).getHours()) {
                        return `${new Date(now).getMinutes() - new Date(e).getMinutes()} Minutes ago`
                    } else if (new Date(e).getHours() < new Date(now).getHours()) {
                        return `${new Date(now).getHours() - new Date(e).getHours()} Hours ago`
                    } else {
                        return "Date error"
                    }
                } else if (new Date(e).getDate() < new Date(now).getDate()) {
                    return `${new Date(now).getDate() - new Date(e).getDate()} Days ago`
                } else {
                    return "Date error"
                }
            } else if ((new Date(e).getMonth() + 1) < (new Date(now).getMonth() + 1)) {
                return `${(new Date(now).getMonth() + 1) - (new Date(e).getMonth() + 1)} Months ago`
            } else {
                return "Date error"
            }
        } else if (new Date(e).getFullYear() < new Date(now).getFullYear()) {
            return `${new Date(now).getFullYear() - new Date(e).getFullYear()} Years ago`
        } else {
            return "Date error"
        }

    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (groupName !== null) {
            sendGroupMessage(groupName, e.target.message.value, userName, members)
        }
    }


    return (
        <main>

            <section className='un-select has-background-light nav-section'>
                Members
                <ul className=''>
                    {(members.length > 0) ? <>
                        {members.map((member) => (
                            <li key={member.email} className={`${(online.includes(member.email) || member.email === email) ? 'online' : ""}`}>
                                <abbr title={member.email}>{member.username}</abbr>
                            </li>
                        ))}
                    </> : <>
                        Error
                    </>}
                </ul>
            </section>

            <div className='main-section'>
                {(message.length > 0) ?
                    <>
                        {message.map((data) => (
                            <div key={data.created_at}>
                                {(data.sender !== email) ?
                                    <div className='box '>
                                        <strong>{data.sender}</strong> <small>{time(data.created_at)}</small>
                                        <article className="media">
                                            <figure className="media-left">
                                                <p className="image is-64x64">
                                                    <img src="https://bulma.io/images/placeholders/128x128.png" />
                                                </p>
                                            </figure>
                                            <div className="media-content">
                                                <div className="content">
                                                    <p>
                                                        {data.message}
                                                    </p>
                                                </div>

                                            </div>

                                        </article>



                                    </div> :
                                    <div className='box has-background-info-light'>

                                        <div className='has-text-right'>
                                            <strong>{data.sender}</strong> <small>{time(data.created_at)}</small>
                                        </div>

                                        <article className="media ">

                                            <div className="media-content">
                                                <div className="content">
                                                    <p className='has-text-right'>
                                                        {data.message}
                                                    </p>
                                                </div>

                                            </div>
                                            <figure className="media-right">
                                                <p className="image is-64x64">
                                                    <img src="https://bulma.io/images/placeholders/128x128.png" />
                                                    <br />

                                                </p>
                                            </figure>
                                        </article>

                                    </div>}
                            </div>
                        ))}

                    </> : <>
                        error message
                    </>}



                <div className='message_box '>

                    <form className='default-form messenger is-flex-direction-row p-0' onSubmit={(e) => handleSubmit(e)}>
                        <input name='message' className="input is-large is-primary is-focused has-background-grey-lighter" type="text" placeholder="Type a message"></input>
                        <button type='submit' className='button is-large is-success'>Send</button>
                    </form>
                </div>
            </div>
        </main>
    )
}
