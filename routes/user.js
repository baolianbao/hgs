'use strict';

/**
 * List all users
 */
exports.all = function(req, res, next){
    res.render('user/users.html', {title: '用户列表' } );
};

/**
 * Create new user form
 */
exports.create = function(req, res, next){
    res.render('user/user_add.html', {title: '注册'} );
};

/**
 * Create new user action
 */
exports.doCreate = function(req, res, next){
    // TO-DO redirect a register user to somewhre..
    res.redirect('/');
};

/**
 * Display a specific user infomation
 */
exports.displayInfo = function(req, res, next){
    var userId = req.params.id;
    res.render('user/user.html')
};

/**
 * Edit a specific user form
 */
exports.edit = function(req, res, next){
    res.render('user/user_edit.html')
};

/**
 * Edit a specific user action
 */
 exports.doEdit = function(req, res, next){
     res.redirect('/user');
 };

/**
 * Delete a specific user confirmation
 */
 exports.confirmDelete = function(req, res, next){
     res.render('user/user_delete.html');
 };

/**
 * Delete a specific user action
 */
 exports.doDelete = function(req, res, next){

 };