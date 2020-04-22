var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { registerChatEvents } = require('./events/chatEvents');
const { registerRoomEvents } = require('./events/roomEvents');
var { localStorage } = require('./repository/localStorage')

app.get('/', (req, res) => {
  res.send('server is running');
});

io.on("connection", (socket) => {
    registerChatEvents(io, socket);
    registerRoomEvents(io, socket);
});

http.listen(4000, function(){
  console.log('listening on port 4000');
});
