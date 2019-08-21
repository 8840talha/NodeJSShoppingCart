var mongoose=require('mongoose');
var Schema =mongoose.Schema;
var bcrypt= require('bcrypt-nodejs');
// 2->setting up the blueprints example the attributes  that each poduct will have as Js object
// its just a blueprint acc to which the model will be defined 
var schema=new Schema({

imagePath:{type:String,required:true },
title:{type:String,required:true },
description:{type:String,required:true },
price:{type:Number,required:true },
})
// exporting the file to use in other files 
// specifying the name of the file and the schema that it being send from this file  to other files.
// now were done with the schema setup.and now we want to add our items of the shopping cart so we make a new folder
// named seed and inside that make a new file product-seeder ion which we add our new product by using the schema blueprint
module.exports=mongoose.model('Product',schema);