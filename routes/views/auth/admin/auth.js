'use strict';

/**
 * Auth dependencies
 */
var mongoose = require('mongoose');
var db = require('../models/db');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GithubStrategy = require('passport-github').Strategy;

/**
 * 
 */
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    // process the login fields
    function(username, password, done){
        db.User.findOne(
            {username: username}, 
            // '_id username',
            function(err, user){
                if (err) { return done(err); }

                if(!user) {
                    console.log('Not find user.')
                    return done(null, false, {message: 'Incorrect username.'});
                }
                // TO-DO: need to set compare password async.

                db.User.passwordCompare(password, user.password_hash, function(err, result){
                    if(err) { return done(err)};

                    if(!result) {
                        console.log('Incorrect password');
                        return done(null, false, {message: 'Incorrect password.'});
                    } else {
                        console.log('check!');
                        return done(null, user);
                    }
                });
            });
    }
));

/**
 * 
 */
passport.use(new GithubStrategy({
        clientID: "2948e108bbba7185fa43",
        clientSecret: "7ee1526518f04cdfaf96a36e2393493b306457d8",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, profile);
    }
));

/**
 * 
 */
passport.serializeUser(function(user, done){
    console.log('Serialze user to session ? ' + user);
    done(null, user);
});

/**
 * 
 */
passport.deserializeUser(function(user, done){
    console.log('Okay, you wanna get user infomation from session ? ' + user);
    done(null, user);
});

/**
 * This is a middleware to protect some routes.
 */
exports.ensureAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user is available for use here
        console.log('ensureAuthenticated： welcome.');
        next();
    } else {
        // denied. redirect to login
        console.log('ensureAuthenticated： You are not login.');
        res.redirect('/auth/login');
    }
    
}

/**
 * 
 */
exports.register = function(req, res, next){
    res.render('auth/register.html', { title: '注册'});
}

/**
 * 
 */
exports.doRegister = function(req, res, next){
    var username = req.body.username;
    var cellphone = req.body.cellphone;
    var password = req.body.password;

    if(username && cellphone && password){
        
    } else {
        console.log('somethong is empty');
        res.redirect('/auth/register');
    }

    db.User.passwordHash(password, function(err, hash){
            if(err) { console.log('Hash Error') }

            if(!hash){
                console.log('No Hash Results');
            } 
            
            var newUser = new db.User({
                username: username,
                cellphone: cellphone,
                password_hash: hash,
                lastLogin: Date.now()
            });

            newUser.save( function(err, user){
                if(err) { console.log('Save Error : ' + err) }

                console.log('Saved user name:' + user.username);
                console.log('_id of saved user: ' + user._id);
                console.log('Saved user password_hash: ' + user.password_hash);
            });
        });

    res.redirect('/');
}

/**
 * 
 */
exports.loginLocal = function(req, res, next){
    res.render('auth/login.html', {username: req.session.username,
         message: req.flash('info')});
};

/**
 * 
 */
exports.doLoginLocal = passport.authenticate('local',{ successRedirect: '/',
                    failureRedirect: '/auth/login',
                    failureFlash: true });

/**
 * 
 */
exports.loginGithub = passport.authenticate('github');

/**
 * 
 */
exports.doLoginGithub = passport.authenticate('github',  { failureRedirect: '/'}),
    function(req, res){
    res.redirect('/');
}

/**
 * 
 */
exports.logout = function(req, res, next){
    console.log('logging out');
    req.logout();
    res.redirect('/');
};
