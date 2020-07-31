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

const logout = asyncErrorWrapper(async (req,res,next) => {
    const { NODE_ENV } = process.env;

    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message: "Logout Successfull"
    });
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

const imageUpload = asyncErrorWrapper(async (req,res,next) => {
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image": req.savedProfileImage
    }, {
       new: true,  // bu denilmezse updateten önceki kullanıcı döner, bu denildiği için güncellenmiş kullanıcı bilgisi döner
       runValidators: true
    })

    res.status(200)
    .json({
        success: true,
        message: "Image Upload Successfull",
        data: user
    });
});

//Forgot Password
const forgotPassword = asyncErrorWrapper(async (req,res,next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({email: resetEmail});

    if(!user){
        return next(new CustomError("There is no user with that email", 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();
    
    res.json({
        success: true,
        message: "Token Sent To Your Email"
    });
});

module.exports = {
    register,
    errorTest,
    tokenTest,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword
};