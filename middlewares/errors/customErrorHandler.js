const customErrorHandler = (err,req,res,next) => {
    let customError = err;
    console.log(customError.message, customError.status);
    
    res
    .status(400)
    .json({
        success: false
    })
};

module.exports = customErrorHandler;