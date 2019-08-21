// 3-importing the product,js file where we setted up the schema for mongoose 
var Product=require('../models/product');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/shop',{ useNewUrlParser: true });
// now defining the blueprint we made by giving them the imageurls and title ,price,description;
// here we make an array named products and store new product inside it for our shopping cart.. 
var products= [
    new Product({
    imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title:'Gothic',
    description:'some Game !!!!',
    price:10
}),
    new Product({
    imagePath:'https://upload.wikimedia.org/wikipedia/en/6/6d/Urb-cover.jpg',
    title:'Urban Region',
    description:'Awe Game !!!!',
    price:14
}),
    new Product({
    imagePath:'https://upload.wikimedia.org/wikipedia/en/e/e9/God_Hand_%282006_Playstation_2%29_video_game_cover_art.jpg',
    title:'God hand',
    description:' Game !!!!',
    price:15
}),
new Product({
    imagePath:'https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg',
    title:'God of war',
    description:'Awesome Game !!!!',
    price:17
})
];
// storing the products array in the database by using the save function provided by mongoose 
// in the products collection
// we disconnect only after we have saved all the products in the database thats why use this done function 
// which tells us thats we have saved all the products to the database because the the save function is asyncronos
// and there may be chances that disconnect functions will be executed before all the products are saved in the database
var done=0;
for(i=0;i<products.length;i++){
products[i].save(function(err,result){
done++;
if(done==products.length){
    exit();
}
})
}
function exit(){
mongoose.disconnect();
}



// now we are done storing the items in the database and now we have to show these poducts on the 
// main index page so we go to the routes folder in the index.js file and pass the products array as 
// an argument to the index.hbs view to display on the main page



