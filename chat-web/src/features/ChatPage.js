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
  const [newRoom, setNewRoom] = useState("");
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

  const createRoom = () => {
    socket.emit("createRoom", newRoom);
  };

  socket.on("roomsListed", rooms => {
    setRooms(rooms);
  });

  socket.on("roomCreated", room => {

    setRooms(rooms.concat(room));
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
              <Form.Group as={Col} xs={6} md={6} lg={6} controlId="handle">
                <Form.Label>Apelido:</Form.Label>
                <Form.Control
                  type="text"
                  name="handle"
                  value={nickName}
                  onChange={evt => setNickName(evt.target.value)}
                  style={{ width: "80%" }}
                />
              </Form.Group>
              <Form.Group as={Col} xs={6} md={6} lg={6} controlId="handle">
                <Form.Label>Nova Sala:</Form.Label>
                <Form.Control
                  type="text"
                  name="handle"
                  value={newRoom}
                  onChange={evt => setNewRoom(evt.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} xs={6} md={6} lg={6} controlId="chatRoomName">
              <Form.Label>Escolha a Sala:</Form.Label>
                <ListGroup>
                    {rooms.map((room, index) => {
                      return (
                        <ListGroup.Item key={index} onClick={() => setSelectedRoom(room)} active={roomSelected.name === room.name}>{room.name}</ListGroup.Item>
                      )
                    })}
                </ListGroup>
              </Form.Group>
              <Form.Group as={Col} xs={6} md={6} lg={6} controlId="chatRoomName">   
                <Button onClick={createRoom} >                 
                  Criar
                </Button>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} xs={6} md={6} lg={6} controlId="chatRoomName">   
                <Button onClick={enterRoom} style={{ marginRight: "10px" }}>                 
                  Entrar
                </Button>
              </Form.Group>
            </Form.Row>
           
            {error.length > 0 &&  <Form.Label ac>error</Form.Label>}
          </Form>
    </div>
  );
}

export default ChatPage;
