'use client'
import React, { useEffect, useState } from 'react'

import FirebaseAPI from '@/app/firebase/firebaseAPI';

import Link from "next/link";

interface Data {
    email: string,
    username: string
}

export default function Layout({ children, }: { children: React.ReactNode; }) {
    const { getAllConversations, getAllFriendConnections } = FirebaseAPI()
    const [conversations, setConversations] = useState<{ email: string, data: { username: string } }[]>([])
    const [friend_list, setFriendList] = useState([])
    const [loader, setloader] = useState(true)

    useEffect(() => {
        const getchat = async () => {
            const result = await getAllFriendConnections()
            setConversations(result)
            console.log(result)
            console.log(await getAllConversations())
            setloader(false)
        }
        getchat()
    }, [])






    return (
        <main>

            <section className='un-select has-background-success nav-section'>
                Conversations
                {loader ? <>
                    Loading
                </> : <>
                    <ul>
                        {/* {(conversations.length > 0) ? <> */}
                        {conversations.map((e) => (
                            <li><Link href={{
                                pathname: `/dashboard/DirectMessage/channel`,
                                query: { friend: `${e.email}` }
                            }}>
                                <abbr title={e.email}> <b>{e.data.username}</b></abbr>

                            </Link></li>
                        ))}
                        {/* </> : <> */}

                        {/* </>} */}
                    </ul>
                </>}

                {/* <ul>
                    {loader &&
                        <>
                            {friend_list.map((e: any) => (
                                <li>
                                    <Link href={{
                                        pathname: `/dashboard/DirectMessage/${e.data.username}`,
                                        query: { friend: `${e}` },
                                    }}
                                        as={`/dashboard/DirectMessage/${e.data.username}`}>
                                        <b>{e.data.username}</b>
                                        <br />
                                        <p className='pl-3'>{e.email}</p>
                                    </Link>

                                </li>
                            ))}

                        </>
                    }
                </ul> */}
            </section>
            <div className='main-section'>
                {children}
            </div>
        </main>
    )
}
