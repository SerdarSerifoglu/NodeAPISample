const express = require('express');
const { merge } = require('./admin');
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers");
const {getAnswerOwnerAccess} = require("../middlewares/authorization/auth");

const {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer
    } = require("../controllers/answer");

//mergeParams: önceki router'daki parametrelerinde bu router'a geçirilmesini sağlar.
const router = express.Router({mergeParams: true});

router.get("/", getAllAnswersByQuestion);
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer);
router.post("/",getAccessToRoute,addNewAnswerToQuestion);
router.put("/:answer_id/edit", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer);
router.delete("/:answer_id/delete", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer);
module.exports = router;