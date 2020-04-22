var {ROOM, MESSAGE, USER} = require('../../common/constants.js');

describe("Testes do RoomService", () => {
  
  const mockUserRepository = { 
    get: jest.fn(),
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockRoomRepository = { 
    get: jest.fn(),
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockMessageRepository = { 
    get: jest.fn(),
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  var mockModelRepository = (type) => {
    switch (type) {
        case USER: return mockUserRepository;
        case ROOM: return mockRoomRepository;
        case MESSAGE: return mockMessageRepository;
        default: return null;
    }  
  };

  var RoomService;

  beforeAll((done) => {
    jest.mock('../../repository', () =>  {
      return mockModelRepository;
    });

    RoomService = require('../roomService.js');
    done();
  })

  beforeEach((done) => {
    Object.keys(mockUserRepository).forEach(fn => mockUserRepository[fn] = jest.fn());
    Object.keys(mockRoomRepository).forEach(fn => mockRoomRepository[fn] = jest.fn());
    Object.keys(mockMessageRepository).forEach(fn => mockMessageRepository[fn] = jest.fn());
    
    done();
  })

  it("Valida o serviço join - Primeiro acesso ao chat, novo usuário",  (done) => {
    const roomMock = {id:1, name: 'Sala1'};
    const usersMock = [{id:1, name: 'Raquel', roomId: 1}, {id:2, name: 'Fabio', roomId: 1}];
    mockRoomRepository.get = jest.fn(() => {
      return roomMock;
    });
    mockUserRepository.getAll = jest.fn(() => {
      return usersMock;
    });
    mockUserRepository.create = jest.fn(({name, roomId}) => {
      return {id:3, name: name, roomId: roomId};
    });
    mockMessageRepository.create = jest.fn(({roomId, authorId, message}) => {
      return {roomId, authorId, message};
    });
    
    const joinInfo = RoomService.join("Tiago", 1);

    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(joinInfo.users.length).toEqual(3)
    expect(joinInfo.users[2]).toEqual({id:3, name: 'Tiago', roomId: 1});
    expect(joinInfo.message).toEqual({roomId:1, authorId: 3, message: "Tiago entrou na sala Sala1"});
    done();
  });

  it("Valida o serviço join - Usuário muda de sala",  (done) => {
    const roomMock = {id:1, name: 'Sala1'};
    const usersMock = [{id:1, name: 'Raquel', roomId: 1}, {id:2, name: 'Tiago', roomId: null}];
    mockRoomRepository.get = jest.fn(() => {
      return roomMock;
    });
    mockUserRepository.getAll = jest.fn(() => {
      return usersMock;
    });
    mockUserRepository.update = jest.fn(({id, name, roomId}) => {
      return {id, name, roomId};
    });
    mockMessageRepository.create = jest.fn(({roomId, authorId, message}) => {
      return {roomId, authorId, message};
    });
    
    const joinInfo = RoomService.join("Tiago", 1);

    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(joinInfo.users.length).toEqual(2);
    expect(joinInfo.users[1]).toEqual({id:2, name: 'Tiago', roomId: 1});
    expect(joinInfo.message).toEqual({roomId:1, authorId: 2, message: "Tiago entrou na sala Sala1"});
    done();
  });

  it("Valida o serviço join - Usuário encontrado na sala",  (done) => {
    const roomMock = {id:1, name: 'Sala1'};
    const usersMock = [{id:1, name: 'Raquel'}, {id:2, name: 'Tiago', roomId: 1}];
    mockRoomRepository.get = jest.fn(() => {
      return roomMock;
    });
    mockUserRepository.getAll = jest.fn(() => {
      return usersMock;
    });

    mockMessageRepository.create = jest.fn(({roomId, authorId, message}) => {
      return {roomId, authorId, message};
    });
    
    const joinInfo = RoomService.join("Tiago", 1);

    expect(mockUserRepository.create).not.toHaveBeenCalled();
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(joinInfo.users.length).toEqual(1);
    expect(joinInfo.users[0]).toEqual({id:2, name: 'Tiago', roomId: 1});
    expect(joinInfo.message).toEqual({roomId:1, authorId: 2, message: "Tiago entrou na sala Sala1"});
    done();
  });

  it("Valida o serviço createPrivateMessage",  (done) => {
    const userMock = {id:1, name: 'Raquel'};
    mockUserRepository.get = jest.fn(() => {
      return userMock;
    });

    mockMessageRepository.create = jest.fn(({roomId, authorId, message, recipientId}) => {
      return {roomId, authorId, message, recipientId};
    });

    const message = "Oi Tiago";
    const authorId = userMock.id;
    const recipientId = 2;
    const roomId = 1

    const newMessage = RoomService.createPrivateMessage(message, authorId, recipientId, roomId);
    
    expect(mockUserRepository.get).toHaveBeenCalled();
    expect(mockMessageRepository.create).toHaveBeenCalled();
    expect(newMessage).toEqual({roomId:1, authorId: 1, recipientId: 2, message: "Raquel: Oi Tiago"});
    done();
  });

  it("Valida o serviço createPublicMessage",  (done) => {
    const userMock = {id:1, name: 'Raquel'};
    mockUserRepository.get = jest.fn(() => {
      return userMock;
    });

    mockMessageRepository.create = jest.fn(({roomId, authorId, message, recipientId}) => {
      return {roomId, authorId, message, recipientId};
    });

    const message = "Oi Tiago";
    const authorId = userMock.id;
    const roomId = 1

    const newMessage = RoomService.createPublicMessage(message, authorId, roomId);
    
    expect(mockUserRepository.get).toHaveBeenCalled();
    expect(mockMessageRepository.create).toHaveBeenCalled();
    expect(newMessage).toEqual({roomId:1, authorId: 1, message: "Raquel: Oi Tiago"});
    done();
  });

  it("Valida o serviço leave",  (done) => {
    const userMock = {id:1, name: 'Raquel', roomId: 1};
    mockUserRepository.get = jest.fn(() => {
      return userMock;
    });

    mockMessageRepository.create = jest.fn(({roomId, authorId, message, recipientId}) => {
      return {roomId, authorId, message, recipientId};
    });

    mockUserRepository.update = jest.fn(({id, name, roomId}) => {
      return {id, name, roomId};
    });

    const leaveInfo = RoomService.leave(1, 1);

    expect(mockUserRepository.get).toHaveBeenCalled();
    expect(mockMessageRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(leaveInfo.user).toEqual({id:1, name: 'Raquel', roomId: null});
    expect(leaveInfo.message).toEqual({roomId:1, authorId: 1, message: "Raquel saiu da sala."});
    done();
  });
    
});