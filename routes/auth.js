'use strict';

/**
 * Auth dependencies
 */
var mongoose = require('mongoose');
var db = require('../models/db');
var User = mongoose.model('User');

exports.register = function(req, res, next){
    res.render('auth/register.html', { title: '注册'});
}

exports.doRegister = function(req, res, next){
    res.redirect('/');
}

exports.login = function(req, res, next){
    res.render('auth/login.html', {username: req.session.username, message: req.flash('info')});
};

exports.doLogin = function(req, res, next){
    if(req.body.username){
            User.findOne(
                {'username':req.body.username},
                // '_id username',
                function(err, user){
                    if(!err){
                        if(!user){
                            console.log('User not found');
                        } else {
                            req.session.username = req.body.username;
                            req.session.loggedin = 1;
                            console.log('Logged in user' + user);
                        }
                    } else {
                        console.log('Error(should redirect to error page )');
                    }
                });
        } else {
        console.log('wft');
        req.flash('info', 'User input empty');
        }

        res.redirect('/auth/login');
};

exports.logout = function(req, res, next){

};

