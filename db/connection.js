const mysql = require("mysql2");
const dotenv = require('dotenv').config({ path: '../.env' });

const connection = mysql.createConnection(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
);

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
