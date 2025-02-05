const express = require("express");
const router = express.Router();

const voteController = require("../controllers/vote.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/api/votes", verifyToken, voteController.createVote);
router.get(
  "/api/questions/:question_id/votes",
  verifyToken,
  voteController.getQuestionVotes
);
router.get(
  "/api/answers/:answer_id/votes",
  verifyToken,
  voteController.getAnswerVotes
);
router.delete("/api/votes/:vote_id", verifyToken, voteController.deleteVote);

module.exports = router;
