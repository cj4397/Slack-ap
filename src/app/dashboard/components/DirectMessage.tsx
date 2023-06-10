'use client'
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { useDatabase } from "@/app/fetchings";
import { useAuth } from "@/app/auth";

export default function DirectMessagePage() {
  const { getUsers } = useDatabase();
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const result = await getUsers();
      setUserList(result.data);
    }
    fetchUsers();
  }, [getUsers]);

  const sendMessage = (id: [number, string]) => {
    const [userId, userEmail] = id;
    setUserId(userId);
    setUserEmail(userEmail);
    setOpen(true);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUserList = userList.filter((user: any) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const makeUserList = filteredUserList.map((user: any) => (
    <div key={user.id}>
      <p>{user.id}</p>
      <p>{user.email}</p>
      <button onClick={() => sendMessage([user.id, user.email])}>Message</button>
    </div>
  ));

  return (
    <>
      <h1>Direct Message Page</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search users..."
      />
      {searchQuery.trim() !== "" && makeUserList.length > 0 ? (
        makeUserList
      ) : (
        <p>No users found.</p>
      )}
      <Modal userEmail={userEmail} userId={userId} open={open} setOpen={setOpen} />
    </>
  );
}

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: number | null;
  userEmail: string | null;
}

function Modal({ open, setOpen, userId, userEmail }: ModalProps) {
  const { user } = useAuth();
  const { getMessageUser, sendMessageAPIUser } = useDatabase();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      if (userId !== null) {
        const result = await getMessageUser(userId);
        setChat(result.data);
      }
    }
    fetchMessages();
  }, [getMessageUser, userId]);

  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setChat([]);
  };

  const time = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleString();
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      sendMessageAPIUser(user.data.id, userId, message);
      setMessage("");
    }
  };

  const conversation = chat.map((message: any) => (
    <div key={message.id}>
      <p>{message.content}</p>
      <span>{time(message.created_at)}</span>
    </div>
  ));

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div>
          <h1>{userEmail}</h1>
          <div>{conversation}</div>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
