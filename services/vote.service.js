const pool = require("../config/db.config");

// Create a new vote
async function createVote(voteData) {
  const { user_id, question_id, answer_id, vote_type } = voteData;

  if (!user_id || !vote_type || (!question_id && !answer_id)) {
    throw new Error(
      "Invalid input: user_id, vote_type, and either question_id or answer_id are required."
    );
  }

  const safeQuestionId = question_id ?? null;
  const safeAnswerId = answer_id ?? null;

  // Check if the question_id exists
  if (safeQuestionId) {
    const [questionCheck] = await pool.execute(
      "SELECT question_id FROM Questions WHERE question_id = ?",
      [safeQuestionId]
    );
    if (questionCheck.length === 0) {
      return { error: `Question ID ${safeQuestionId} not found.` };
    }
  }

  // Check if the answer_id exists
  if (safeAnswerId) {
    const [answerCheck] = await pool.execute(
      "SELECT answer_id FROM Answers WHERE answer_id = ?",
      [safeAnswerId]
    );
    if (answerCheck.length === 0) {
      return { error: `Answer ID ${safeAnswerId} not found.` };
    }
  }

  // Check if the user has already voted
  const [existingVote] = await pool.execute(
    "SELECT vote_type FROM Votes WHERE user_id = ? AND (question_id <=> ? OR answer_id <=> ?)",
    [user_id, safeQuestionId, safeAnswerId]
  );

  if (existingVote.length > 0) {
    const currentVoteType = existingVote[0].vote_type;

    if (currentVoteType === vote_type) {
      // If the same vote is clicked again, remove it
      await pool.execute(
        "DELETE FROM Votes WHERE user_id = ? AND (question_id <=> ? OR answer_id <=> ?)",
        [user_id, safeQuestionId, safeAnswerId]
      );

      // Correctly decrement the vote count only if it was previously increased
      const decrementQuery = safeQuestionId
        ? `UPDATE Questions SET ${
            vote_type === "upvote"
              ? "upvotes = GREATEST(upvotes - 1, 0)"
              : "downvotes = GREATEST(downvotes - 1, 0)"
          } WHERE question_id = ?`
        : `UPDATE Answers SET ${
            vote_type === "upvote"
              ? "upvotes = GREATEST(upvotes - 1, 0)"
              : "downvotes = GREATEST(downvotes - 1, 0)"
          } WHERE answer_id = ?`;

      await pool.execute(decrementQuery, [safeQuestionId || safeAnswerId]);

      return { message: "Vote removed successfully." };
    } else {
      // Change vote type from upvote to downvote or vice versa
      await pool.execute(
        "UPDATE Votes SET vote_type = ? WHERE user_id = ? AND (question_id <=> ? OR answer_id <=> ?)",
        [vote_type, user_id, safeQuestionId, safeAnswerId]
      );

      // Adjust vote counts correctly
      const decrementOldVote = safeQuestionId
        ? `UPDATE Questions SET ${
            currentVoteType === "upvote"
              ? "upvotes = GREATEST(upvotes - 1, 0)"
              : "downvotes = GREATEST(downvotes - 1, 0)"
          } WHERE question_id = ?`
        : `UPDATE Answers SET ${
            currentVoteType === "upvote"
              ? "upvotes = GREATEST(upvotes - 1, 0)"
              : "downvotes = GREATEST(downvotes - 1, 0)"
          } WHERE answer_id = ?`;

      await pool.execute(decrementOldVote, [safeQuestionId || safeAnswerId]);

      const incrementNewVote = safeQuestionId
        ? `UPDATE Questions SET ${
            vote_type === "upvote"
              ? "upvotes = upvotes + 1"
              : "downvotes = downvotes + 1"
          } WHERE question_id = ?`
        : `UPDATE Answers SET ${
            vote_type === "upvote"
              ? "upvotes = upvotes + 1"
              : "downvotes = downvotes + 1"
          } WHERE answer_id = ?`;

      await pool.execute(incrementNewVote, [safeQuestionId || safeAnswerId]);

      return { message: "Vote updated successfully." };
    }
  }

  // Insert new vote
  await pool.execute(
    "INSERT INTO Votes (user_id, question_id, answer_id, vote_type) VALUES (?, ?, ?, ?)",
    [user_id, safeQuestionId, safeAnswerId, vote_type]
  );

  // Increase vote count
  const incrementQuery = safeQuestionId
    ? `UPDATE Questions SET ${
        vote_type === "upvote"
          ? "upvotes = upvotes + 1"
          : "downvotes = downvotes + 1"
      } WHERE question_id = ?`
    : `UPDATE Answers SET ${
        vote_type === "upvote"
          ? "upvotes = upvotes + 1"
          : "downvotes = downvotes + 1"
      } WHERE answer_id = ?`;

  await pool.execute(incrementQuery, [safeQuestionId || safeAnswerId]);

  return { message: "Vote cast successfully." };
}

// Get a vote by user_id and question_id/answer_id
async function getVote(user_id, question_id, answer_id) {
  const query = `
    SELECT * FROM Votes
    WHERE user_id = ? AND (question_id = ? OR answer_id = ?)
  `;
  const [rows] = await pool.execute(query, [user_id, question_id, answer_id]);
  return rows[0];
}

// Get total votes for a question
async function getQuestionVotes(question_id) {
  const query =
    "SELECT upvotes, downvotes FROM Questions WHERE question_id = ?";
  const [rows] = await pool.execute(query, [question_id]);
  return rows[0];
}

// Get total votes for an answer
async function getAnswerVotes(answer_id) {
  const query = "SELECT upvotes, downvotes FROM Answers WHERE answer_id = ?";
  const [rows] = await pool.execute(query, [answer_id]);
  return rows[0];
}

// Delete a vote
async function deleteVote(vote_id) {
  // Get the vote details before deleting
  const query = "SELECT * FROM Votes WHERE vote_id = ?";
  const [rows] = await pool.execute(query, [vote_id]);
  const vote = rows[0];

  if (!vote) {
    throw new Error("Vote not found.");
  }

  // Delete the vote
  const deleteQuery = "DELETE FROM Votes WHERE vote_id = ?";
  await pool.execute(deleteQuery, [vote_id]);

  // Update the vote count in the Questions or Answers table
  if (vote.question_id) {
    const updateQuery = `
      UPDATE Questions
      SET ${
        vote.vote_type === "upvote"
          ? "upvotes = upvotes - 1"
          : "downvotes = downvotes - 1"
      }
      WHERE question_id = ?
    `;
    await pool.execute(updateQuery, [vote.question_id]);
  } else if (vote.answer_id) {
    const updateQuery = `
      UPDATE Answers
      SET ${
        vote.vote_type === "upvote"
          ? "upvotes = upvotes - 1"
          : "downvotes = downvotes - 1"
      }
      WHERE answer_id = ?
    `;
    await pool.execute(updateQuery, [vote.answer_id]);
  }

  return { message: "Vote deleted successfully" };
}

module.exports = {
  createVote,
  getVote,
  getQuestionVotes,
  getAnswerVotes,
  deleteVote,
};
