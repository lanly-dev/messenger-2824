const Conversation = require('./conversation')
const User = require('./user')
const Message = require('./message')
const Member = require('./member')
const Seen = require('./seen')

// associations

User.hasMany(Conversation)
Conversation.belongsTo(User)
Conversation.hasMany(Member)
Conversation.hasMany(Seen)
Conversation.hasMany(Message)
Member.belongsTo(Conversation)
Seen.belongsTo(Conversation)
Message.belongsTo(Conversation)

module.exports = {
  User,
  Conversation,
  Message,
  Member,
  Seen
}
