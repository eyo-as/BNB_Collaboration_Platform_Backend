const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answer.controller");

// import verifyToken middleware
const { verifyToken } = require("../middlewares/authMiddleware");

// Define routes
router.post(
  "/api/questions/:question_id/answers",
  verifyToken,
  answerController.createAnswer
);
router.get("/api/answers", verifyToken, answerController.getAllAnswers);
router.get(
  "/api/answers/:answer_id",
  verifyToken,
  answerController.getAnswerById
);
// get answer for single questions by question id
router.get(
  "/api/questions/:question_id/answers",
  verifyToken,
  answerController.getAnswersByQuestionId
);
router.put(
  "/api/answers/:answer_id",
  verifyToken,
  answerController.updateAnswer
);
router.delete(
  "/api/answers/:answer_id",
  verifyToken,
  answerController.deleteAnswer
);

module.exports = router;
