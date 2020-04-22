var ChatService = require('../services/chatService.js');

const registerChatEvents = (io, socket) => {
    socket.on("listRooms", () => {
        try {
            const rooms = ChatService.getRooms();
            if(!rooms.length) {
                rooms.push(ChatService.createRoom('Esporte'));
                rooms.push(ChatService.createRoom('Cultura'));
                rooms.push(ChatService.createRoom('Política'));
                rooms.push(ChatService.createRoom('Casual'));
            }
            io.emit("roomsListed", rooms);
        }
        catch(error) {
            console.log(error);
            io.emit("error", "Ocorreu erro ao listar as sala. Tente novamente mas tarde");
        }
    });

    socket.on("createRoom", (name) => {
        try {
            const room = ChatService.createRoom(name);
            io.emit("roomCreated", room);
        }
        catch(error) {
            console.log(error);
            io.emit("error", "Ocorreu erro ao criar a sala. Tente novamente mas tarde");
        }
    });
}


module.exports = {registerChatEvents};