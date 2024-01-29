import React from 'react'
import AccordionGroups from './AccordionGroups'
import AccordionFriends from "./AccordionFriends";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface Online {
    email: string,
    username: string
}

interface Group {
    officer: boolean,
}

export default function SideNav(props: {
    friends: { name: string, details: { username: string, email: string, created_at: number } }[],
    groups: { name: string, details: Group }[],
    online: Online[]
}) {
    const { friends, online, groups } = props
    const path: string = usePathname()
    return (
        <nav id="side-nav" className="has-background-primary un-select side-nav">
            <div className="is-flex is-justify-content-space-between is-flex-direction-column h-100">

                <div className="pt-5">
                    <div>
                        <Link href={"/dashboard"} className={`${path === '/dashboard' && 'link-active'} has-text-centered`}>
                            <p ><abbr title="User" className="is-flex is-justify-content-space-around is-align-items-end"><FontAwesomeIcon icon={faUser} size="2x" />
                                <b className="has-text-black is-size-6">Profile</b></abbr></p>
                        </Link>
                    </div>

                    <hr />

                    <AccordionFriends friends={friends} online={online} />
                    <hr />

                    <div>
                        <AccordionGroups groups={groups} online={online} />

                    </div>

                    <hr />
                </div>



            </div>

        </nav>
    )
}
