var RoomService = require('../services/roomService.js');

const registerRoomEvents = (io, socket) => {
    socket.on("joinRoom", (userName, roomId) => {
        socket.join(roomId);
        try {
            const joinInfo = RoomService.join(userName, roomId);
            io.in(roomId).emit("userJoined", joinInfo.users, joinInfo.message);
        }
        catch(error) {
            console.log(error);
            io.in(roomId).emit("error", "Ocorreu erro ao entrar na sala. Tente novamente mas tarde");
        }
        
    });

    socket.on("sendPublic", (message, userId, roomId) => {
        try {
            const newMessage = RoomService.createPublicMessage(message, userId, roomId);
            io.in(roomId).emit("messageSent", newMessage);
        }
        catch(error) {
            console.log(error);
            io.in(roomId).emit("error", "Ocorreu erro ao enviar a mensagem. Tente novamente mas tarde");
        }
    });

    socket.on("sendPrivate", (message, userId, userRecipientId, roomId) => {
        try {
            const newMessage = RoomService.createPrivateMessage(message, userId, userRecipientId, roomId);
            io.in(roomId).emit("messageSent", newMessage);
        }
        catch(error) {
            console.log(error);
            io.in(roomId).emit("error", "Ocorreu erro ao enviar a mensagem para o destinatário. Tente novamente mas tarde");
        }
    });

    socket.on("leaveRoom", (userId, roomId) => {
        try {
            const leaveInfo = RoomService.leave(userId, roomId);
            io.in(roomId).emit("userLeft", leaveInfo.user, leaveInfo.message);
        }
        catch(error) {
            console.log(error);
            io.in(roomId).emit("error", "Ocorreu erro ao sair da sala. Tente novamente mas tarde");
        }
    });

}

module.exports = {registerRoomEvents};