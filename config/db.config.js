// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, 
  queueLimit: 0,
};

// Create the MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection once during server start
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database.");
    connection.release(); 
  } catch (err) {
    console.error("Error connecting to the MySQL database:", err.message);
  }
})();

module.exports = pool;
