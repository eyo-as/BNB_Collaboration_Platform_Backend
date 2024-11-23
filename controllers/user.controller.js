// import the user service
const userService = require("../services/user.service");
// a function to create a new user in the database
async function createUser(req, res) {
  try {
    // validate the inputs
    const { username, first_name, last_name, role, class_id, email, password } =
      req.body;

    if (
      !username ||
      !first_name ||
      !last_name ||
      !role ||
      !class_id ||
      !email ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // check if the user already exists in the database by it's email
    const userExists = await userService.checkIfUserExists(req.body.email);
    if (userExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    // check if the user already exists in the database by it's user name
    const userNameExists = await userService.checkIfUserNameExists(
      req.body.username
    );
    if (userNameExists) {
      return res
        .status(400)
        .json({ error: "User with this username already exists" });
    }

    // check if the password is less than 8 characters
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // create the user
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

module.exports = { createUser };
