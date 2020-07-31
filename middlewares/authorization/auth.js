const CustomerError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers");

const getAccessToRoute = (req,res,next) => {
    const {JWT_SECRET_KEY} = process.env;
    if(!isTokenIncluded(req)){
        return next(
            new CustomerError("You are not authorized to access this route", 401)
        );
    };
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken,JWT_SECRET_KEY, (err,decoded) => {
        if(err){
            return next(new CustomerError("You are not authorized to access this route", 401));
        }
        req.user = {
            id : decoded.id,
            name: decoded.name
        };
        console.log(decoded);
        next();
    });

};

const getAccessAdmin = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.user;

    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomerError("Only admins can access this route", 403));
    }
    next();
});


module.exports = {
    getAccessToRoute,
    getAccessAdmin
};