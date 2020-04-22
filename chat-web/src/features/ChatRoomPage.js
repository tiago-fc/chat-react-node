import React from "react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "./ChatRoomPage.css";
import SendMessageForm from "./SendMessageForm";
import MessageList from "./MessageList";
import UserList from "./UserList";
import history from '../History';
import socket from "../events/Socket"

function ChatRoomPage({location}) {
  let nickName = location.state.nickName;
  let roomId = location.state.roomId;
  let sessionMessages = JSON.parse(localStorage.getItem('messages')) || [];
  sessionMessages = sessionMessages.filter(message => message.roomId === roomId);
  let sessionUsers = JSON.parse(localStorage.getItem('users')) || [];
  sessionUsers = sessionUsers.filter(user => user.roomId === roomId);
  const [messages, setMessages] = useState(sessionMessages);
  const [users, setUsers] = useState(sessionUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  

  const getUserId = () => {
    const user = users.find(user => user.name === nickName);
    return user ? user.id : -1;
  }

  const leaveRoom = () => {
    const userId = getUserId();
    socket.emit("leaveRoom", userId, roomId);
    localStorage.clear();
    history.goBack();
  }

  const changeSelectedUser = (user) => {
    selectedUser !== user ? setSelectedUser(user) : setSelectedUser(null); 
  }

  socket.on("userJoined", (users, message) => {
    const updatedMessages = messages.concat(message);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setUsers(users);
    setMessages(updatedMessages);
  });

  socket.on("userLeft", (user, message) => {
    const updatedUsers = users.filter(roomUser => roomUser.id !== user.id);
    const updatedMessages = messages.concat(message);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setUsers(updatedUsers);
    setMessages(updatedMessages);
  });

  socket.on("messageSent", message => {
    if(!message.recipientId || message.recipientId === getUserId() || message.authorId === getUserId()) {
      const updatedMessages = messages.concat(message);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    }
  });

  const connectToRoom = () => {
      socket.emit("joinRoom", nickName, roomId);
  };

  const sendMessage = (newMessage) => {
    if(!selectedUser)
      socket.emit("sendPublic", newMessage, getUserId(), roomId);
    else
      socket.emit("sendPrivate", newMessage, getUserId(), selectedUser.id, roomId);
  };

  useEffect(() => {
      connectToRoom();

      return () => {
        socket.off("messageSent");
        socket.off("userJoined");
        socket.off("userLeft");
        localStorage.clear();
      }; 
  },[])


  return (
    <div className='chat-room-page'>
    <div className="panel1">
        <MessageList messages={messages} />
        <UserList users={users} selectUser={changeSelectedUser} selectedUser={selectedUser} />
    </div>
    <div className="painel2">
        <SendMessageForm sendMessage={sendMessage} />
        <div className="leave-button">
          <Button onClick={leaveRoom}>
            Sair da Sala
          </Button>
        </div>
    </div>   
    </div>
  );
}

export default ChatRoomPage;
