// here we are each time exporting our cart to index.js file to the get route of add to cart here we check if we have
// stored item in the cart already then we use the old cart or else we pass an empty object and 
// then add a new item to the cart and increase the qty,price,totalqty,totalprice of the old item if item was already prresent or we 
// increase the qty,price,totalqty,totalprice of the new item.
// here we also add the reduce by one function through which we can reduce the number of items of iur cart or remove all the items to empty the cart
// we finally make an arraay of the items addded and return the array through the generatearray function
module.exports=function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;


    this.add = function(item ,id){
          var storedItem = this.items[id];
          if(!storedItem){
              storedItem=this.items[id] = {item:item, qty:0, price:0};
          }
          storedItem.qty++;
          storedItem.price=storedItem.item.price * storedItem.qty;
          this.totalQty++;
          this.totalPrice += storedItem.item.price;
    };

  this.reduceByOne = function(id){
   this.items[id].qty--;
   this.items[id].price -= this.items[id].item.price;     
   this.totalQty--;
   this.totalPrice -= this.items[id].item.price;    
  
   if (this.items[id].qty <= 0 ){
       delete this.items[id];
   }
};

  this.removeItem = function(id){
    this.totalQty -=  this.items[id].qty;
    this.totalPrice -= this.items[id].price;     
    delete this.items[id];
  }


    this.generateArray = function(){
          var arr = [];
          for(var id in this.items){
              arr.push(this.items[id]);
          }   
          return arr;
    };
};