const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const register =async (req,res,next) => {

    //Sample User Data
    const name = "Serdar22";
    const email = "serdar22@gmail.com";
    const password = "123456";

    try{
    //async await 
    const user = await User.create({
        name: name,
        email: email,
        password: password
    });

    res
    .status(200)
    .json({
        success:true,
        data: user
    });
    }catch(err){
        return next(err);
    }
   
};

const errorTest = (req,res,next) => {
    //Some Code
    return next(new CustomError("Bu bir hata Denemesidir. Custom ERROR MESSAGE", 400));
    //Some Code
};

module.exports = {
    register,
    errorTest
};