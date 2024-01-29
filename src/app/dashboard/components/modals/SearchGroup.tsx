'use client'
import React, { useState, useEffect } from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI'


interface Data {
    email: string,
    username: string,
    created_at: number
}

interface Group {
    officer: boolean,
}

interface List {
    email: string,
    username: string,
    created_at: number
}

export default function SearchGroup(props: {
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    modal: boolean,
    groups: { name: string, details: Group }[]
}) {
    const { setModal, modal, groups } = props
    const { sendGroupJoinRequest, getAllGroups } = FirebaseAPI()
    const [group, setGroup] = useState<{ group: string, details: List }[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredGroups, setFilteredGroups] = useState<{ group: string, details: List }[]>([]);
    const [noDisplay, setNoDisplay] = useState<boolean>(false)

    useEffect(() => {
        const getGroups = async () => {
            let groupList: string[] = []
            groups.forEach((group) => {
                groupList.push(group.name)
            })
            const result = await getAllGroups(groupList)


            setGroup(result)
        }
        getGroups()
    }, [])

    const searcher = (e: string) => {
        if (e.length === 0) {
            setNoDisplay(false)
        }
        setSearchTerm(e)
        if (e.trim() === "") {
            setFilteredGroups([]);
        } else {

            const filtered = group.filter((x) => x.group.toLowerCase().includes(e.toLowerCase()));
            if (filtered.length === 0) {
                setNoDisplay(true)
            } else {
                setFilteredGroups(filtered);
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
                        {(filteredGroups.length === 0 && noDisplay) ? <>
                            <p>Can't find such User</p>

                        </> : <>
                            <ul className=''>
                                {filteredGroups.map((g) => (
                                    <li key={g.group}>
                                        <b>  {g.group}</b>
                                        <br />
                                        <div className='is-flex is-justify-content-space-between'>
                                            <p><b>Creator:</b> {g.details.username}</p><br />
                                            <p><b>Email:</b> {g.details.email}</p><br />
                                            <p><b>Created at:</b> {g.details.created_at}</p>

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
