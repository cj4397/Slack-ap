'use client'
import React, { useState, useEffect } from "react";
import FirebaseAPI from "../firebase/firebaseAPI";
import SendMessage from "./components/modals/SendMessage";
import { useAuth } from "../firebase/firebaseAuth";
import MiniLinks from "./components/MiniLinks";

interface User {
  id: number;
  email: string;
}


export default function DashboardPage() {
  // const { sendMessageAPIUser, getUsers } = useDatabase()
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState<string>("");
  const [userDetails, setUserDetails]: any = useState({})




  const { getAllUsers, getUserDetails } = FirebaseAPI()

  const [users, setUsers]: any[] = useState([])
  useEffect(() => {
    const give_users = async () => {
      const result = await getUserDetails()
      setUsers(await getAllUsers())
      setUserDetails(result)
    }
    give_users()
  }, [])
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const usersData = await getUsers();
  //       console.log(usersData)
  //       setUsers(usersData.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchUsers();
  // }, [])

  const searcher = (e: string) => {
    setSearchTerm(e)
    if (e.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter((user: any) => user.data.email.toLowerCase().includes(e.toLowerCase())
      );
      console.log(filtered);
      setFilteredUsers(filtered);
    }
  }


  const handleSendMessage = async () => {
    // if (!selectedUserId || message.trim() === "") return;

    // try {
    //   await sendMessageAPIUser({
    //     userId: selectedUserId,
    //     message: message,
    //   });
    //   closeModal();
    //   setSuccessMessage("Message sent successfully");

    //   // Clear success message after 3 seconds
    //   setTimeout(() => {
    //     setSuccessMessage("");
    //   }, 3000);
    // } catch (error) {
    //   console.error(error);
    //   setError("Failed to send message");
    // }
  };

  const openModal = (userId: string) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUserId('');
    setMessage("");
    setShowModal(false);
  };

  let date = new Date(userDetails.created_at).getMonth() + '-' + new Date(userDetails.created_at).getDate() + '-' + new Date(userDetails.created_at).getFullYear()
  return (
    <div >
      <MiniLinks />
      <section className="box">
        <div className="has-text-centered	">
          <img src="https://bulma.io/images/placeholders/128x128.png" alt="" />
        </div>
        {userDetails.username && <>
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
      <section className="box">
        Friends
        <div>

        </div>
      </section>
      <section className="box">
        Groups
        <div>

        </div>
      </section>

      {/* <input
        type="text"
        value={searchTerm}
        onChange={(e) => searcher(e.target.value)}
        placeholder="Search users..."
      />
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
      <ul>
        {filteredUsers.map((user: any) => (
          <li key={user.key}>
            {user.data.email}
            <button onClick={() => openModal(user.key)}>Send a Message</button>
          </li>
        ))}
      </ul> */}
      {showModal && (
        <SendMessage showModal={showModal} setShowModal={setShowModal} />
      )}



    </div>
  );
};

