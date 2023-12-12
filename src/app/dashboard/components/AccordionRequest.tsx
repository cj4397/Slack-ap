'use client'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faSquarePlus, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import FirebaseAPI from '@/app/firebase/firebaseAPI'
import { onChildChanged, ref } from "firebase/database";


export default function AccordionRequest(props: { list: { email: string, username: string }[], title: string }) {
    const { list, title } = props
    const [modal, setModal] = useState(false)
    const [accordion, setAccordion] = useState(false)
    const [arrow, setArrow] = useState(<FontAwesomeIcon icon={faChevronDown} size="1x" />)
    const { acceptFriend, db, re_email } = FirebaseAPI()
    const [loader, setLoader] = useState(list.length > 0 ? true : false)
    const [change, setChange] = useState<boolean>(false)
    const [friendRequest, setFriendRequest] = useState(list)

    const accordionActive = () => {
        setAccordion(accordion ? false : true)
        setArrow(accordion ? <FontAwesomeIcon icon={faChevronDown} size="1x" /> : <FontAwesomeIcon icon={faChevronUp} size="1x" />)
    }

    onChildChanged(ref(db, `/users/${re_email}/friends/request`), (request) => {
        setChange(change ? false : true)
        setLoader(true)
        let x: { username: string, email: string }[] = []
        request.forEach((emailKey) => {
            // const childKey = emailKey.key;
            const childData = emailKey.val();
            x.push({ username: childData.username, email: childData.email })
        })
        setFriendRequest(x)


    })
    // useEffect(()=>{

    // },[change])


    const addFriend = (name: string, email: string) => {
        acceptFriend(name, email)
    }


    return (
        <>
            {loader ? <>
                <div className='is-flex is-justify-content-center w-100'>
                    <span className="spinner"></span>
                </div>

            </> : <>
                <div className='has-background-primary' onClick={() => accordionActive()}> <b className="has-text-black is-size-6">{title}</b> {arrow}  </div>

                <div className={`${accordion ? "accordion-content" : " active-accordion"} pt-3`}>
                    <ul className="list">
                        {(friendRequest.length > 0) ? <>
                            {friendRequest.map((e) => (
                                <li key={e.email} className='is-flex is-justify-content-space-between'>

                                    <abbr title={e.email}>{e.username}</abbr>
                                    <p >
                                        <abbr className='mr-3 has-text-danger' title="Delete friend request"><FontAwesomeIcon icon={faSquareMinus} /></abbr>
                                        <abbr onClick={() => { addFriend(e.username, e.email) }} className='mr-3 has-text-success' title="Add as Friend"><FontAwesomeIcon icon={faSquarePlus} /></abbr>
                                    </p>
                                </li>
                            ))}
                        </> :
                            <p>No Friend Added</p>
                        }

                    </ul>
                </div>
            </>}

        </>
    )
}
