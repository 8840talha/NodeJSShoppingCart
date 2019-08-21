// step 17 ->Creating the order schema to save our orders to the orders collection in the database
// so we create the schema and use the 'User' reference from the user.js file in modelsfolder
// now lets show our user the items purchased by the user by creating a file profile.hbs in user folder inside views folder
// lets go there to checkit
var mongoose=require('mongoose');
var Schema =mongoose.Schema;
var bcrypt= require('bcrypt-nodejs');
var schema=new Schema({
 user: {type: Schema.Types.ObjectId, ref: 'User'},
 cart: {type: Object, required:true},
 address: {type: String, required:true},
 name: {type: String, required:true},
//  payment id will be retrived from the stripe payments page
// now lets go to the index.js file to save our orders.
 paymentId: {type:String, required:true}
});
module.exports=mongoose.model('Order', schema);