//step 10 -- using passport to authenticate the user by first creating its local strategy and setting
// up all the fields and then finding the user in the database and if user dont exists we create a new user 
// and hash the password for that new user by encrypt password method and now lets apply the strategy by going in 
// the user.js file in routes folder. 
var passport=require('passport');
var User=require('../models/user');  
var LocalStrategy=require('passport-local').Strategy;
const { 
    check, validationResult } = require('express-validator');

// new Strategy for signup.
passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req, email, password, done){


    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
    var errors=req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
// finding user in the database that whether user exists or not
    User.findOne({'email': email},function(err, user){
        if(err){
            return done(err);
        }
        // if user already exists
        if(user){
            return done(null, false, {message:' Email is already in use.'});
        }
        // now making new user if we pass above checks.
        var newUser=new User();
        newUser.email = email;
        // encrypt password method is defined in user.js file in models folder
        newUser.password=newUser.encryptPassword(password);
        newUser.save(function(err,result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });

}));

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req, email, password, done){


    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty();
    var errors=req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
// finding user in the database that whether user exists or not
    User.findOne({'email': email},function(err, user){
        if(err){
            return done(err);
        }
        // if user already exists
        if(!user){
            return done(null, false, {message:'No user found'});
        }
        if(!user.validPassword(password)){
        return done(null, false, {message:'Wrong Password'});
    }
         return done(null, user);
    });

}));
passport.serializeUser(function(user, done){
    done(null, user.id);
     });
 
passport.deserializeUser(function(id, done){
         User.findById(id,function(err, user){
             done(err, user);
         });
     });