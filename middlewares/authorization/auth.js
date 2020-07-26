const CustomerError = require('../../helpers/error/CustomError');
const jwt = require('jsonwebtoken');
const { isTokenIncluded } = require("../../helpers/authorization/tokenHelpers");

const getAccessToRoute = (req,res,next) => {
    if(!isTokenIncluded(req)){
        return next(
            new CustomerError("You are not authorized to access this route", 401)
        );
    };
};

module.exports = {
    getAccessToRoute
};