var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var app = express();

// Load database.
var db = require('./models/db');
var config = require('./config');
var errorHandler = require('./errorHandler');

// routes
var index = require('./routes/index');
var auth = require('./routes/auth');
var user = require('./routes/user');
var apartment = require('./routes/apartment');
var trusteeship = require('./routes/trusteeship');
var apartmentBill = require('./routes/apartment_bill');
var room = require('./routes/room');
var rent = require('./routes/rent')
var roomBill = require('./routes/room_bill');
var blog = require('./routes/blog');
var comment = require('./routes/comment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: config.SESSION_SECRET,
  cookie: { maxAge: 60 * 1000 }
}));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.use(flash());

app.get('/', index.index);

/**
 * Authentication
 */
app.get('/auth/login', auth.login);
app.post('/auth/login', auth.doLogin);
app.get('/auth/logout', auth.logout);

/**
 * User Management
 */
app.get('/user', user.all);

app.get('/user/new', user.create);
app.post('/user/new', user.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/user/:id', user.displayInfo);
app.get('/user/edit/:id', user.edit);
app.post('/user/edit/:id', user.doEdit);
app.get('/user/delete/:id', user.confirmDelete);
app.post('/user/delete/:id', user.doDelete);


/**
 * Apartments Management
 */
app.get('/apartment', apartment.all);

app.get('/apartment/new', apartment.create);
app.post('/apartment/new', apartment.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/apartment/:id', apartment.displayInfo);
app.get('/apartment/edit/:id', apartment.edit);
app.post('/apartment/edit/:id', apartment.doEdit);
app.get('/apartment/delete/:id', apartment.confirmDelete);
app.post('/apartment/delete/:id', apartment.doDelete);

/**
 * Apartment Trusteeship Record Management
 */
app.get('/trusteeship', trusteeship.all);
//------------------------------------------
app.get('/apartment/:apartment_id/trusteeship', trusteeship.specificAll);
//------------------------------------------
app.get('/apartment/:apartment_id/trusteeship/new', trusteeship.create ); 
app.post('/apartment/:apartment_id/trusteeship/new', trusteeship.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/apartment/:apartment_id/trusteeship/:id', trusteeship.displayInfo);

app.get('/apartment/:apartment_id/trusteeship/edit/:id', trusteeship.edit);
app.post('/apartment/:apartment_id/trusteeship/edit/:id', trusteeship.doEdit);
app.get('/apartment/:apartment_id/trusteeship/delete/:id', trusteeship.confirmDelete);
app.post('/apartment/:apartment_id/trusteeship/delete:id', trusteeship.doDelete);


/**
 * Apartment Bills Management
 */
app.get('/apartment/bill',apartmentBill.all);
//------------------------------------------
app.get('/apartment/:apartment_id/bill', apartmentBill.specificAll); // Get specific apartment bills 
//------------------------------------------
app.get('/apartment/:apartment_id/bill/new', apartmentBill.create ); 
app.post('/apartment/:apartment_id/bill/new', apartmentBill.doCreate);

// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/apartment/:apartment_id/bill/:id', apartmentBill.displayInfo); 

app.get('/apartment/:apartment_id/bill/edit/:id', apartmentBill.edit);
app.post('/apartment/:apartment_id/bill/edit/:id', apartmentBill.doEdit);
app.get('/apartment/:apartment_id/bill/delete/:id', apartmentBill.confirmDelete);
app.post('/apartment/:apartment_id/bill/delete:id', apartmentBill.doDelete);


/**
 * Apartment Rooms Management
 */
app.get('/room', room.all);
//-------------------------------------------
app.get('/apartment/:apartment_id/room', room.specificAll);
//-------------------------------------------
app.get('/apartment/:apartment_id/room/new', room.create);
app.post('/apartment/:apartment_id/room/new', room.doCreate);

// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/apartment/:apartment_id/room/:id', room.displayInfo);

app.get('/apartment/:apartment_id/room/edit/:id', room.edit );
app.post('/apartment/:apartment_id/room/edit/:id', room.doEdit);
app.get('/apartment/:apartment_id/room/delete/:id', room.confirmDelete);
app.post('/apartment/:apartment_id/room/delete/:id', room.doDelete);

/**
 * Apartment Rent Record Management
 */
app.get('/rent', rent.all);
//--------------------------------------------
app.get('/apartment/:apartment_id/room/:room_id/rent', rent.specificAll);
//--------------------------------------------
app.get('/apartment/:apartment_id/room/:room_id/rent/new', rent.create ); 
app.post('/apartment/:apartment_id/room/:room_id/rent/new', rent.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/apartment/:apartment_id/room/:room_id/rent/:id', rent.displayInfo);

app.get('/apartment/:apartment_id/room/:room_id/rent/edit/:id', rent.edit);
app.post('/apartment/:apartment_id/room/:room_id/rent/edit/:id', rent.doEdit);
app.get('/apartment/:apartment_id/room/:room_id/rent/delete/:id', rent.confirmDelete);
app.post('/apartment/:apartment_id/room/:room_id/rent/delete:id', rent.doDelete);

/**
 * Apartment Room Bill(s) Management
 */
app.get('/room/bill', roomBill.all);
//--------------------------------------------
app.get('/apartment/:apartment_id/room/:room_id/bill', roomBill.all);
//--------------------------------------------
app.get('/apartment/:apartment_id/room/:room_id/bill/new', roomBill.create ); 
app.post('/apartment/:apartment_id/room/:room_id/bill/new', roomBill.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/apartment/:apartment_id/room/:room_id/bill/:id', roomBill.displayInfo);

app.get('/apartment/:apartment_id/room/:room_id/bill/edit/:id', roomBill.edit);
app.post('/apartment/:apartment_id/room/:room_id/bill/edit/:id', roomBill.doEdit);
app.get('/apartment/:apartment_id/room/:room_id/bill/delete/:id', roomBill.confirmDelete);
app.post('/apartment/:apartment_id/room/:room_id/bill/delete:id', roomBill.doDelete);


/**
 * Blog Management
 */
app.get('/blog', blog.all);

app.get('/blog/new', blog.create);
app.post('/blog/new', blog.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/blog/:id', blog.displayInfo);

app.get('/blog/edit/:id', blog.edit);
app.post('/blog/edit/:id', blog.doEdit);
app.get('/blog/delete/:id', blog.confirmDelete);
app.post('/blog/delete/:id', blog.doDelete);


/**
 * Blog Comment Management
 */
app.get('/comment', comment.all);
//-------------------------------------------
app.get('/blog/:id/comment', comment.specificAll);
//-------------------------------------------
app.get('/blog/:id/comment/new', comment.create);
app.post('/blog/:id/comment/new', comment.doCreate);
// Must put after '/path/new', otherwise it will match the '/path:id' first 
app.get('/blog/:id/comment/:id', comment.displayInfo);
app.get('/blog/:id/comment/edit/:id', comment.edit );
app.post('/blog/:id/comment/edit/:id', comment.doEdit);
app.get('/blog/:id/comment/delete/:id', comment.confirmDelete);
app.post('/blog/:id/comment/delete/:id', comment.doDelete);


/**
 * Errors Handelr
 */
app.use(errorHandler.pageNotFound);
app.use(errorHandler.internalServerError);


app.listen(3000);