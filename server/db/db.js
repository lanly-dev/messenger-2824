require('dotenv').config()
const Sequelize = require('sequelize')

const url = process.env.DATABASE_URL || 'postgres://localhost:5432/messenger'
const db = new Sequelize(url, { logging: false })

module.exports = db
