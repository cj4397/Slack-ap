'use client'
import React, { useState, useEffect } from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI'


interface Data {
    email: string,
    username: string,
    created_at: number
}

export default function SearchGroup(props: {
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    modal: boolean,
    groups: string[]
}) {
    const { setModal, modal, groups } = props
    const { sendGroupJoinRequest, getAllGroups } = FirebaseAPI()
    const [group, setGroup] = useState<{ group: string, members: { emailKey: string, data: Data }[] }[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<{ group: string, members: { emailKey: string, data: Data }[] }[]>([]);
    const [noDisplay, setNoDisplay] = useState<boolean>(false)

    useEffect(() => {
        const getUsers = () => {
            const result = getAllGroups(groups)


            setGroup(result)
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

            const filtered = group.filter((x) => x.group.toLowerCase().includes(e.toLowerCase()));
            if (filtered.length === 0) {
                setNoDisplay(true)
            } else {
                setFilteredUsers(filtered);
            }
            console.log(filtered);

        }

    }
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
                                {filteredUsers.map((g) => (
                                    <li key={g.group}>
                                        <b>  {g.group}</b>
                                        <br />
                                        <div className='is-flex is-justify-content-space-between'>
                                            <ul>
                                                {g.members.map((member) => (
                                                    <li>
                                                        {member.emailKey}
                                                    </li>

                                                ))}
                                            </ul>


                                            <div >

                                                <button className='button' onClick={() => sendGroupJoinRequest(g.group)} >
                                                    Join Group
                                                </button>


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
