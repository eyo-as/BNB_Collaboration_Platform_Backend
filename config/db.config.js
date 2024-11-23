const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

pool
  .getConnection()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

// Export the pool
module.exports = pool;
