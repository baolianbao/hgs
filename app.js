var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.locals.dbURI = 'mongodb://localhost/huaguoshan'

mongoose.connect(app.locals.dbURI);


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
    username: {type: String, unique: true, index: true } // login name if they have
});

userSchema.statics.representation = function(){
  return 'User: ' + this.username;
}

// Build the User model
mongoose.model( 'User', userSchema );



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'recommand 128 bytes random string',
  cookie: { maxAge: 60 * 1000 }
}));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.get('/', function(req,res){
	res.render('index.html');
});

app.post('/', function(req, res){
    // get user

});


app.get('/user/:name', function(req,res){
	var name = req.params.name;
	res.render('user.html',{name: name});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
//     console.log('Did I am come here?');
//   var err = new Error('Not Found');
//   err.status = 404;
res.status(404).send('<h1>oops!</h1>');
//   next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




app.listen(3000);