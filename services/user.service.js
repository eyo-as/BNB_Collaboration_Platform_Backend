// import the db connection pool file
const pool = require("../config/db.config");
// import bcrypt to hash passwords
const bcrypt = require("bcrypt");

// a function to check if a user exists in the database
async function checkIfUserExists(field, value) {
  const query = `SELECT * FROM users WHERE ${field} = ?`;
  const [rows] = await pool.execute(query, [value]);
  return rows.length > 0;
}

// a function to create a user in the database
async function createUser(userData) {
  const { username, first_name, last_name, role, class_id, email, password } =
    userData;

  // hash the password
  const hasedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (username, first_name, last_name, role, class_id, email, password) VALUES (?,?,?,?,?,?,?)";

  const values = [
    username,
    first_name,
    last_name,
    role,
    class_id,
    email,
    hasedPassword,
  ];

  const [rows] = await pool.execute(query, values);
  return rows;
}

// a function to login a user
async function login(email, password) {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.execute(query, [email]);
  if (rows.length === 0) {
    return false;
  }

  const user = rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return false;
  }

  return user;
}

// a function to get all users
async function getAllUsers() {
  const query = "SELECT * FROM users";
  const [rows] = await pool.execute(query);
  return rows;
}

// a function to get single user
async function getUserById(id) {
  const query = "SELECT * FROM users WHERE user_id = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
}

// a function to update a user from the database
async function updateUser(id, userData) {
  const { username, first_name, last_name, role, class_id, password } =
    userData;

  // hash the password
  const hasedPassword = await bcrypt.hash(password, 10);

  const query =
    "UPDATE users SET username = ?, first_name = ?, last_name = ?, role = ?, class_id = ?, password = ? WHERE user_id = ?";

  const values = [
    username,
    first_name,
    last_name,
    role,
    class_id,
    hasedPassword,
    id,
  ];

  const [rows] = await pool.execute(query, values);
  return rows;
}

// export the functions
module.exports = {
  checkIfUserExists,
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
};
