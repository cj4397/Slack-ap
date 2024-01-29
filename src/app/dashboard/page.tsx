'use client'
import React, { useState, useEffect } from "react";
import FirebaseAPI from "../firebase/firebaseAPI";
import AccordionRequest from "./components/AccordionRequest";
import { useAuth } from "../firebase/firebaseAuth";

interface User {
  id: number;
  email: string;
}

interface Group {
  officer?: boolean,
  notification?: unknown
}

export default function DashboardPage() {
  const { friends, groups, userName, email, createdAt } = useAuth()

  const [userDetails, setUserDetails] = useState<{ created_at: number, username: string, email: string } | undefined>()
  const [userFriends, setUserFriends] = useState<{ email: string, username: string }[]>([])
  const [userGroup, setUserGroup] = useState<{ group: string, members: Group }[]>([])
  // const { getUserDetails, getFriendRequest, getGroupJoinRequest } = FirebaseAPI()
  const [friendRequest, setFriendRequest] = useState<{ email: string, username: string }[]>([])



  // useEffect(() => {


  //   const give_users = async () => {
  //     const result = await getUserDetails()
  //     setUserDetails(result.details)
  //     setUserFriends(result.friends)
  //     setUserGroup(result.groups)
  //     const getGroupRequest = await getGroupJoinRequest(result.groups)
  //     console.log(getGroupRequest)
  //     const getRequests = await getFriendRequest()
  //     setFriendRequest(getRequests)

  //   }
  //   give_users()
  // }, [])


  let date

  // if (userDetails != undefined) {
  date = (new Date(createdAt).getMonth() + 1) + '-' + new Date(createdAt).getDate() + '-' + new Date(createdAt).getFullYear()
  // }


  return (
    <div >

      <div className='un-select has-background-light nav-section'>
        <div className="pt-5">
          <AccordionRequest list={friendRequest} title='Friend Request' />
        </div>
        <hr />
        <div>
          Group Join Request
        </div>
      </div>

      <div className="main-section">
        <section className="box">
          <div className="has-text-centered	">
            <img src="https://bulma.io/images/placeholders/128x128.png" alt="" />
          </div>

          Name:
          <br />
          <p className="ml-5">{userName}</p>
          <br />
          Email:
          <br />
          <p className="ml-5">{email}</p>
          <br />
          Created at:
          <br />
          <time className="ml-5">{date}</time>


        </section>
        <p className="h1">Friends</p>
        <section className="box">

          <div className="columns">
            {(friends.length > 0) ? <>
              {friends.map((e) => (
                <div key={e.details.email}>
                  <abbr key={e.details.email} title={e.details.email}>{e.details.username}</abbr>
                </div>
              ))}
            </> : <>
              No Friends Registered
            </>}
          </div>
          <div>

          </div>
        </section>
        <p className="h1">Groups</p>

        <section className="box">

          <div className="columns">

            {(groups.length > 0) ? <>
              {groups.map((e) => (
                <div key={e.name}>
                  <abbr key={e.name} title={e.details.officer ? 'Officer' : 'Member'}>{e.name}</abbr>
                </div>
              ))}
            </> : <>
              No Groups Registered
            </>}

          </div>
        </section>
      </div>







    </div>
  );
};

