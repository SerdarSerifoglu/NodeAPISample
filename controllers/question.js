const Question = require('../models/Question');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");


const getAllQuestions = (req,res,next) => {
    res
    .status(200)
    .json({
        success : true
    });
};

const askNewQuestion = asyncErrorWrapper(async (req,res,next) => {
    //Bu şekilde tek tek tanımlama yerine Question.create içinde spread(...) operatörüyle bütün req.body'i verebiliriz
    var {title,content,slug} = req.body;
    const question = await Question.create({
        title: title,
        content: content,
        slug: slug,
        user: req.user.id
    });
    await question.save();

    res.status(200)
    .json({
        success: true,
        message: "Question added",
        data: question
    });
});

module.exports = {
    getAllQuestions,
    askNewQuestion
};