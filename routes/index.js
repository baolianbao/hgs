'use strict';

exports.index = function(req, res, next){
    res.render('index.html');
}

exports.apartments = function(req, res, next){
    res.render('apartments.html', { title: '公寓列表', 
        bodyTitleMain: '公寓列表', 
        bodyTitleSub: '慢慢挑，总有一间是您满意的！' } )
}

exports.contact = function(req, res, next){
    res.render('contact.html', { title: '联系我们', 
        bodyTitleMain: '联系我们', 
        bodyTitleSub: '有房源，找我们！' });
}

exports.blogs = function(req, res, next){
    res.render('blogs.html', { title: '喜雀生活', 
        bodyTitleMain: '喜雀生活', 
        bodyTitleSub: '喜雀公寓的点点滴滴' })
}

exports.faq = function(req, res, next){
    res.render('faq.html', { title: '常见问题', 
        bodyTitleMain: '常见问题', 
        bodyTitleSub: '您还有疑惑？！联系我们吧！' } );
}

exports.about = function(req, res, next){
    res.render('about.html', { title: '关于我们', 
        bodyTitleMain: '关于我们', 
        bodyTitleSub: '我们有一个优秀的团队！' });
}