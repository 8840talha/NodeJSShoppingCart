var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');

// 7--> creating the schema for users and encrypting the password uding bcrypt 
// so that no one can read the passwords of any user 
// these password encryption functionalities will be used for our sign up and signin process to keep our 
// passwords confidential.
// NOw Lets work on the CSRF Protection so as to protect our sessions from being stolen and to protect our account from misuse
// now lets go to the user.js file in our routes folder to set the routes for signup and signin pages
var userSchema = new Schema({
    email:{type: String, required: true},
    password:{type: String,required: true}
});

// here encryptPassword method creates encrypted password done by synchronous hashing with 5 salt rounds
// here we compare the password encrypted and the stored password to check whether hashed password matches the entered password or not
// this encryptpassword method is called from passport.js file in config folder where we create the new user
userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};
userSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports=mongoose.model('User',userSchema);