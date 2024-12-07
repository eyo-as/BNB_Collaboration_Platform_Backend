// import the user service
const userService = require("../services/user.service");
// import the jsonwebtoken module
const jwt = require("jsonwebtoken");

// a function to create a new user in the database
async function createUser(req, res) {
  try {
    const { username, first_name, last_name, role, class_id, email, password } =
      req.body;

    // Validate required fields
    if (
      !username ||
      !first_name ||
      !last_name ||
      !role ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    // Ensure `class_id` is provided only for students
    if (role === "student" && !class_id) {
      return res
        .status(400)
        .json({ error: "Class ID is required for students." });
    } else if ((role === "admin" || role === "teacher") && class_id) {
      return res.status(400).json({
        error: "Class ID should not be provided for admin or teacher.",
      });
    }

    // Check if the user already exists in the database
    const userExists = await userService.checkIfUserExists("email", email);
    if (userExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    const usernameExists = await userService.checkIfUserExists(
      "username",
      username
    );
    if (usernameExists) {
      return res
        .status(400)
        .json({ error: "User with this username already exists." });
    }

    // Check password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters." });
    }

    // Create the user
    await userService.createUser(req.body);
    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// a function to login a user in the database
async function login(req, res) {
  try {
    // validate the inputs
    const { email, password } = req.body;
    // validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if the user exists in the database
    const user = await userService.login(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // create a token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        class_id: user.class_id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    // Respond with the generated token and user info
    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// a function to get all users from the database
async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// a function to get a single user from the database
async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// a function to update a user in the database
async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// export the functions
module.exports = {
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
};
