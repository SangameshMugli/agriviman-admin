const mysql = require('mysql');
const dotenv = require('dotenv').config();

// Create the MySQL connection pool
const connection = mysql.createPool({
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Export the connection pool
module.exports = connection;
