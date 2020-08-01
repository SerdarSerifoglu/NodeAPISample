const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [10, "Please provide a title at least 10 characters"],
        unique: true
    },
    content : {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [20, "Please provide a title at least 20 characters"],
    },
    slug: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User" //User modelini referans olarak gösterdik daha sonra User bilgilerine erişebilmek için
    }
});

module.exports = mongoose.model("Question", QuestionSchema);