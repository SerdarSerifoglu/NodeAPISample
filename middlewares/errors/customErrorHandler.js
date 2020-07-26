const CustomError = require('../../helpers/error/CustomError');

const customErrorHandler = (err,req,res,next) => {
    let customError = err;
    
    if(err.name === "SyntaxError"){
        customError = new CustomError("Unexpected Syntax", 400);
    }
    if(err.name === "ValidationError"){
        customError = new CustomError(err.message, 400);
    }
    if(err.name === "MongoError"){
        customError = new CustomError(err.message, 400);
    }

    res
    .status(customError.status || 500) //gelen hata yakalamadıysa 500 status döndür dedik
    .json({
        success: false,
        message: customError.message
    })
};

module.exports = customErrorHandler;