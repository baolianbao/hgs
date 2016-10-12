'use strict';


/**
 * Module dependencies.
 */
var config = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//-------------------------------
// Database configure
//-------------------------------

mongoose.connect(config.DB_URI);


var roleSchema = new mongoose.Schema({
    name: {type: String, unique:true}
});

roleSchema.statics.representation = function(){
  return 'Role: ' + this.name;
};

// Build the Role model
mongoose.model('Role', roleSchema);


var userSchema = new mongoose.Schema({
    role_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
    email: {type: String, unique: true, index: true },
    username: {type: String, unique: true, index: true },
    password_hash: {type: String }
});

userSchema.statics.passwordHash = function(password){
    bcrypt.hash(password, config.PASSWORD_SALT_ROUNDS, function(err,hash){
        if(!err){
            if(!hash){
                console.log('Hash Issues');
            } else {
                return hash;
            }
        } else {
            console.log('Hash Error ' + err);
        }

    });
};

userSchema.statics.passwordCompare = function(password){
    bcrypt.compare(password, hash, function(err, res){
        // 如何从数据库中获取hash呢？
    });
};



userSchema.statics.representation = function(){
  return 'User: ' + this.username;
}

// Build the User model
mongoose.model( 'User', userSchema );

var User = mongoose.model('User');
// ---------------------------------------------