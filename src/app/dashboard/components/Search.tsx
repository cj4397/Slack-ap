'use client'
import React, { useState } from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI';


export default function Search(props: any) {

    const { addFriend, getAllUsers } = FirebaseAPI()
    const { users } = props
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [noDisplay, setNoDisplay] = useState(false)

    const [loaders, setLoaders] = useState(false)
    const [searchTerm, setSearchTerm] = useState<string>("");


    const searcher = (e: string) => {
        if (e.length === 0) {
            setNoDisplay(false)
        }
        setSearchTerm(e)
        if (e.trim() === "") {
            setFilteredUsers([]);
        } else {
            console.log(users);
            const filtered = users.filter((user: any) => user.data.username.toLowerCase().includes(e.toLowerCase()));
            if (filtered.length === 0) {
                setNoDisplay(true)
            } else {
                setFilteredUsers(filtered);
            }
            console.log(filtered);

        }

    }
    const selectedUser = (e: any, b: any) => {
        console.log(e, b)
    }
    return (
        <div>
            {(users.length > 0) &&
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => searcher(e.target.value)}
                    placeholder="Search users..."
                />
            }

            {/* {error && <p>{error}</p>}
          {successMessage && <p>{successMessage}</p>} */}
            <div className="search-dropdown show">
                {(filteredUsers.length === 0 && noDisplay) ? <>
                    <p>Can't find such User</p>

                </> : <>
                    <ul className=''>
                        {filteredUsers.map((user: any) => (
                            <li key={user.key}>
                                <b>  {user.data.username}</b>
                                <br />
                                <div className='is-flex is-justify-content-space-between'>
                                    {user.data.email}
                                    <div >
                                        <button onClick={() => selectedUser(user.key, user.data)}>Send a Message</button>
                                        <button onClick={() => addFriend(user.data.username, user.key)}>Add as Friend</button>
                                    </div>

                                </div>

                            </li>
                        ))}
                    </ul>
                </>}

            </div>
        </div>
    )
}
