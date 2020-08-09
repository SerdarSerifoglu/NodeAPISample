const express = require('express');
const Question = require("../models/Question");
const {
    getAllQuestions, 
    getQuestionById, 
    askNewQuestion, 
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
} = require('../controllers/question');
const {getAccessToRoute, getQuestionOwnerAccess} = require('../middlewares/authorization/auth');
const {checkQuestionExist} = require('../middlewares/database/databaseErrorHelpers');
const answer = require("./answer");
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");

const router = express.Router();

router.get("/",questionQueryMiddleware(
    Question, {
        population: {
            path: "user",
            select: "name profile_image"
        }
    }
), getAllQuestions);
router.get("/:id", checkQuestionExist, getQuestionById);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put("/edit/:id", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete(
    "/delete/:id",
    [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
    deleteQuestion
);
router.get("/like/:id", [getAccessToRoute,checkQuestionExist], likeQuestion);
router.get("/undolike/:id", [getAccessToRoute,checkQuestionExist], undoLikeQuestion);


router.use("/:question_id/answers", checkQuestionExist, answer);

module.exports = router;