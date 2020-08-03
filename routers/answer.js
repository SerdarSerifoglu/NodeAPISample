const express = require('express');
const { merge } = require('./admin');
const {getAccessToRoute} = require("../middlewares/authorization/auth");

const {addNewAnswerToQuestion, getAllAnswersByQuestion} = require("../controllers/answer");

//mergeParams: önceki router'daki parametrelerinde bu router'a geçirilmesini sağlar.
const router = express.Router({mergeParams: true});

router.get("/", getAllAnswersByQuestion);

router.post("/",getAccessToRoute,addNewAnswerToQuestion);
module.exports = router;