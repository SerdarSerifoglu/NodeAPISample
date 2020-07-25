const User = require('../models/User');
const register =async (req,res,next) => {

    //Sample User Data
    const name = "Serdar";
    const email = "serdar@gmail.com";
    const password = "123456";

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
};

module.exports = {
    register
};