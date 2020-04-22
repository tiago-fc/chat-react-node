
RoomService = require('../../services/roomService.js');
const { registerRoomEvents } = require('../roomEvents');


describe("Testes do roomEvents", () => {
 
  let joinRoomCallback, 
  sendPublicCallback, 
  sendPrivateCallback, 
  leaveRoomCallback, 
  ioMock, 
  inMock,
  socketMock;


  beforeEach((done) => {
    inMock = {
      emit: jest.fn()
    }

    ioMock = {
      in: jest.fn((roomId) => {
          return inMock;
      })
    }
    
    socketMock = {
      on: jest.fn((event, callback) => {
        switch (event) {
          case "joinRoom": joinRoomCallback = callback; break;
          case "sendPublic": sendPublicCallback = callback; break;
          case "sendPrivate": sendPrivateCallback = callback; break;
          case "leaveRoom": leaveRoomCallback = callback; break;
          default: break;

        }
      }),

      join: jest.fn()
    }
    done();
    
  })

  it("Valida a função registerRoomEvents",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    expect(socketMock.on.mock.calls.length).toBe(4);
    expect(joinRoomCallback).toBeDefined();
    expect(sendPublicCallback).toBeDefined();
    expect(sendPrivateCallback).toBeDefined();
    expect(leaveRoomCallback).toBeDefined();

    done();
  });

  it("Valida o evento joinRoom",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    RoomService.join = jest.fn(() => {
       return {users: [], message:'Entrei'}
    });
    
    joinRoomCallback("Tiago", 1);
    expect(RoomService.join).toHaveBeenCalled();
    expect(socketMock.join.mock.calls[0][0]).toEqual(1);
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("userJoined");
    expect(inMock.emit.mock.calls[0][1]).toEqual([]);
    expect(inMock.emit.mock.calls[0][2]).toEqual('Entrei');

    done();
  });

  it("Valida o evento joinRoom - Erro",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    RoomService.join = jest.fn(() => {throw new Error()});
    
    joinRoomCallback("Tiago", 1);
    expect(RoomService.join).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("error");

    done();
  });

  it("Valida o evento sendPublic",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    const msg = "Oi Tiago";
    const newMessage = {message:msg};
    RoomService.createPublicMessage = jest.fn(() => {
       return newMessage
    });
    
    sendPublicCallback(msg, 1, 1);
    expect(RoomService.createPublicMessage).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("messageSent");
    expect(inMock.emit.mock.calls[0][1]).toEqual(newMessage);

    done();
  });

  it("Valida o evento sendPublic - Erro",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    RoomService.createPublicMessage = jest.fn(() => {throw new Error()});
    
    sendPublicCallback('', 1, 1);
    expect(RoomService.createPublicMessage).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("error");

    done();
  });

  it("Valida o evento sendPrivate",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    const msg = "Oi Tiago";
    const newMessage = {message:msg};
    RoomService.createPrivateMessage = jest.fn(() => {
       return newMessage
    });
    
    sendPrivateCallback(msg, 1, 2, 1);
    expect(RoomService.createPrivateMessage).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("messageSent");
    expect(inMock.emit.mock.calls[0][1]).toEqual(newMessage);

    done();
  });

  it("Valida o evento sendPrivate - Erro",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    RoomService.createPrivateMessage = jest.fn(() => {throw new Error()});
    
    sendPrivateCallback('', 1, 2, 1);
    expect(RoomService.createPrivateMessage).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("error");

    done();
  });

  it("Valida o evento leaveRoom",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    const msg = "Oi Tiago";
    const leaveInfo = {user: {name: 'Tiago'}, message:{message: 'Saiu'}};
    RoomService.leave = jest.fn(() => {
       return leaveInfo
    });
    
    leaveRoomCallback(1, 1);
    expect(RoomService.leave).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("userLeft");
    expect(inMock.emit.mock.calls[0][1]).toEqual(leaveInfo.user);
    expect(inMock.emit.mock.calls[0][2]).toEqual(leaveInfo.message);

    done();
  });

  it("Valida o evento leaveRoom - Erro",  (done) => {
    registerRoomEvents(ioMock, socketMock);
    RoomService.leave = jest.fn(() => {throw new Error()});
    
    leaveRoomCallback(1, 1);
    expect(RoomService.leave).toHaveBeenCalled();
    expect(ioMock.in).toHaveBeenCalledWith(1);
    expect(inMock.emit.mock.calls[0][0]).toEqual("error");

    done();
  });
    
});