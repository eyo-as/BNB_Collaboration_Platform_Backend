// import the db connection pool file
const pool = require("../config/db.config");

// a function to create a question in the database
async function createQuestion(questionData) {
  try {
    const { user_id, class_id, title, description, tags } = questionData;

    // Query to insert a new question
    const query = `
    INSERT INTO questions (user_id, class_id, title, description, tags)
    VALUES (?, ?, ?, ?, ?)
  `;

    // Execute the query with sanitized inputs
    const [result] = await pool.execute(query, [
      user_id,
      class_id,
      title,
      description,
      tags || null, // If tags are not provided, store as NULL
    ]);

    // Return the created question's ID or metadata
    return { question_id: result.insertId };
  } catch (error) {
    console.error("Error creating question:", error.message);
    throw error;
  }
}

// a function to get all questions from the database
async function getAllQuestions() {
  try {
    const [questions] = await pool.execute(
      "SELECT * FROM questions ORDER BY created_at DESC"
    );
    return questions;
  } catch (error) {
    console.error("Error getting questions:", error.message);
    throw error;
  }
}

// a function to get a single question
async function getQuestionById(questionId) {
  try {
    const query = "SELECT * FROM questions WHERE question_id = ?";
    const [rows] = await pool.execute(query, [questionId]);
    return rows[0];
  } catch (error) {
    console.error("Error getting question:", error.message);
    throw error;
  }
}

// a function to update a question
async function updateQuestion(questionId, questionData, user_id) {
  try {
    const { class_id, title, description, tags } = questionData;

    const query = `
      UPDATE questions
      SET user_id = ?, class_id = ?, title = ?, description = ?, tags = ?
      WHERE question_id = ?
    `;
    const values = [
      user_id,
      class_id,
      title,
      description,
      tags || null, // If tags are not provided, store as NULL
      questionId,
    ];
    const [rows] = await pool.execute(query, values);
    return rows;
  } catch (error) {
    console.error("Error updating question:", error.message);
    throw error;
  }
}

// a function to delete a question
async function deleteQuestion(question_id) {
  try {
    const query = `DELETE FROM questions WHERE question_id = ?`;
    const [rows] = await pool.execute(query, [question_id]);
    return rows;
  } catch (error) {
    console.error("Error deleteing question:", error.message);
    throw error;
  }
}

// export the function
module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
