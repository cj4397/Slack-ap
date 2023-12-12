'use client'
import React, { useState, useEffect } from "react";
import FirebaseAPI from "../firebase/firebaseAPI";
import AccordionRequest from "./components/AccordionRequest";


interface User {
  id: number;
  email: string;
}


export default function DashboardPage() {

  const [userDetails, setUserDetails] = useState<{ created_at: number, username: string, email: string } | undefined>()
  const [userFriends, setUserFriends] = useState<{ email: string, username: string }[]>([])
  const [userGroup, setUserGroup] = useState<string[]>([])
  const { getUserDetails, getFriendRequest } = FirebaseAPI()
  const [friendRequest, setFriendRequest] = useState<{ email: string, username: string }[]>([])



  useEffect(() => {
    const give_users = async () => {
      const result = await getUserDetails()
      setUserDetails(result.details)
      setUserFriends(result.friends)
      setUserGroup(result.groups)
      const getRequests = await getFriendRequest()
      setFriendRequest(getRequests)
    }
    give_users()
  }, [])


  let date

  if (userDetails != undefined) {
    date = (new Date(userDetails.created_at).getMonth() + 1) + '-' + new Date(userDetails.created_at).getDate() + '-' + new Date(userDetails.created_at).getFullYear()
  }


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
          {(userDetails != undefined) && <>
            Name:
            <br />
            <p className="ml-5">{userDetails.username}</p>
            <br />
            Email:
            <br />
            <p className="ml-5">{userDetails.email}</p>
            <br />
            Created at:
            <br />
            <time className="ml-5">{date}</time>
          </>}

        </section>
        <p className="h1">Friends</p>
        <section className="box">

          <div className="columns">
            {(userGroup.length > 0) ? <>
              {userGroup.map((e) => (
                <div key={e}>
                  {e}
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
            {(userFriends.length > 0) ? <>
              {userFriends.map((e) => (
                <div key={e.email}>
                  <abbr key={e.email} title={e.email}>{e.username}</abbr>
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

