import React from "react";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import "./ChatPage.css";
import history from '../History';
import socket from "../events/Socket"

function ChatPage() {
  const [nickName, setNickName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomSelected, setSelectedRoom] = useState({});
  const [error, setError] = useState("");
  
  const enterRoom = () => {
    history.push({
      pathname:  `/chatroom/${roomSelected.name}`,
      state: { nickName: nickName, roomId: roomSelected.id }
    });

    socket.off("roomsListed");
    socket.off("error");
  };

  socket.on("roomsListed", rooms => {
    setRooms(rooms);
  });

  socket.on("error", msg => {
    setError(msg);
  });

  useEffect(() => {
    socket.emit("listRooms");
  },[]);

  return (
    <div className="chat-page">
      <h1>Entrar na sala</h1>
          <Form noValidate>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="handle">
                <Form.Label>Apelido:</Form.Label>
                <Form.Control
                  type="text"
                  name="handle"
                  value={nickName}
                  onChange={evt => setNickName(evt.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="chatRoomName">
              <Form.Label>Escolha a Sala:</Form.Label>
                <ListGroup>
                    {rooms.map((room, index) => {
                      return (
                        <ListGroup.Item key={index} onClick={() => setSelectedRoom(room)} active={roomSelected.name === room.name}>{room.name}</ListGroup.Item>
                      )
                    })}
                </ListGroup>
              </Form.Group>
            </Form.Row>
            <Button onClick={enterRoom} style={{ marginRight: "10px" }}>
              Entrar
            </Button>
            {error.length > 0 &&  <Form.Label ac>error</Form.Label>}
          </Form>
    </div>
  );
}

export default ChatPage;
