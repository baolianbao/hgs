'use strict';

/**
 * List all apartments
 */
exports.all = function(req, res, next){
    res.render('apartment/apartments.html')
};

/**
 * Create new apartment form
 */
exports.create = function(req, res, next){
    res.render('apartment/apartment_add.html');
};

/**
 * Create new apartment action
 */
exports.doCreate = function(req, res, next){
    res.redirect('/');
};

/**
 * Display a specific apartment infomation
 */
exports.displayInfo = function(req, res, next){
    res.render('apartment/apartment.html');
};

/**
 * Edit a specific apartment form
 */
exports.edit = function(req, res, next){
    res.render('apartment/apartment_edit.html');
};

/**
 * Edit a specific apartment action
 */
 exports.doEdit = function(req, res, next){
    
 };

/**
 * Delete a specific apartment confirmation
 */
 exports.confirmDelete = function(req, res, next){
     res.render('apartment/apartment_delete.html');
 };

/**
 * Delete a specific apartment action
 */
 exports.doDelete = function(req, res, next){

 };