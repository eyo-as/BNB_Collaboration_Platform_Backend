// import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// import the question controller
const questionController = require("../controllers/question.controller");
// import verifyToken middleware
const { verifyToken } = require("../middlewares/authMiddleware");

// Define routes
router.post("/api/questions", verifyToken, questionController.createQuestion);
// router.get("/api/questions", questionController.getAllQuestions);
// router.get("/api/questions/:id", questionController.getQuestionById);
// router.put("/api/questions/:id", questionController.updateQuestion);
// router.delete("/api/questions/:id", questionController.deleteQuestion);

// export the router
module.exports = router;
