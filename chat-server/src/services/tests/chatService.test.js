describe("Testes do chatService", () => {
  
  var mockRoomRepository = { 
    create: jest.fn(),
    getAll: jest.fn()
  };
  var mockModelRepository = (type) => {
      return mockRoomRepository;
  };

  var ChatService;

  beforeAll(() => {
    jest.mock('../../repository', () =>  {
      return mockModelRepository;
    });

    ChatService = require('../chatService.js');
  })

  it("Valida o serviço getRooms",  (done) => {
    const roomsMock = [{name: 'Sala1'}, {name: 'Sala2'}]
    mockRoomRepository.getAll = jest.fn(() => {
      return roomsMock;
    });
    const rooms = ChatService.getRooms();
    expect(mockRoomRepository.getAll).toHaveBeenCalled();
    expect(rooms).toEqual(roomsMock);
    done();
  });

  it("Valida o serviço createRoom",  (done) => {
    const roomMock = {name: 'Sala1'};
    mockRoomRepository.create = jest.fn(({}) => {
      return roomMock;
    });
    const room = ChatService.createRoom(roomMock);
    expect(mockRoomRepository.create).toHaveBeenCalled();
    expect(room).toEqual(roomMock);
    done();
  });
    
});