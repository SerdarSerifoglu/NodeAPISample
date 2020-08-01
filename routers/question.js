const express = require('express');
const {
    getAllQuestions, 
    getQuestionById, 
    askNewQuestion, 
    editQuestion,
    deleteQuestion
} = require('../controllers/question');
const {getAccessToRoute, getQuestionOwnerAccess} = require('../middlewares/authorization/auth');
const {checkQuestionExist} = require('../middlewares/database/databaseErrorHelpers');

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:id", checkQuestionExist, getQuestionById);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put("/edit/:id", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete(
    "/delete/:id",
    [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
    deleteQuestion
)

module.exports = router;