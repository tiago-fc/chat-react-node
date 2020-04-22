var {USER, ROOM, MESSAGE} = require('../common/constants.js');
var User = require('./user.js');
var Room = require('./room.js');
var Message = require('./message.js');


var models = {};
models[USER] = User;
models[ROOM] = Room;
models[MESSAGE] = Message;

module.exports = { models }