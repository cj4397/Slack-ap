'use client'
import React, { useState, useEffect } from "react";
import { useDatabase } from "../fetchings"

interface User {
  id: number;
  email: string;
}

interface DashboardPageProps {
  users: User[];
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { sendMessageAPIUser } = useDatabase()
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = props.users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, props.users]);

  const handleSendMessage = async () => {
    if (!selectedUserId || message.trim() === "") return;
  
    try {
      await sendMessageAPIUser({
        userId: selectedUserId,
        message: message,
      });
      closeModal();
      setSuccessMessage("Message sent successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to send message");
    }
  };

  const openModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUserId(null);
    setMessage("");
    setShowModal(false);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.email}
            <button onClick={() => openModal(user.id)}>Send a Message</button>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Send Message</h2>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
