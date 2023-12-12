'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "../firebase/firebaseAuth";
import FirebaseAPI from "../firebase/firebaseAPI";

import AccordionFriends from "./components/AccordionFriends";
import Loader from "./components/Loader";
import { onChildChanged, ref } from "firebase/database";
import AccordionGroups from "./components/AccordionGroups";

import { getDatabase, update, onValue } from "firebase/database";






interface Friend {
  email: string, username: string
}


interface Data {
  messages: string,
  sender: string,
  created_at: number
}


export default function DashboardLayout({ children }: { children: React.ReactNode; }) {

  const { user, email, logout } = useAuth();
  const { getAllOnlineUsers, getUserDetails, db } = FirebaseAPI()
  const path: string = usePathname()

  const [loader, setLoader] = useState<boolean>(true)

  const [groups, setGroups] = useState<string[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const route = useRouter();

  const [online, setOnline] = useState<string[]>([])
  const [change, setChange] = useState<boolean>(false)
  const [detailChange, setDetailChange] = useState<boolean>(false)

  const re_email: string = email.split('.').join('')

  //onChildChanged will get the table /data that has benn changed in the ref
  onChildChanged(ref(db, '/users'), (snapshot) => {
    snapshot.forEach((childSnapshot) => {

      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      let x = false
      if (childKey === 'email' && online.includes(childData)) {
        x = true
      }
      if (childKey === 'status' && x && childData === "offline") {

        setChange(change ? false : true)
        console.log(friends)
      }
    });

  })

  onChildChanged(ref(db, `/users/${re_email}/friends/request/notification`), () => {

    console.log('add a get request notifier')

  })

  useEffect(() => {
    const getChange = async () => {
      const result = await getUserDetails()
      if (result.friends) {
        setFriends(result.friends)
      }
      if (result.groups) {
        setGroups(result.groups)
      }

      setLoader(false)
    }
    setLoader(true)
    getChange()
  }, [detailChange])

  useEffect(() => {
    const getOnline = async () => {
      setOnline(await getAllOnlineUsers())

      setLoader(false)
    }
    setLoader(true)
    getOnline()
  }, [change])



  if (user === '') {

    return route.push("/login");
  }


  const connectedRef = ref(db, ".info/connected");
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log("connected");
    } else {
      update(ref(db, 'users/' + email.split('.').join('')), {
        status: 'offline'
      });
      console.log("not connected");
    }
  });

  return (

    <main>
      {loader ? <Loader /> :
        <>
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

                <AccordionFriends friends={friends} online={online} />
                <hr />

                <div>
                  <AccordionGroups groups={groups} online={online} />

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
        </>
      }


    </main>

  );
}
