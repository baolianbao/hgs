'use strict';

/**
 * Auth dependencies
 */
var mongoose = require('mongoose');
var db = require('../models/db');

exports.dashbord = function(req, res, next){
    res.send('Well, this is a good start');
}
