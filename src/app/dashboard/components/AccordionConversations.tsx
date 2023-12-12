'use client'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faSquarePlus, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import FirebaseAPI from '@/app/firebase/firebaseAPI'
import { onChildChanged, ref } from "firebase/database";


export default function AccordionConversations() {
    const [modal, setModal] = useState(false)
    const [accordion, setAccordion] = useState(false)
    const [arrow, setArrow] = useState(<FontAwesomeIcon icon={faChevronDown} size="1x" />)
    const accordionActive = () => {
        setAccordion(accordion ? false : true)
        setArrow(accordion ? <FontAwesomeIcon icon={faChevronDown} size="1x" /> : <FontAwesomeIcon icon={faChevronUp} size="1x" />)
    }

    return (
        <div>
            <div className='has-background-primary' onClick={() => accordionActive()}> <b className="has-text-black is-size-6">

            </b> {arrow}  </div>

            <div className={`${accordion ? "accordion-content" : " active-accordion"} pt-3`}>
                <ul className="list">
                    {/* {(friendRequest.length > 0) ? <>
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
                        <p>No Conversations Recorded </p>
                    } */}

                </ul>
            </div>
        </div>
    )
}
