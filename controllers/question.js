const Question = require('../models/Question');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");


const getAllQuestions =asyncErrorWrapper(async (req,res,next) => {
    var questions = await Question.find();

    res.status(200)
    .json({
        success : true,
        message: "Get All Questions",
        data: questions
    });
});

const getQuestionById = asyncErrorWrapper(async (req,res,next) => {
    var {id} = req.params;
    var question = await Question.findById(id);

    res.status(200)
    .json({
        success: true,
        message: "Get Question By Id Successful",
        data: question

    })
})

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
    getQuestionById,
    askNewQuestion
};