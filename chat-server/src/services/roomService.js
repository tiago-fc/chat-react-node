var {ROOM, MESSAGE, USER} = require('../common/constants.js');
var ModelRepository = require('../repository');
var UserRepository = ModelRepository(USER);
var RoomRepository = ModelRepository(ROOM);
var MessageRepository = ModelRepository(MESSAGE);

const RoomService = () => {}

RoomService.join = (userName, roomId) => {
    const room = RoomRepository.get(roomId);
    let users = UserRepository.getAll();
    let user = users.find(user => user.name === userName);
    console.log(userName + " entrou");

    if(!user) {
        user = UserRepository.create({name: userName, roomId: roomId});
        users.push(user);
    }
    if(user.roomId !== roomId){
        user.roomId = roomId;
        UserRepository.update(user);
    }
      
    const message = MessageRepository.create({
        roomId: roomId, 
        authorId: user.id, 
        message: userName + " entrou na sala " + room.name
    });
    
    users = users.filter(user => user.roomId === roomId);

    return {users, message};
}

RoomService.createPrivateMessage = (message, userId, userRecipientId, roomId) => {
    console.log("Mensagem: " + message);
    const user = UserRepository.get(userId);
    const newMessage = MessageRepository.create({
        roomId: roomId, 
        authorId: userId, 
        message: user.name + ": " + message,
        recipientId: userRecipientId
    });

    return newMessage;
}

RoomService.createPublicMessage = (message, userId, roomId) => {
    console.log("Mensagem: " + message);
    const user = UserRepository.get(userId);
    const newMessage = MessageRepository.create({
        roomId: roomId, 
        authorId: userId, 
        message: user.name + ": " + message
    });

    return newMessage;
}

RoomService.leave = (userId, roomId) => {
    console.log("Saindo da sala");
    const user = UserRepository.get(userId);
    const message = MessageRepository.create({
        roomId: roomId, 
        authorId: userId, 
        message: user.name + " saiu da sala."
    });

    user.roomId = null;
    UserRepository.update(user);

    return {user, message}; 
}

module.exports = RoomService;