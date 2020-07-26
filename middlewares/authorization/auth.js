const CustomerError = require('../../helpers/error/CustomError');
const jwt = require('jsonwebtoken');

const getAccessToRoute = (req,res,next) => {
    //Token

    console.log(req.headers.authorization);
    next();
    //CustomError
};

module.exports = {
    getAccessToRoute
};