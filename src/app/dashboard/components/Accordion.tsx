'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faChevronDown, faChevronUp, faComments } from '@fortawesome/free-solid-svg-icons'


export default function Accordion(props: any) {
    const { friends, groups, mode } = props
    const [accordion, setAccordion] = useState(false)
    const path = usePathname()
    const [arrow, setArrow] = useState(<FontAwesomeIcon icon={faChevronDown} size="1x" />)

    const accordionActive = () => {
        setAccordion(accordion ? false : true)
        setArrow(accordion ? <FontAwesomeIcon icon={faChevronDown} size="1x" /> : <FontAwesomeIcon icon={faChevronUp} size="1x" />)
    }
    return (
        <>
            {(mode === "friends") ?
                <div >
                    <div onClick={() => accordionActive()} className={`${(path.includes('/dashboard/DirectMessage')) ? 'link-active' : 'has-text-info'} has-text-centered `}>
                        <p> <abbr className="is-flex is-justify-content-space-around is-align-items-end" title="Direct Message"><FontAwesomeIcon icon={faEnvelope} size="2x" />
                            <b className="has-text-black is-size-6">Message</b> {arrow}</abbr></p>
                    </div>

                    <div className={`${accordion ? "accordion-content" : " active-accordion"}`}>
                        <div className={` is-flex is-flex-direction-column is-justify-content-space-between`}>
                            <ul className="list">
                                {(friends.length > 0) ? <>
                                    {friends.map((e: any) => (
                                        <li>
                                            <Link href={{
                                                pathname: `/dashboard/DirectMessage/${e.data.username}`,
                                                query: { friend: `${e.email}` },
                                            }}
                                                as={`/dashboard/DirectMessage/${e.data.username}`}>

                                                <abbr title={e.email}>{e.data.username}</abbr>

                                            </Link>

                                        </li>
                                    ))}
                                </> :
                                    <p>No Friend Added</p>
                                }

                            </ul>
                            <button>Send a Message</button>
                        </div>
                    </div>

                </div>
                :
                <div >
                    <div className={`${(path.includes('/dashboard/GroupChat')) && 'link-active'} has-text-centered`}>
                        <p><abbr className="is-flex is-justify-content-space-around is-align-items-end" title="Group Chat"><FontAwesomeIcon icon={faComments} size="2x" />

                            <b className="has-text-black is-size-6">Group Chat</b>{arrow}</abbr></p>
                    </div>

                    <div className={`${accordion ? "accordion-content" : " active-accordion"}`}>
                        <div className={` is-flex is-flex-direction-column is-justify-content-space-between`}>
                            <ul className="list">
                                {(groups.length > 0) ? <>
                                    {groups.map((e: any) => (
                                        <li>
                                            <Link href={{
                                                pathname: `/dashboard/GroupChat/${e.data.username}`,
                                                query: { friend: `${e.email}` },
                                            }}
                                                as={`/dashboard/GroupChat/${e.data.username}`}>

                                                <abbr title={e.email}>{e.data.username}</abbr>

                                            </Link>

                                        </li>
                                    ))}
                                </> :
                                    <p>No Group Joined</p>
                                }


                            </ul>
                            <button>Send a Message</button>
                        </div>
                    </div>

                </div>
            }

        </>
    )
}
