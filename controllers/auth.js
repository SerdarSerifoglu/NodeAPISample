const User = require('../models/User');
const register =async (req,res,next) => {

    //Sample User Data
    const name = "Serdar";
    const email = "serdar@gmail.com";
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
    throw new Error("Bu bir hata Denemesidir");
    //Some Code
};

module.exports = {
    register,
    errorTest
};