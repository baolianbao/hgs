'use strict';

/**
 * List all rooms
 */
exports.all = function(req, res, next){
    res.render('blog/blogs.html')
};

/**
 * Create new room form
 */
exports.create = function(req, res, next){

};

/**
 * Create new room action
 */
exports.doCreate = function(req, res, next){

};

/**
 * Display a specific room infomation
 */
exports.displayInfo = function(req, res, next){
    res.render('blog/blog.html');
};

/**
 * Edit a specific room form
 */
exports.edit = function(req, res, next){

};

/**
 * Edit a specific room action
 */
 exports.doEdit = function(req, res, next){

 };

/**
 * Delete a specific room confirmation
 */
 exports.confirmDelete = function(req, res, next){

 };

/**
 * Delete a specific room action
 */
 exports.doDelete = function(req, res, next){

 };