'use strict';


/**
 * catch 404 and forward to error handler
 */
exports.pageNotFound = function(req, res, next){
    var err = new Error('Not Found!');
    err.status = 404;
    next(err);
};

/**
 * 
 */
exports.internalServerError = function(req, res, next){
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
};