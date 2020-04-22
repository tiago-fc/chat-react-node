var {ROOM} = require('../common/constants.js');
var ModelRepository = require('../repository');
var RoomRepository = ModelRepository(ROOM);

const ChatService = () => {}

ChatService.getRooms = () => {
    const rooms = RoomRepository.getAll();
    return rooms;
}

ChatService.createRoom = (name) => {
    const room = RoomRepository.create({name: name})
    return room;
}


module.exports = ChatService;