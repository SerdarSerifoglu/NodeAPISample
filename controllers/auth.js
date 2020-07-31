const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const { validateUserInput, comparePassword} = require('../helpers/input/inputHelpers');
const { compareSync } = require('bcryptjs');
const sendEmail = require("../helpers/libraries/sendEmail");

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
//Süreç: 
//1. Emaili body'den aldık 
//2. Bu email'e sahip kullanıcı var mı diye kontrol ettik
//3. Böyle bir kullanıcı varsa reset token oluşturuldu.
//4. Bu token ile birlikte user kaydına resetPasswordToken ve resetPasswordExpire alanları eklendi
//5. Şifre resetleme için link ve template oluşturuldu.
//6. try catch ile mail yollama işlemini gerçekleştirdik. Try catch kullanma sebebimiz gödnerme işleminde herhangi bir hata olursa user içinde kaydettiğimiz resetPasswordToken ve resetPasswordExpire alanlarını boşaltıp yeniden kaydedilmesini sağlamak için
const forgotPassword = asyncErrorWrapper(async (req,res,next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({email: resetEmail});

    if(!user){
        return next(new CustomError("There is no user with that email", 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</p>
    `;

    try {
        await sendEmail({
            from : process.env.SMTP_USER,
            to: resetEmail,
            subject: "Rest Your Password",
            html: emailTemplate
        });
        return res.status(200).json({
            success: true,
            message: "Token Sent To Your Email"
        });
    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
    }
    
    await user.save();

    return next(new CustomError("Email Could Not Be Sent", 500));
});

const resetPassword = asyncErrorWrapper(async (req,res,next) => {
    const {resetPasswordToken} = req.query;

    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token", 400));
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt: Date.now()} //greater than mongo db özelliği expire date bugunden büyükse yani daha zamanı geçmemişse getir anlamına geliyor
    });

    if(!user){
        return next(new CustomError("Invalid token or Session Expired", 404));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    return res.status(200)
    .json({
        success: true,
        message: "Reset Password Process Successful"
    });
})

module.exports = {
    register,
    errorTest,
    tokenTest,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword
};