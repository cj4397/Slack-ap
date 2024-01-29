'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { faUser, faRightFromBracket, faCommentDots, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "../firebase/firebaseAuth";
import FirebaseAPI from "../firebase/firebaseAPI";

import AccordionFriends from "./components/AccordionFriends";
import Loader from "./components/Loader";
import { onChildAdded, onChildChanged, ref } from "firebase/database";
import AccordionGroups from "./components/AccordionGroups";

import { getDatabase, update, onValue } from "firebase/database";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";



interface Friend {
  email: string, username: string
}


interface Data {
  messages: string,
  sender: string,
  created_at: number
}
interface Group {
  officer?: boolean,
}

interface Online {
  email: string,
  username: string
}



export default function DashboardLayout({ children }: { children: React.ReactNode; }) {

  const { user, email, logout, groups, friends } = useAuth();

  const path: string = usePathname()
  const route = useRouter();



  // const [groupList, setGroups] = useState(groups)
  // const [friendList, setFriends] = useState(friends)
  const [online, setOnline] = useState<Online[]>([])

  // const [change, setChange] = useState<boolean>(false)
  const [loader, setLoader] = useState<boolean>(true)
  // const [detailChange, setDetailChange] = useState<boolean>(false)

  const re_email: string = email.split('.').join('')

  const { db, getOnlineUsers } = FirebaseAPI()

  useEffect(() => {

    const onlineUsers = async () => {
      const result = await getOnlineUsers()
      console.log(result)
      setOnline(result)
      setLoader(false)
    }
    onlineUsers()
  }, [])




  // onChildChanged will get the table /data that has been changed in the ref

  // onChildChanged(ref(db, '/users'), (snapshot) => {
  //   snapshot.forEach((childSnapshot) => {

  //     const childKey = childSnapshot.key;
  //     const childData = childSnapshot.val();
  //     let x = false
  //     if (childKey === 'email' && friends.includes(childData)) {
  //       x = true
  //     }
  //     if (childKey === 'status' && x ) {

  //       setChange(change ? false : true)
  //       console.log(friends)
  //     }
  //   });

  // })

  // onChildAdded(ref(db, `/users/${re_email}/friends/request`), () => {
  //   console.log('add a get request notifier')
  // })

  // onChildChanged(ref(db, `/users/${re_email}/friends`), (snapshot) => {
  //   snapshot.forEach((childSnapshot) => {
  //     const childKey = childSnapshot.key;
  //     const childData = childSnapshot.val();
  //     if (childKey !== 'request'){
  //      ' get new friends message notification'
  //     }
  //   })
  // })

  // onChildChanged(ref(db, `/users/${re_email}/groups`), (snapshot) => {
  //   snapshot.forEach((childSnapshot) => {
  //     const GroupName = childSnapshot.key;
  //     const childData = childSnapshot.val();
  //     if(childData.notification){

  //     }
  //     if(childData.request){

  //     }
  //   })
  // })

  // useEffect(() => {
  //   const getChange = async () => {
  //     const result = await getUserDetails()
  //     if (result.friends) {
  //       setFriends(result.friends)
  //     }
  //     if (result.groups) {
  //       setGroups(result.groups)
  //     }
  //     setLoader(false)
  //   }
  //   setLoader(true)
  //   getChange()
  // }, [detailChange])


  // useEffect(() => {
  //   const getOnline = async () => {
  //     // setOnline(await getAllOnlineUsers())
  //   }
  //   getOnline()
  // }, [change])





  // const connectedRef = ref(db, ".info/connected");
  // onValue(connectedRef, (snap) => {
  //   if (snap.val() === true) {
  //     console.log("connected");
  //   } else {
  //     update(ref(db, 'users/' + email.split('.').join('')), {
  //       status: 'offline'
  //     });
  //     console.log("not connected");
  //   }
  // });

  if (user === '') {
    return route.push("/login");
  }

  return (

    <main>
      {loader ? <Loader /> :
        <>
          <SideNav friends={friends} groups={groups} online={online} />
          <div className="main h-100">
            <TopNav />
            <div id="main">
              {children}
            </div>

          </div>
        </>
      }


    </main>

  );
}
