import React from "react";
import { Router, Route } from "react-router-dom";
import "./App.css";
import ChatPage from "./features/ChatPage";
import ChatRoomPage from "./features/ChatRoomPage";
import { useEffect } from "react";
import history from './History';

function App({ location }) {
  useEffect(() => {});

  return (
    <div className="App">
      <Router history={history}>
        <Route path="/" exact component={ChatPage} />
        <Route path="/chatroom/:roomName" exact component={ChatRoomPage} />
      </Router>
    </div>
  );
}

export default App;
