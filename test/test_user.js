'use strict';

var db = require('../models/db');



var username = 'hexcola';
var password = '1234567';
/**
 * User test.
 */
// db.User.remove({ username: 'hexcola'}, function(err){
//     if(!err){
//         console.log('user hexcola was deleted');

//         var newUser = new db.User({
//             username: 'hexcola',
//             telephone: '11111111111',
//             password_hash: db.User.passwordHashSync(password),
//             lastLogin: Date.now(),
                
//         });

//         newUser.save( function(err, user){
//                         if(!err){
//                             console.log('Saved user name:' + user.username);
//                             console.log('_id of saved user: ' + user._id);
//                             console.log('Saved user password_hash: ' + user.password_hash);

//                             // dose user password match?
//                             db.User.findOne(
//                                 { 'username': username },
//                                 function(err, user){
//                                     if(err){ console.log(err); }

//                                     if(!user) { console.log('Not find user....') }

//                                     if(!db.User.passwordCompareSync('123456', user.password_hash)){
//                                         console.log('Password incorrect')
//                                     }
//                                 }
//                             );
//                         }
//                     });
        
//     } else {

//     }
// });


db.User.remove({ username: 'hexcola'}, function(err){
    if(!err){
        console.log('user hexcola was deleted');

        db.User.passwordHash(password, function(err, hash){
            if(err) { console.log('Hash Error') }

            if(!hash){
                console.log('No Hash Results');
            } 
            
            var newUser = new db.User({
                username: 'hexcola',
                cellphone: '11111111112',
                password_hash: hash,
                lastLogin: Date.now()
            });

            newUser.save( function(err, user){
                if(err) { console.log('Save Error : ' + err) }

                console.log('Saved user name:' + user.username);
                console.log('_id of saved user: ' + user._id);
                console.log('Saved user password_hash: ' + user.password_hash);

                // dose user password match?
                db.User.findOne(
                    { 'username': username },
                    function(err, user){
                        if(err) { console.log('Query Error') }

                        if(!user) { console.log('Not find user....') }

                        db.User.passwordCompare('1234567', user.password_hash, function(err, res){
                                    console.log('Check password');
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
                );
            });
        });
    }
})
