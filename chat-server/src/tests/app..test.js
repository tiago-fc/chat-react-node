
const { registerChatEvents } = require('../events/chatEvents');
const { registerRoomEvents } = require('../events/roomEvents');


describe("Testes do app", () => {
 
  let mockApp = {get: jest.fn()},
  mockHttp = {listen: jest.fn()},
  mockIo = {
    on: jest.fn((event, callback) => {
        connectionCallback = callback;
        })
    }, 
  mockRegisterChatEvents = jest.fn(), 
  mockRegisterRoomEvents = jest.fn(),
  connectionCallback;

  beforeAll((done) => {
    jest.mock('express', () =>  {
        return () => {
            return mockApp;
        }
    });

    jest.mock('http', () =>  {
        function ServerMock (app) {
            return mockHttp;
        };
      
        return {Server: ServerMock}
    });

    jest.mock('socket.io', () =>  {
        function IoMock (http) {
            return mockIo;
        };
      
        return IoMock;
    });
    
    jest.mock('../events/chatEvents', () =>  {
        return {
            registerChatEvents: mockRegisterChatEvents
        };
    });

    jest.mock('../events/roomEvents', () =>  {
        return {
            registerRoomEvents: mockRegisterRoomEvents
        };
    });

    done();
    
  })

  it("Valida a inicialização do app",  (done) => {
    require('../app.js');
    connectionCallback({});
    expect(mockApp.get).toHaveBeenCalled();
    expect(mockHttp.listen).toHaveBeenCalled();
    expect(mockIo.on.mock.calls[0][0]).toEqual("connection");
    expect(mockRegisterChatEvents).toHaveBeenCalled();
    expect(mockRegisterRoomEvents).toHaveBeenCalled();


    done();
  });

    
});