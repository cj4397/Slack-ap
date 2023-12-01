'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import FirebaseAPI from '@/app/firebase/firebaseAPI'

export default function MiniLinks(props: any) {
    const { getFriends } = FirebaseAPI()
    const [list, setList]: any = useState([])


    useEffect(() => {

        const get_friends = async () => {
            const x = await getFriends()
            setList(x)
        }
        get_friends()
        console.log(list)
    }, [])

    return (
        <ul>

            <>
                {list.map((e: any) => (
                    <li>
                        wsdfg
                        <Link href={{
                            pathname: `/dashboard/DirectMessage/${e.data.username}`,
                            query: { friend: `${e}` },
                        }}
                            as={`/dashboard/DirectMessage/${e.data.username}`}>
                            {e.data.username}
                            <br />
                            {e.email}
                        </Link>

                    </li>
                ))}

            </>

        </ul>
    )
}
