import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import "./UserList.css";

function UserList({users, selectUser, selectedUser}) {
    
    return (
        <div className='user-list'>
        <label>Usuários: </label>
        <ListGroup className="list-group">
            {users.map((user, index) => {
                return (
                <ListGroup.Item key={index} onClick={() => selectUser(user)} active={selectedUser && selectedUser.name === user.name}>{user.name}</ListGroup.Item>
                )
            })}
        </ListGroup>
        </div>
    )
    
  }

  export default UserList;