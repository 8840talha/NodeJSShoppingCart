//8--> here we create our signup get and post request and  render the signup.hbs file in which we pass the csrf token to protect the session
//we use the csrf protection on express router so that all our routes in the router package are protected  
// and we embedd the csrftoken using handlebars in the signup.hbs file by addding an hidden input field.
// so lets go to signup.hbs file and see..
var express = require('express');
var router = express.Router();
var csrf=require('csurf');
var passport=require('passport');
var Order=require('../models/order');
var Cart=require('../models/cart');

var csrfProtection=csrf();

router.use(csrfProtection);
// user profile route which is accesible only if we are logged in and here we send the data of the item purchased by the user 
// to the profile.hbs to display it on the profile view
 
router.get('/profile',isLoggedIn,function(req,res,next){
   Order.find({user: req.user}, function(err, orders){
     if(err){
       return res.write('Error');
     }
     var cart;
     orders.forEach(function(order){
          cart = new Cart(order.cart);
          order.items = cart.generateArray();
     });
     res.render('user/profile', { orders: orders })
   }); 
  });
  router.get('/logout',isLoggedIn,function(req,res,next){
    req.logout();
    res.redirect('/');
})
router.use('/',notLoggedIn,function(rq,res,next){
      next();
  });

  // step 11--applying the localsignup  strategy on post route and displaying the messages on the signup.hbs view
  // by using connect-flash and the message is stored in 'error' and is sent passed to the view as messages
  // and we check that whether we get errors or not by checking the lenth of the messages and displaying it on
  // signup view in signup.hbs flie .lets go there 
router.get('/signup', function(req,res,next){
    var messages=req.flash('error');
    res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages, hasErrors: messages.length > 0}) ;           
     
  });
  // Authenticating User using passport
  // step18-> if we dont get any error in signing in or signin up then we go to the third parameter of the post route
  // and check if session.oldUrl exists then we clear that oldurls and redirect 
  // towards it or else we redirect to our profile page .thats it exactly we want 

  router.post('/signup',passport.authenticate('local.signup',{
  
    failureRedirect:'/user/signup',
    failureFlash: true
  
  }),function(req,res,next){
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
     
    }else{
      res.redirect('/user/profile');
    }
  });
 
  
  // user signin route here also we display the error mesages as done for signup route
  router.get('/signin',function(req,res,next){
    var messages=req.flash('error');
    res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages, hasErrors: messages.length > 0}) ;
  });
  // Now we authenticate the user with passport 
  // step18-> if we dont get any error in signing in or signin up then we go to the third parameter of the post route
  // and check if session.oldUrl exists then we clear that oldurls and redirect 
  // towards it or else we redirect to our profile page .thats it exactly we want 

  router.post('/signin',passport.authenticate('local.signin',{
    failureRedirect:'/user/signin',
    failureFlash: true
  
  }), function(req,res,next){ 
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
     
    }else{
      res.redirect('/user/profile');
    }
  });
 
  module.exports = router;
  
  // adding these logged in and loggout functions so as to make sure that which routes are available only after signin or 
  // which routes are available without signingin
  function isLoggedIn(req,res,next){
      if(req.isAuthenticated()){
            return next();
      }
      res.redirect('/');
  }
  function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
          return next();
    }
    res.redirect('/');
}