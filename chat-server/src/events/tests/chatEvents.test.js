
ChatService = require('../../services/chatService.js');
const { registerChatEvents } = require('../chatEvents');


describe("Testes do chatEvents", () => {
 
  let listRoomsCallback, createRoomCallback, ioMock, socketMock;

  beforeEach((done) => {
    ioMock = {
      emit: jest.fn((event, data) => {})
    }
    
    socketMock = {
      on: jest.fn((event, callback) => {
        switch (event) {
          case "listRooms": listRoomsCallback = callback; break;
          case "createRoom": createRoomCallback = callback; break;
          default: break;

        }
      })
    }
    done();
    
  })

  it("Valida a função registerChatEvents",  (done) => {
    ChatService.getRooms = jest.fn();
    ChatService.createRoom = jest.fn();
    
    registerChatEvents(ioMock, socketMock);
    expect(socketMock.on.mock.calls.length).toBe(2);

    done();
  });

  it("Valida o evento listRooms - Nenhuma sala na base",  (done) => {
    registerChatEvents(ioMock, socketMock);
    ChatService.getRooms = jest.fn(() => []);
    ChatService.createRoom = jest.fn();
    
    listRoomsCallback();
    expect(ChatService.createRoom).toHaveBeenCalledTimes(4);

    done();
  });

  it("Valida o evento listRooms - Salas já criadas",  (done) => {
    registerChatEvents(ioMock, socketMock);
    ChatService.getRooms = jest.fn(() => [{name:"Sala1"}]);
    ChatService.createRoom = jest.fn();
    
    listRoomsCallback();
    expect(ChatService.createRoom).not.toHaveBeenCalled();
    expect(ioMock.emit.mock.calls[0][0]).toEqual("roomsListed");
    expect(ioMock.emit.mock.calls[0][1]).toEqual([{name:"Sala1"}]);

    done();
  });

  it("Valida o evento listRooms - Erro",  (done) => {
    registerChatEvents(ioMock, socketMock);
    ChatService.getRooms = jest.fn(() => {throw new Error()});
    ChatService.createRoom = jest.fn();
    
    listRoomsCallback();
    expect(ChatService.createRoom).not.toHaveBeenCalled();
    expect(ioMock.emit.mock.calls[0][0]).toEqual("error");

    done();
  });

  it("Valida o evento createRoom",  (done) => {
    registerChatEvents(ioMock, socketMock);
    ChatService.createRoom = jest.fn((name) =>{
      return {name: name};
    });
    
    createRoomCallback("Nova Sala");
    expect(ChatService.createRoom).toHaveBeenCalledWith("Nova Sala");
    expect(ioMock.emit.mock.calls[0][0]).toEqual("roomCreated");
    expect(ioMock.emit.mock.calls[0][1]).toEqual({name: 'Nova Sala'});
    done();
  });

  it("Valida o evento createRoom - Erro",  (done) => {
    registerChatEvents(ioMock, socketMock);
    ChatService.createRoom = jest.fn(() => {throw new Error()});
    
    listRoomsCallback();
    expect(ioMock.emit.mock.calls[0][0]).toEqual("error");

    done();
  });
    
});