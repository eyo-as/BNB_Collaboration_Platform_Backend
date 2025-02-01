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
  authorizeRole("admin", "student", "teacher"),
  questionController.getAllQuestions
);
router.get(
  "/api/questions/:question_id",
  verifyToken,
  authorizeRole("admin", "student", "teacher"),
  questionController.getQuestionById
);
router.put(
  "/api/questions/:question_id",
  verifyToken,
  authorizeRole("student"),
  questionController.updateQuestion
);
router.delete(
  "/api/questions/:question_id",
  verifyToken,
  authorizeRole("admin", "student", "teacher"),
  questionController.deleteQuestion
);

// export the router
module.exports = router;
