// Import the express module
const express = require("express");
// Create a router instance
const router = express.Router();
// Import user controller
const userController = require("../controllers/user.controller");
// Import middleware
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// Define routes for user management
router.post("/api/register", userController.createUser);
router.post("/api/login", userController.login);
router.get(
  "/api/users",
  verifyToken,
  authorizeRole("admin", "student"),
  userController.getAllUsers
);
router.get("/api/user/:id", verifyToken, userController.getUserById);
router.put(
  "/api/user/:id",
  verifyToken,
  authorizeRole("student"),
  userController.updateUser
);
router.delete(
  "/api/user/:id",
  verifyToken,
  authorizeRole("admin", "student"),
  userController.deleteUser
);

// Export the router
module.exports = router;
