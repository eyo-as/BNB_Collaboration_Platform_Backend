// import the db connection pool file
const pool = require("../config/db.config");
// import bcrypt to hash passwords
const bcrypt = require("bcrypt");

// a function to check if a user exists in the database
async function checkIfUserExists(field, value, excludeUserId = null) {
  // Always initialize params with the value we're checking
  const params = [value];

  // Start with basic query
  let query = `SELECT * FROM users WHERE ${field} = ?`;

  // Conditionally add exclusion if needed
  if (excludeUserId) {
    query += " AND user_id != ?";
    params.push(excludeUserId);
  }

  const [rows] = await pool.execute(query, params);
  return rows.length > 0;
}

// a function to create a user in the database
async function createUser(userData) {
  const { username, first_name, last_name, role, class_id, email, password } =
    userData;

  // Validate fields at the service level as well
  if (!username || !first_name || !last_name || !role || !email || !password) {
    throw new Error("All fields except class_id are required.");
  }

  // Determine class_id based on role
  const resolvedClassId = role === "student" ? class_id : null;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // SQL query
  const query =
    "INSERT INTO users (username, first_name, last_name, role, class_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)";

  // Values for the query
  const values = [
    username,
    first_name,
    last_name,
    role,
    resolvedClassId, // Ensure correct class_id
    email,
    hashedPassword,
  ];

  // Execute the query
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
async function updateUser(user_id, userData) {
  const { username, first_name, last_name, email, class_id } = userData;

  const query =
    "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, class_id = ? WHERE user_id = ?";

  const values = [username, first_name, last_name, email, class_id, user_id];

  const [rows] = await pool.execute(query, values);
  return rows;
}

// a function to delete a user from the database
async function deleteUser(user_id) {
  const query = "DELETE FROM users WHERE user_id = ?";
  const [rows] = await pool.execute(query, [user_id]);
  return rows;
}

// a function to retrive user question from question table
async function totalUserQuestion(user_id) {
  const query = "SELECT * FROM questions WHERE user_id = ?";
  const [rows] = await pool.execute(query, [user_id]);
  return rows;
}

// a function to retrive user answer from question table
async function totalUserAnswer(user_id) {
  const query = "SELECT * FROM answers WHERE user_id = ?";
  const [rows] = await pool.execute(query, [user_id]);
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
  deleteUser,
  totalUserQuestion,
  totalUserAnswer,
};
