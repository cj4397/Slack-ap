'use client'
import React, { Children, useEffect, useState } from "react";
import Link from "next/link";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Stack } from "@mui/material";
import { useAuth } from "../auth";
import { useDatabase } from "../fetchings";
import DashboardPage from "./page";
import { useRouter } from "next/navigation";

// interface User {
//   id: number;
//   email: string;
// }

interface Message {
  id: number;
  content: string;
}

export default function DashboardLayout({ children, }: { children: React.ReactNode; }) {
  const { user, logout }: any = useAuth();
  const route = useRouter();
  const { getUsers, getMessageUser } = useDatabase();
  const [users, setUsers]: any = useState([]);
  const [messages, setMessages]: any = useState<Record<number, Message[]>>([]);
  // const userID: number = user.data.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        console.log(usersData)
        setUsers(usersData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessageUser(user.data.id); //when userID is hardcoded, it can fetch the messages from this user, but here it does not fetch any messages when a variable is passed, then blames the UserData being null. 
        console.log(response)
        const messagesData = response.data
        if (messagesData.length > 0) {
          setMessages(messagesData);
        }
      } catch (error) {
        console.error(error);
      }
    };


    fetchMessages();
  }, []);

  // const handleShowMessages = () => {
  //   console.log('clicked')
  // }

  if (user === null) {
    // Redirect to login page if user is not authenticated
    return route.push("/login");
  }
  console.log(messages);

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
                if (messages.some((message: any) => message.receiver.id === user.id && message.receiver.id !== user.data.id)) {
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
