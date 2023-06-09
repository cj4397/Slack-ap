'use client'
import React, { useEffect, useState } from 'react';
import { useDatabase } from '../fetchings';
import Search from '../Search';

interface User {
  id: number;
  email: string;
}

const DashboardPage: React.FC = () => {
  const { getUsers, sendMessageAPIUser } = useDatabase();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response) {
          setUsers(response.data);
        }
      } catch (error) {
        setError('Failed to fetch users');
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setSelectedUser(null);
    setMessageContent('');
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessageToUser = async () => {
    if (selectedUser && messageContent) {
      try {
        await sendMessageAPIUser({ userId: selectedUser.id, message: messageContent });

        console.log(`Message successfully sent to User: ${selectedUser.email}`);
        setMessageContent('');
      } catch (error) {
        console.error('Failed to send message:', error);
        // Handle error here
      }
    }
  };

  const handleSendMessageClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}
      <Search onSearch={handleSearch} />
      {searchTerm && filteredUsers.length > 0 && (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              {user.email}
              <button onClick={() => handleSendMessageClick(user)}>Send Message</button>
            </li>
          ))}
        </ul>
      )}
      {selectedUser && (
        <div>
          <p>Sending message to: {selectedUser.email}</p>
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Enter your message"
          />
          <button onClick={sendMessageToUser}>Send</button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
