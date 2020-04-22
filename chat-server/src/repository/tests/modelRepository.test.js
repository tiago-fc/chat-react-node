var {ROOM, MESSAGE, USER} = require('../../common/constants.js');
var ModelRepository = require('..');
var { localStorage } = require('../localStorage')

describe("Testes do modelRepository", () => {

  beforeEach((done) => {
      localStorage.setItem = jest.fn();
      done();
  });

  it("Valida o serviço create",  (done) => {
    localStorage.getItem = jest.fn(() => {
        return '[]';
    });
    const obj = ModelRepository(ROOM).create({name:'Sala1'});
    expect(localStorage.setItem.mock.calls[0][0]).toEqual(ROOM);
    expect(obj).toEqual({id:1, name:'Sala1'});
    done();
  });

  it("Valida o serviço update",  (done) => {
    localStorage.getItem = jest.fn(() => {
        return JSON.stringify([{id:1, name:"Sala1"}]);
    });
    const obj = ModelRepository(ROOM).update({id:1, name:"Sala2"});
    expect(localStorage.setItem.mock.calls[0][0]).toEqual(ROOM);
    expect(obj).toEqual({id:1, name:'Sala2'});
    done();
  });

  it("Valida o serviço get",  (done) => {
    localStorage.getItem = jest.fn(() => {
        return JSON.stringify([{id:1, name:"Sala1"}]);
    });
    let obj = ModelRepository(ROOM).get(1);
    expect(localStorage.getItem.mock.calls[0][0]).toEqual(ROOM);
    expect(obj).toEqual({id:1, name:'Sala1'});

    obj = ModelRepository(ROOM).get(2);
    expect(obj).toBeUndefined();
    done();
  });
  
  it("Valida o serviço getAll",  (done) => {
    localStorage.getItem = jest.fn(() => {
        return JSON.stringify([{id:1, name:"Sala1"}, {id:2, name:"Sala2"}]);
    });
    let obj = ModelRepository(ROOM).getAll();
    expect(localStorage.getItem.mock.calls[0][0]).toEqual(ROOM);
    expect(obj.length).toEqual(2);

    localStorage.getItem = jest.fn(() => {
      return null;
    });
    obj = ModelRepository(ROOM).getAll();
    expect(obj.length).toEqual(0);
    done();
  });

  it("Valida o serviço remove",  (done) => {
    localStorage.getItem = jest.fn(() => {
        return JSON.stringify([{id:1, name:"Sala1"}, {id:2, name:"Sala2"}]);
    });
    ModelRepository(ROOM).remove(1);
    expect(localStorage.setItem.mock.calls[0][0]).toEqual(ROOM);
    expect(localStorage.setItem.mock.calls[0][1]).toEqual(JSON.stringify([{id:2, name:"Sala2"}]));
    done();
  });

  it("Valida o serviço remove",  (done) => {
    ModelRepository(ROOM).clear();
    expect(localStorage.setItem.mock.calls[0][0]).toEqual(ROOM);
    expect(localStorage.setItem.mock.calls[0][1]).toEqual(JSON.stringify([]));
    done();
  });
    
});