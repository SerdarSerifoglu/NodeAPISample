const asyncErrorWrapper = require("express-async-handler");
const {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
} = require("../../helpers/query/queryHelper");

const questionQueryMiddleware = function(model, options){
    return asyncErrorWrapper(async function(req,res,next){
        //Initial Query
        let query = model.find(); 
        let allDataCount = await model.countDocuments();

        //Search
        query = searchHelper("title", query, req);
        //Population
        if(options && options.population){
            query = populateHelper(query, options.population);
        }
        //Sort
        query = questionSortHelper(query,req);

        //Pagination
        const paginationResult = await paginationHelper(model,query,req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

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

module.exports = questionQueryMiddleware;