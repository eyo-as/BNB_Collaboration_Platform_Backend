// import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// import the question controller
const questionController = require("../controllers/question.controller");
// import verifyToken middleware
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// Define routes
router.post("/api/question", verifyToken, questionController.createQuestion);
router.get(
  "/api/questions",
  verifyToken,
  authorizeRole("admin"),
  questionController.getAllQuestions
);
router.get(
  "/api/questions/:id",
  verifyToken,
  authorizeRole("admin"),
  questionController.getQuestionById
);
router.put(
  "/api/questions/:id",
  verifyToken,
  authorizeRole("admin"),
  questionController.updateQuestion
);
// router.delete("/api/questions/:id", questionController.deleteQuestion);

// export the router
module.exports = router;
