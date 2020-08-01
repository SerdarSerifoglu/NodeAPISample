const express = require('express');
const {getAllQuestions, askNewQuestion} = require('../controllers/question');
const {getAccessToRoute} = require('../middlewares/authorization/auth');

const router = express.Router();

router.post("/ask",getAccessToRoute, askNewQuestion);

module.exports = router;