// import the question service
const questionService = require("../services/question.service");

// a function to create a question in the database
async function createQuestion(req, res) {
  try {
    const { class_id, title, description, tags } = req.body;
    // validate the inputs
    if (!class_id || !title || !description || !tags) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const question = await questionService.createQuestion(req.body);
    return res.status(201).json({
      message: "Question created successfully",
      success: true,
      data: question,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// // a function to get all questions from the database
// async function getAllQuestions(req, res) {
//   try {
//     const questions = await questionService.getAllQuestions();
//     return res.status(200).json(questions);
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// // a function to get a single question from the database
// async function getQuestionById(req, res) {
//   try {
//     const question = await questionService.getQuestionById(req.params.id);
//     return res.status(200).json(question);
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// // a function to update a question in the database
// async function updateQuestion(req, res) {
//   try {
//     const question = await questionService.updateQuestion(
//       req.params.id,
//       req.body
//     );
//     return res.status(200).json({
//       message: "Question updated successfully",
//       success: true,
//       data: question,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// // a function to delete a question from the database
// async function deleteQuestion(req, res) {
//   try {
//     const question = await questionService.deleteQuestion(req.params.id);
//     return res.status(200).json({
//       message: "Question deleted successfully",
//       success: true,
//       data: question,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// export the functions
module.exports = {
  createQuestion,
  //   getAllQuestions,
  //   getQuestionById,
  //   updateQuestion,
  //   deleteQuestion,
};
