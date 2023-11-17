'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Stack } from "@mui/material";
// import { useAuth } from "../auth";
// import { useDatabase } from "../fetchings";

import { useRouter } from "next/navigation";
import Database from "../firebase/Database";
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebase_app from "../firebase/config";
import { useAuth } from "../firebase/firebaseAuth";

interface Message {
  id: number;
  content: string;
}

export default function DashboardLayout({ children, }: { children: React.ReactNode; }) {
  const { user, logout } = useAuth();

  const auth = getAuth(firebase_app);
  const see = onAuthStateChanged(auth, (x) => {
    console.log(x)
  })

  useEffect(() => {
    see()
    console.log('x')
  }, [])


  const route = useRouter();
  // const { getUsers, getMessageUser }: any = useDatabase();
  const [users, setUsers]: any = useState([]);
  const [messages, setMessages]: any = useState<Record<number, Message[]>>([]);
  const [int, setInt] = useState(0)

  // const fetchMessages = async (id: number) => {
  //   try {

  //     if (int > 99) {
  //       setTimeout(async () => {
  //         const response = await getMessageUser(id);

  //         if (response.data.length > 0) {
  //           setMessages(response.data);
  //           if (int == 99) {
  //             setInt(0)
  //           }
  //         }
  //       }, 100 + (int * 100))
  //     } else {
  //       const response = await getMessageUser(id);
  //       if (response.data.length > 0) {
  //         setMessages(response.data);
  //       }
  //       console.log(response)
  //     }

  //     //when userID is hardcoded, it can fetch the messages from this user, but here it does not fetch any messages when a variable is passed, then blames the UserData being null. 


  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   let max_id = 0
  //   const fetchUsers = async () => {
  //     try {
  //       const usersData = await getUsers();
  //       console.log(usersData)
  //       setUsers(usersData.data);
  //       usersData.data.forEach((x: any) => {

  //         setInt(int + 1)
  //         fetchMessages(x.id)

  //       })


  //     } catch (error) {
  //       console.error(error);
  //     }

  //   };
  //   fetchUsers();

  // }, [])

  // useEffect(() => {


  //   // fetchMessages(430);
  // }, []);

  // const handleShowMessages = () => {
  //   console.log('clicked')
  // }

  if (user === '') {
    // Redirect to login page if user is not authenticated
    return route.push("/login");
  }
  console.log(user);



  const { db } = Database()


  return (
    <>
      <section>
        <Grid2 container spacing={2}>
          <Grid2 xs={3}>
            <h1>Side Navigation</h1>
            <Stack id="sidenav">
              <Link href={"/"} onClick={() => logout()}>
                Log Out
              </Link>
              <h1>Channels</h1>
              <h1>Direct Messages</h1>
              {users.map((user: any) => {
                if (messages.some((message: any) => message.receiver.id === user.id && message.receiver.id !== 2)) {
                  return (
                    <div key={user.id}>
                      <p>{user.email}</p>
                    </div>
                  );
                }
                return null;
              })
              }
            </Stack>
          </Grid2>
          <Grid2 xs={9}>
            {children}
            {/* <DashboardPage users={users} /> */}
          </Grid2>
        </Grid2>
      </section>
    </>
  );
}
