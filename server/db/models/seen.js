const Sequelize = require('sequelize')
const db = require('../db')

const Seen = db.define('Seen', {
  conversationId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  isReadTime: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Seen
