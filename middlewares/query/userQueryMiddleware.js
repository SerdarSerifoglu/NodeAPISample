const asyncErrorWrapper = require("express-async-handler");
const {
    searchHelper,
    paginationHelper
} = require("../../helpers/query/queryHelper");

const userQueryMiddleware = function(model, options){
    return asyncErrorWrapper(async function(req,res,next){
        let query = model.find();
        allDataCount = await model.countDocuments();

        //Search By Name
        query = searchHelper("name",query,req);

        const paginationResult = await paginationHelper(model,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResult = await query;
        res.queryResult = {
            success: true,
            totalCount: allDataCount,
            count: queryResult.length,
            pagination: pagination,
            data: queryResult
        };

        next();
    });
};

module.exports = userQueryMiddleware;