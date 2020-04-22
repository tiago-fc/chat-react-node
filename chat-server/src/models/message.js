function Message({id, roomId, authorId, message, recipientId}) {
    this.id = id;
    this.roomId = roomId;
    this.authorId = authorId;
    this.message = message;
    this.recipientId = recipientId;
    this.time = Date.now();
}

module.exports = Message;