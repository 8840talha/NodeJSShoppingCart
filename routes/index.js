var express = require('express');
var router = express.Router();


var Cart = require('../models/cart');
var Product=require('../models/product');
// importing the order schema from order.js
var Order=require('../models/order');

// 4->Rendering the index view on default forward slash and displaying the products in chunks of 3 
// as we want to display 3 items in one row for a better User Experience
// so we loopthrough the products and store 3 items in an array name productChunks and send 
// as products:productChunks to the index.hbs file 
// now we  go to the index.hbs file and using handlebars we loop through the array to display the products.
router.get('/', function(req, res, next) {
  // displaying the success message on success object in index.hbs file
  var successMsg = req.flash('success')[0];  
  Product.find(function(err,docs){
    var productChunks=[];
    var chunkSize = 3;
    for(var i=0;i<docs.length;i+=chunkSize){
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart',products:productChunks, successMsg: successMsg, noMessages: !successMsg});
  });

});
// step 14-> Creating the get route for addtocart and passing the id of the product
// retriving the id of product with req.params.id
// creating a new model for our cart object in cart.js in models folder
// we are requiring our cart.js file in this file and creating its new instance each time when a product is being added
//we are finding the product in the database by its id and each time adding the product to the cart by add method 
// which is defined in the cart.js file lets see in cart.js file 
// before showing the products on the shopping cart view we need to add a badge infront of the 
// shopping cart link which shows the number of items in the cart in header.hbs file
// so lets display our cart by making a new view  shoppingcart.hbs in the shop folder 
// and below we make the get route of our shopping cart .plzz check it out  
router.get('/add-to-cart/:id',function(req,res,next){
     var productId = req.params.id;
     var cart = new Cart(req.session.cart ? req.session.cart : {});
     Product.findById(productId, function(err, product){
                    if(err){
                      return res.redirect('/');
                    }
                    cart.add(product, product.id);
                    req.session.cart = cart;
                    // here we our cart object to the terminal to see whether the Cart is working ass desired 
                    console.log(req.session.cart);
                    res.redirect('/');
     });    });

    router.get('/reduce/:id', function(req,res,next){
       var productId = req.params.id;
       var cart = new Cart(req.session.cart ? req.session.cart : {});

       cart.reduceByOne(productId);
       req.session.cart = cart;
       res.redirect('/shopping-cart');
    });

    router.get('/remove/:id', function(req,res,next){
      var productId = req.params.id;
      var cart = new Cart(req.session.cart ? req.session.cart : {});

      cart.removeItem(productId);
      req.session.cart = cart;
      res.redirect('/shopping-cart');
   });
// Shopping cart-route
// here we create the shopping cart get route and check that if we have our cart means if we have a stored session
// then we render the shopping-cart view and pass the products as the cart.generateArray method in which we have 
// all the stored products and the totalPrice also and if session is not stored we render the shopping cart page with products as null

    router.get('/shopping-cart',function(req,res,next){
        if(!req.session.cart){
          return res.render('shop/shopping-cart',{products:null});

        }
        var cart = new Cart(req.session.cart);
        res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice:cart.totalPrice });
    });

//GET ROUTE AND POST ROUTE FOR CHECKOUT PAGE TO DISPLAY THE PAGE ON THE CHECKOUT.HBS VIEW AND POST ROUTE FOR POSTING
// THE chekout FORM to the server for making payments  
// using the isLoggedin function to make sure that user redirects to checkout page only if huser is signned in
    router.get('/checkout', isLoggedIn, function(req,res,next){
      if(!req.session.cart){
        return res.redirect('/shopping-cart');

      }
      var cart = new Cart(req.session.cart );
      // res.render('shop/checkout',{ total:cart.totalPrice });
      var errMsg = req.flash('error')[0];

      res.render("shop/checkout", {total: cart.totalPrice,  errMsg, noError: !errMsg });
  });
// setting up the stripe payment method to charge a credit card and if we got error we display it through checkout.hbs file 
// by looping it
// using the isLoggedin function to make sure that user redirects to checkout page only if user is signned in
  router.post('/checkout', isLoggedIn, function(req,res,next){
    if(!req.session.cart){
      return res.redirect('shop/shopping-cart');

    }
    var cart = new Cart(req.session.cart );
 
    var stripe = require('stripe')("sk_test_8EZPlEhFfGqRD39xZ57cZAfb00xnmxzAxY");
    stripe.charges.create({
      amount: cart.totalPrice*100,
      currency:"usd",
      source:req.body.stripeToken,
      description:"charge for test"
    }, function(err, charge){
        if(err){
          req.flash('error', err.message);
          console.log(err.message);
          return res.redirect('/checkout');
        }
// using the order schema imported from order.js file and accessing the details from the post method of the from by using req.body

        var order = new Order({
           user: req.user,
           cart: cart,
           address: req.body.address,
           name:req.body.name,
          //  paymentid is got fromthe charge object given by stripe servers
           paymentId: charge.id
        });
// SAVING THE ORDERS IN THE DATABASE
        order.save(function(err,result){
          req.flash('success','Successfully bought product!');
          req.session.cart = null;
          res.redirect('/');
        });
        
    });

  });
  

module.exports = router;
// this function is used to check  if the user is logged then we redirect to signin page
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
          return next();
    }
    // saving the  signin oldUrl
    // lets go to the signin route in user.js file in routes folder and work on the signin process to set up the redirection in case of successfull payments
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
  }
