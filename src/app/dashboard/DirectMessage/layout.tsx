'use client'
import React, { useEffect, useState } from 'react'
import Search from '../components/Search';
import FirebaseAPI from '@/app/firebase/firebaseAPI';
import MiniLinks from '../components/MiniLinks';
import Link from "next/link";

export default function layout({ children, }: { children: React.ReactNode; }) {
    const { getAllUsers, getFriends } = FirebaseAPI()
    const [users, setUsers] = useState([])
    const [friend_list, setFriendList] = useState([])
    const [loader, setloader] = useState(false)

    useEffect(() => {
        const read = async () => {
            const result = await getAllUsers()
            setUsers(result)
            setloader(true)
        }
        const get_friends = async () => {
            const x = await getFriends()
            setFriendList(x)
        }
        console.log(getAllUsers())
        read()
        get_friends()
    }, [])



    console.log(friend_list)
    const list = [{ email: 'x', data: { username: "age" } }]

    return (
        <main>
            Find a User
            <Search users={users} />

            <section className='un-select has-background-success nav-section'>
                Friends
                <MiniLinks />
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
