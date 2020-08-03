const express = require('express');
const { merge } = require('./admin');
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers");

const {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer
    } = require("../controllers/answer");

//mergeParams: önceki router'daki parametrelerinde bu router'a geçirilmesini sağlar.
const router = express.Router({mergeParams: true});

router.get("/", getAllAnswersByQuestion);
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer);
router.post("/",getAccessToRoute,addNewAnswerToQuestion);
module.exports = router;