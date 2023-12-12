import React, { useState, useEffect } from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI';
import Link from 'next/link';


interface Data {
    email: string,
    username: string
}

export default function SearchUser(props: {
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    modal: boolean,
    friends: string[]
}) {
    const { setModal, modal, friends } = props
    const { sendFriendRequest, getAllUsers } = FirebaseAPI()
    const [users, setUsers] = useState<{ key: string, data: Data }[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<{ key: string, data: Data }[]>([]);
    const [noDisplay, setNoDisplay] = useState<boolean>(false)

    useEffect(() => {
        const getUsers = () => {
            const result = getAllUsers()


            setUsers(result)
        }
        getUsers()
    }, [])

    const searcher = (e: string) => {
        if (e.length === 0) {
            setNoDisplay(false)
        }
        setSearchTerm(e)
        if (e.trim() === "") {
            setFilteredUsers([]);
        } else {
            console.log(users);
            const filtered = users.filter((user) => user.data.username.toLowerCase().includes(e.toLowerCase()));
            if (filtered.length === 0) {
                setNoDisplay(true)
            } else {
                setFilteredUsers(filtered);
            }
            console.log(filtered);

        }

    }
    console.log(friends)

    return (
        <div className={`${modal && 'is-active'} modal`}>
            <div className="modal-background"></div>
            <div className="modal-card h-100">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button onClick={() => setModal(false)} className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body ">

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => searcher(e.target.value)}
                        placeholder="Search users..."
                    />
                    <div className="search-dropdown show">
                        {(filteredUsers.length === 0 && noDisplay) ? <>
                            <p>Can't find such User</p>

                        </> : <>
                            <ul className=''>
                                {filteredUsers.map((user) => (
                                    <li key={user.key}>
                                        <b>  {user.data.username}</b>
                                        <br />
                                        <div className='is-flex is-justify-content-space-between'>
                                            {user.data.email}
                                            <div >

                                                <Link href={{
                                                    pathname: `/dashboard/DirectMessage/channel`,
                                                    query: { friend: `${user.key}` }
                                                }}
                                                    as={`/dashboard/DirectMessage/${user.data.username}`}
                                                    className='button'
                                                    onClick={() => setModal(false)}
                                                >Send a Message

                                                </Link>
                                                {(!friends.includes(user.key)) && <button className='button' onClick={() => sendFriendRequest(user.key)}>Add as Friend</button>}

                                            </div>

                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </>}

                    </div>

                </section>
                <footer className="modal-card-foot">
                    <button onClick={() => setModal(false)} className="button">Finish</button>
                </footer>
            </div>
        </div>
    )
}
