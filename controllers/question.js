const Question = require('../models/Question');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");


const getAllQuestions =asyncErrorWrapper(async (req,res,next) => {
    let query = Question.find();
    const populate = true;
    const populateObject = {
        path: "user",
        select: "name profile_image"
    };
    //Seach
    if(req.query.search){
        const searchObject = {};

        const regex = new RegExp(req.query.search, "i");
        searchObject["title"] = regex;

        query = query.where(searchObject);
    }
    //Populate
    if(populate){
        query = query.populate(populateObject);
    }
    //Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = await Question.countDocuments();

    if(startIndex > 0){
        pagination.previous = {
            page: page - 1,
            limit: limit
        }
    }
    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }
    query = query.skip(startIndex).limit(limit);

    //Sort : req.query.sortBy
    const sortKey = req.query.sortBy;
    if(sortKey === "most-answered"){
        query = query.sort("-answerCount -createdAt"); // - verilmesi büyükten küçüğe sıralamayı sağlıyor
    }
    else if(sortKey === "most-liked"){
        query = query.sort("-likeCount -createdAt");//likeCountları aynı ise createdAt'e göre sıralamayı sağlar
    }
    else{
        query = query.sort("-createdAt");
    }

    const questions = await query;

    res.status(200)
    .json({
        success : true,
        message: "Get All Questions",
        count: questions.length,
        pagination: pagination,
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

const editQuestion = asyncErrorWrapper(async (req,res,next) => {
    const requestBody = req.body;
    const {id} = req.params;
    const question = await Question.findByIdAndUpdate(
        req.params.id,requestBody,{
            new: true,
            runValidators: true
        }
    );

    return res.status(200)
    .json({
        success: true,
        data: question
    });

});

const deleteQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;

    const question = await Question.findById(id);
    await question.deleteOne();

    res.status(200)
    .json({
        success: true,
        message: "Question Deleted",
        data: question
    });
});

const likeQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("You already liked this question", 400));
    }

    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;

    await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    });
});

const undoLikeQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("You can not undo like operation for this question", 400));
    }

    const index = question.likes.indexOf(req.user.id);

    question.likes.splice(index,1);
    question.likeCount = question.likes.length;

    await question.save();
    
    return res.status(200)
    .json({
        success: true,
        data: question
    });
});

module.exports = {
    getAllQuestions,
    getQuestionById,
    askNewQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};