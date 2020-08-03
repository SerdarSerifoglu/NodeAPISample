const Question = require('../models/Question');
const Answer = require("../models/Answer");
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {question_id} = req.params;

    const user_id = req.user.id;

    const information = req.body;

    const answer = await Answer.create({
        ...information,
        question: question_id,
        user: user_id
    });

    return res.status(200)
    .json({
        success: true,
        data: answer
    });
});

const getAllAnswersByQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {question_id} = req.params;

    //.populate demememiz dönen sonuçta answers datalarınında bulunmasını sağlıyor
    const question = await Question.findById(question_id).populate("answers");

    const answers = question.answers;



    return res.status(200)
    .json({
        success: true,
        count: answers.length,
        data: answers
    });
});

const getSingleAnswer = asyncErrorWrapper(async (req,res,next) => {
    const {answer_id}=req.params;

    const answer = await Answer.findById(answer_id)
    //path: detayı alınacak id alanını yazıyoruz
    //select: alınan modeldeki hangi alanları almak istediğimizi belirtiyoruz birden fazla alanı belirtmek için aralarına boşluk koyuyoruz
    .populate({
        path: "user",
        select: "name profile_image"
    })
    .populate({
        path: "question",
        select: "title"
    });

    return res.status(200)
    .json({
        success: true,
        data: answer
    });
});

module.exports = {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer
};