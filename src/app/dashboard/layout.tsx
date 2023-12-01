'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { faUser, faComments, faEnvelope, faRightFromBracket, faMagnifyingGlass, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "../firebase/firebaseAuth";
import FirebaseAPI from "../firebase/firebaseAPI";

import Accordion from "./components/Accordion";



export default function DashboardLayout({ children }: { children: React.ReactNode; }) {

  const { user, logout } = useAuth();
  const { getAllOnlineUsers, getUserDetails } = FirebaseAPI()
  const path = usePathname()
  const [friends, setFriends] = useState([])
  const [groups, setGroups] = useState([])
  const [accordion, setAccordion] = useState(false)

  console.log(getAllOnlineUsers())
  console.log(path)

  const route = useRouter();

  useEffect(() => {
    const give_users = async () => {
      const result = await getUserDetails()
      if (result.friends) {
        console.log(result.friends)
        let x: any = []
        for (const [key, value] of Object.entries(result.friends)) {
          x.push({ email: key, data: value })
          console.log(`${key}: ${value}`);
        }
        setFriends(x)
      }
      if (result.groups) {
        setGroups(result.groups)
      }
      console.log(result)
    }
    give_users()
  }, [])

  if (user === '') {

    return route.push("/login");
  }







  return (

    <main>

      <nav className="has-background-primary un-select side-nav">
        <div className="is-flex is-justify-content-space-between is-flex-direction-column h-100">

          <div className="pt-5">
            <div>
              <Link href={"/dashboard"} className={`${path === '/dashboard' && 'link-active'} has-text-centered`}>
                <p ><abbr title="User" className="is-flex is-justify-content-space-around is-align-items-end"><FontAwesomeIcon icon={faUser} size="2x" />
                  <b className="has-text-black is-size-6">Profile</b></abbr></p>
              </Link>
            </div>

            <hr />

            {/* <div >
              <div onClick={() => setAccordion(accordion ? false : true)} className={`${(path.includes('/dashboard/DirectMessage')) ? 'link-active' : 'has-text-info'} has-text-centered `}>
                <p> <abbr className="is-flex is-justify-content-space-around is-align-items-end" title="Direct Message"><FontAwesomeIcon icon={faEnvelope} size="2x" />
                  <b className="has-text-black is-size-6">Message</b></abbr></p>
              </div>

              <div className={`${accordion ? "accordion-content" : " active-accordion"}`}>
                <div className={` is-flex is-flex-direction-column is-justify-content-space-between`}>
                  <ul className="list">
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
                  </ul>
                  <button>Send a Message</button>
                </div>
              </div>
            
            </div> */}
            <Accordion friends={friends} mode={"friends"} />
            <hr />

            <div>
              <Link href={"/dashboard/GroupChat"} className={`${path === '/dashboard/GroupChat' && 'link-active'} has-text-centered`}>
                <p><abbr className="is-flex is-justify-content-space-around is-align-items-end" title="Group Chat"><FontAwesomeIcon icon={faComments} size="2x" />

                  <b className="has-text-black is-size-6">Group Chat</b></abbr></p>
              </Link>
            </div>

            <hr />
          </div>


          <div className="pb-5">
            <Link href={"/"} onClick={() => logout()} className="has-text-centered">
              <p><abbr className="is-flex is-justify-content-space-around is-align-items-end" title="Sign Out"><FontAwesomeIcon icon={faRightFromBracket} size="2x" />

                <b className="has-text-black is-size-6">Log Out</b></abbr></p>
            </Link>
          </div>
        </div>

      </nav>
      <div className="main h-100">
        {children}
      </div>
    </main>

  );
}
