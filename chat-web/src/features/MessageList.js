import React from "react";
import "./MessageList.css";

function MessageList({messages, userId}) {
    
    return (
    <div className="message-list">
    <ul>                 
        {messages.map((message, index) => {
        return (
            <li key={index}>
            <div>
                {message.message}
            </div>
            </li>
        )
        })}
    </ul>
    </div>
    )
    
  }

  export default MessageList;