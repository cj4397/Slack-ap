'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faChevronDown, faChevronUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SearchUser from './modals/SearchUser'



export default function Accordion(
    props: {
        friends: { email: string, username: string }[],
        online: string[]
    }
) {
    const { friends, online } = props
    const [modal, setModal] = useState(false)
    const [accordion, setAccordion] = useState(false)
    const [friendList, setFriendList] = useState<string[]>([])
    const path = usePathname()
    const [arrow, setArrow] = useState(<FontAwesomeIcon icon={faChevronDown} size="1x" />)


    useEffect(() => {
        let x: string[] = []
        friends.forEach((z) => x.push(z.email))
        setFriendList(x)
    }, [])

    const accordionActive = () => {
        setAccordion(accordion ? false : true)
        setArrow(accordion ? <FontAwesomeIcon icon={faChevronDown} size="1x" /> : <FontAwesomeIcon icon={faChevronUp} size="1x" />)
    }




    return (
        <>

            <div >

                <div className={`${(path.includes('/dashboard/DirectMessage')) ? 'link-active' : 'has-text-info'} has-text-centered `}>
                    <span className='is-flex is-justify-content-space-around is-align-items-end'>
                        <Link href={'/dashboard/DirectMessage'}>
                            <abbr className="pointed" title="Direct Message">
                                <FontAwesomeIcon icon={faEnvelope} size="2x" />
                                <b className="has-text-black is-size-6 ml-6">Message</b>
                            </abbr></Link>
                        <p onClick={() => accordionActive()} className='pointed'>{arrow}</p>
                    </span>
                </div>

                <div className={`${accordion ? "accordion-content" : " active-accordion"}`}>
                    <div className={` is-flex is-flex-direction-column is-justify-content-space-between`}>
                        <ul className="list">
                            {(friends.length > 0) ? <>
                                {friends.map((e) => (
                                    <li key={e.email} className={`${online.includes(e.email) && 'online'}`}>
                                        <Link href={{
                                            pathname: `/dashboard/DirectMessage/channel`,
                                            query: { friendEmail: `${e.email}`, friend: e.username },
                                        }}
                                        >

                                            <abbr title={e.email}>{e.username}</abbr>

                                        </Link>

                                    </li>
                                ))}
                            </> :
                                <p>No Friend Added</p>
                            }

                        </ul>
                        <button onClick={() => setModal(true)}><FontAwesomeIcon icon={faMagnifyingGlass} className='mr-3' />Search a user</button>
                    </div>
                </div>
                {modal && <SearchUser setModal={setModal} modal={modal} friends={friendList} />}

            </div>
        </>
    )
}
