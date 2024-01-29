import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faRightFromBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/app/firebase/firebaseAuth'

export default function TopNav() {
    const { logout } = useAuth()
    return (
        <div id="top-nav">

            <div>
                address
            </div>

            <div className="right-most">
                <div className='is-flex is-flex-direction-row mr-5 pr-5'>
                    <p className='mx-5 clickable'><abbr className="is-flex is-justify-content-space-around is-align-items-end"
                        title="Message Notification"><FontAwesomeIcon icon={faCommentDots} size="2x" />
                    </abbr></p>
                    <p className='mx-5 clickable'><abbr className="is-flex is-justify-content-space-around is-align-items-end"
                        title="Add Group/Friend Request Notification"><FontAwesomeIcon icon={faUserPlus} size="2x" />
                    </abbr></p>

                </div>
                <div className='mr-3'>
                    <Link href={"/"} onClick={() => logout()} className="has-text-centered">
                        <p ><abbr className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center" title="Sign Out"><FontAwesomeIcon icon={faRightFromBracket} size="2x" />

                            <b className="has-text-black is-size-4">Log Out</b></abbr></p>
                    </Link>
                </div>
            </div>


        </div>
    )
}
