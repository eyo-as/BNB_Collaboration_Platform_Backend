// connection to the database
const pool = require("../config/db.config");

// a function to create an answer in the database
async function createAnswer(answerData, user_id, question_id) {
  try {
    const { answer_text } = answerData;

    // Query to insert a new answer
    const query = `
        INSERT INTO Answers (user_id, question_id, answer_text)
        VALUES (?, ?, ?)
        `;

    const values = [user_id, question_id, answer_text];

    // Execute the query with sanitized inputs
    const [result] = await pool.execute(query, values);

    // Return the created answer's ID or metadata
    return { answer_id: result.insertId };
  } catch (error) {
    console.error("Error creating answer:", error.message);
    throw error;
  }
}

// a function to get all answers from the database
async function getAllAnswers() {
  try {
    const [answers] = await pool.execute("SELECT * FROM Answers");
    return answers;
  } catch (error) {
    console.error("Error getting answers:", error.message);
    throw error;
  }
}

// a functoion to get a single answer from the database
async function getAnswerById(answerId) {
  try {
    const query = "SELECT * FROM Answers WHERE answer_id = ?";
    const [rows] = await pool.execute(query, [answerId]);
    return rows[0];
  } catch (error) {
    console.error("Error getting answer:", error.message);
    throw error;
  }
}

// a function to get answers by question id
async function getAnswersByQuestionId(questionId) {
  try {
    const query = "SELECT * FROM Answers WHERE question_id = ?";
    const [rows] = await pool.execute(query, [questionId]);
    return rows;
  } catch (error) {
    console.error("Error getting answers:", error.message);
    throw error;
  }
}

// a function to update an answer from the database
async function updateAnswer(answerId, answerData) {
  try {
    const { answer_text } = answerData;
    const query = "UPDATE Answers SET answer_text = ? WHERE answer_id = ?";
    const values = [answer_text, answerId];
    const [result] = await pool.execute(query, values);
    return result;
  } catch (error) {
    console.error("Error updating answer:", error.message);
    throw error;
  }
}

// a function to delete an answer from the database
async function deleteAnswer(answerId) {
  try {
    const query = "DELETE FROM Answers WHERE answer_id = ?";
    const [result] = await pool.execute(query, [answerId]);
    return result;
  } catch (error) {
    console.error("Error deleting answer:", error.message);
    throw error;
  }
}

// exports
module.exports = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
};
