// import the db connection pool file
const pool = require("../config/db.config");

// a function to create a question in the database
// -- Create Questions Table
// CREATE TABLE Questions (
//     question_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     class_id INT NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     tags VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
//     FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
// ) ENGINE=InnoDB;

async function createQuestion(questionData) {
  try {
    const { user_id, class_id, title, description, tags } = questionData;

    // Query to insert a new question
    const query = `
    INSERT INTO Questions (user_id, class_id, title, description, tags)
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
    throw error; // Pass the error to the controller
  }
}

// export the function
module.exports = { createQuestion };
