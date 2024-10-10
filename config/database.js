require('dotenv').config();

const {
  Sequelize
} = require('sequelize');

const connection = process.env.DB_CONNECTION || 'mysql';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '3306';
const database = process.env.DB_DATABASE || 'mysql';
const username = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || '';

module.exports = new Sequelize(database, username, password, {
  host: host,
  dialect: connection,
  port: port,
});