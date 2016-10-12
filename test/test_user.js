'use strict';

var db = require('../models/db');



var username = 'hexcola';
var password = '1234567';
/**
 * User test.
 */
db.User.remove({ username: 'hexcola'}, function(err){
    if(!err){
        console.log('user hexcola was deleted');

        // Store user in a wired way since we need to hash password.
        db.User.passwordHash(password, function(err, hash){
            if(!err){
                if(!hash){
                    console.log('Hash Issues');
                } else {
                    var newUser = new db.User({
                        username: 'hexcola',
                        email: 'hexcola@gmail.com',
                        password_hash: hash,
                        lastLogin: Date.now()
                    });

                    newUser.save( function(err, user){
                        if(!err){
                            console.log('Saved user name:' + user.username);
                            console.log('_id of saved user: ' + user._id);
                            console.log('Saved user password_hash: ' + user.password_hash);

                            // dose user password match?
                            db.User.findOne(
                                { 'username': username },
                                function(err, user){
                                    if(!err){
                                        if(!user){
                                            console.log('Not find user....')
                                        } else {
                                            db.User.passwordCompare('123456', user.password_hash, function(err, res){
                                                if(!err){
                                                    if(res){
                                                        console.log('User password is good');
                                                    } else {
                                                        console.log('User password is wrong.');
                                                    }
                                                } else {
                                                    console.log('bcrypt compare issue');
                                                } 
                                            })
                                        }
                                    } else {
                                        console.log('Query Errors...');
                                    }
                                }
                            );
                        }
                    });
                }
            } else {
                console.log('Hash Error ' + err);
            }
        });

        
    }
});

