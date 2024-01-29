'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { onChildChanged, ref } from "firebase/database";
import FirebaseAPI from '@/app/firebase/firebaseAPI';

interface Message {
    sender: string,
    email: string,
    message: string,
    created_at: number
}

export default function Channel() {
    const searchParams = useSearchParams()
    const friend = searchParams.get('friend')
    const friendEmail = searchParams.get('friendEmail')
    const [messages, setMessages] = useState<{ timestamp: number, data: Message }[]>([])
    const [change, setChange] = useState(false)
    const [ErrorMessage, setErrorMessage] = useState('')
    const { getFriendMessages, sendDirectMessage, db, reEmail } = FirebaseAPI()


    let FriendKey
    if (friendEmail !== null) {
        FriendKey = friendEmail.split('.').join('')
    }

    let email_list = [reEmail, FriendKey].sort()

    useEffect(() => {

        const getMessages = async () => {
            if (friendEmail !== null && friend !== null) {
                const result = await getFriendMessages(friendEmail)

                if (result === 'No Conversations made') {
                    setErrorMessage(result)
                } else {
                    setMessages(result)
                }
            }
        }
        getMessages()
    }, [])

    onChildChanged(ref(db, `/direct_message/${email_list}/messages`), (snapshot) => {
        setChange(change ? false : true)
    });

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(e)
        console.log(e.target.message.value)
        if (friendEmail !== null && friend !== null) {
            sendDirectMessage(friend, friendEmail, e.target.message.value)
        }

    }

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


    return (
        <div className='h-100'>
            {(messages.length > 0) ?
                <>
                    {messages.map((message) => (
                        <div key={message.timestamp}>
                            {(message.data.sender === friend) ?
                                <div className='box '>

                                    <strong>{message.data.sender}</strong> <small>{time(message.data.created_at)}</small>
                                    <br />
                                    <small>{message.data.email}</small>
                                    <article className="media is-align-items-center">
                                        <figure className="media-left">
                                            <p className="image is-64x64">
                                                <img src="https://bulma.io/images/placeholders/128x128.png" />
                                            </p>
                                        </figure>

                                        <div className="media-content">
                                            <div className="content is-flex is-justify-content-flex-start">
                                                <p>
                                                    {message.data.message}
                                                </p>
                                            </div>
                                        </div>
                                    </article>

                                </div> :
                                <div className='box has-background-info-light'>

                                    <div className='has-text-right'>
                                        <strong>{message.data.sender}</strong> <small>{time(message.data.created_at)}</small>
                                        <br />
                                        <small>{message.data.email}</small>
                                    </div>

                                    <article className="media is-align-items-center">

                                        <div className="media-content">
                                            <div className="content is-flex is-justify-content-flex-end">
                                                <p className='has-text-right'>
                                                    {message.data.message}
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
                    {ErrorMessage}
                </>}

            <div className='message_box '>
                <form className='default-form messenger is-flex-direction-row p-0' onSubmit={(e) => handleSubmit(e)}>
                    <input name='message' className="input is-large is-primary is-focused has-background-grey-lighter" type="text" placeholder="Type a message"></input>
                    <button type='submit' className='button is-large is-success'>Send</button>
                </form>
            </div>
        </div>
    )
}
