const voteService = require("../services/vote.service");

// Create a new vote
async function createVote(req, res) {
  try {
    const { user_id, question_id, answer_id, vote_type } = req.body;

    // Validate input
    if (!user_id || !vote_type || (!question_id && !answer_id)) {
      return res.status(400).json({
        error:
          "Invalid input: user_id, vote_type, and either question_id or answer_id are required.",
      });
    }

    // Ensure only one of question_id or answer_id is provided
    if (question_id && answer_id) {
      return res
        .status(400)
        .json({ error: "Provide either question_id or answer_id, not both." });
    }

    // Create the vote
    const vote = await voteService.createVote({
      user_id,
      question_id,
      answer_id,
      vote_type,
    });
    return res.status(201).json({
      message: "Vote created successfully",
      success: true,
      data: vote,
    });
  } catch (error) {
    console.error("Error in createVote:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}

// Get votes for a question
async function getQuestionVotes(req, res) {
  try {
    const question_id = req.params.question_id;
    if (!question_id) {
      return res.status(400).json({ error: "question_id is required." });
    }

    const votes = await voteService.getQuestionVotes(question_id);
    return res.status(200).json({
      message: "Votes retrieved successfully",
      success: true,
      data: votes,
    });
  } catch (error) {
    console.error("Error in getQuestionVotes:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get votes for an answer
async function getAnswerVotes(req, res) {
  try {
    const answer_id = req.params.answer_id;
    if (!answer_id) {
      return res.status(400).json({ error: "answer_id is required." });
    }

    const votes = await voteService.getAnswerVotes(answer_id);
    return res.status(200).json({
      message: "Votes retrieved successfully",
      success: true,
      data: votes,
    });
  } catch (error) {
    console.error("Error in getAnswerVotes:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a vote
async function deleteVote(req, res) {
  try {
    const vote_id = req.params.vote_id;
    if (!vote_id) {
      return res.status(400).json({ error: "vote_id is required." });
    }

    const result = await voteService.deleteVote(vote_id);
    return res.status(200).json({
      message: "Vote deleted successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in deleteVote:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createVote,
  getQuestionVotes,
  getAnswerVotes,
  deleteVote,
};
