'use client'
import React, { useState, useEffect } from 'react';
import { useDatabase } from './fetchings';

interface User {
  id: number;
  email: string;
}

interface SearchProps {
  onSendMessage: (userId: number, message: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSendMessage }) => {
  const { getUsers } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [searchTerm, users]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSendMessage = (userId: number) => {
    const message = prompt('Enter your message');
    if (message) {
      onSendMessage(userId, message);
    }
  };

  return (
    <div>
      <h2>Search Users</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search by email"
      />
      {searchTerm && filteredUsers.length > 0 ? (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              {user.email}
              <button onClick={() => handleSendMessage(user.id)}>Send Message</button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Search;
