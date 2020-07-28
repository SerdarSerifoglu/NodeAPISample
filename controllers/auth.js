const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const { validateUserInput, comparePassword} = require('../helpers/input/inputHelpers');
const { compareSync } = require('bcryptjs');

const register = asyncErrorWrapper(async (req,res,next) => {
    
    const {name,email,password,role} = req.body;
    const user = await User.create({
        name: name,
        email: email,
        password: password
    });
    sendJwtToClient(user, res);
});

const errorTest = (req,res,next) => {
    //Some Code
    return next(new CustomError("Bu bir hata Denemesidir. Custom ERROR MESSAGE", 400));
    //Some Code
};

const tokenTest = (req,res,next) => {
    res.json({
        success:true,
        message: "Welcome"
    });
};

const login = asyncErrorWrapper(async (req,res,next) => {
const {email, password} = req.body;
if(!validateUserInput(email, password)){
    return next(new CustomError("Please check your input",400));
}

const user = await User.findOne({ email }).select("+password"); // UserSchema'da password dönmesin diye ayarladığımız için burada passwordü eklemek gerekti

if(!comparePassword(password, user.password)){
    return next(new CustomError("Please check your credentials", 400));
}
sendJwtToClient(user, res);
});

const getUser = (req,res,next) => {
    res.json({
        success:true,
        message: "Welcome",
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
};

module.exports = {
    register,
    errorTest,
    tokenTest,
    getUser,
    login
};