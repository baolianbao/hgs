'use strict';

exports.index = function(req, res, next){
    res.render('index.html');
}

exports.contact = function(req, res, next){
    res.render('contact.html');
}

exports.faq = function(req, res, next){
    res.render('faq.html');
}

exports.about = function(req, res, next){
    res.render('about.html');
}