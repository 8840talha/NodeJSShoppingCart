var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs=require('express-handlebars');
var mongoose=require('mongoose');
var session=require('express-session');
var passport=require('passport');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var flash=require('connect-flash');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

      
var app = express();
// 1-> connecting to mongoose and  setting up the product schema in models/product.js folder
mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true });
// requiring the passport file 
require('./config/passport');
// view engine setup
// default view set to layout.hbs file   
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// setting up the validator after body parser
app.use(validator());
app.use(cookieParser());
// setting up the session
app.use(session({
  secret:'mysupersecret',
  resave: false,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:{ maxAge: 180 * 60 * 1000 }
}));
// setting up the connect-flash for flashing messages after sesion bcz flash uses sessions 
app.use(flash());
// setting up passport middleware
app.use(passport.initialize());
// using the passport session 
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// here we are setting res.locals.login res.locals.session so that this login variable and session 
// is available in all the view files in our project 
app.use(function(req,res,next){
 res.locals.login=req.isAuthenticated();
 res.locals.session = req.session;
 next();
});

app.use('/user', userRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
