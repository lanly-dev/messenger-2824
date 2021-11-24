const Sequelize = require('sequelize')
const db = require('../db')

const Member = db.define('member', {
  conversationId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Member
