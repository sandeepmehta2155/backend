const mongoose = require('mongoose')

const cart = new mongoose.Schema({
   
    username : {
        type : String , 
        required : true
    } , 
    userID : {
        type : Object , 
        required : true
    } ,   
    products : [{
       productName : {type : String} ,
       productID : { type : Object},
       productPrice : { type : Number , default : 0},
       productQuantity : { type : Number , default : 0}
    }] , 
    createdAT : {
        type : Date, 
        default : Date.now,
        required : true
    },
    updatedAt : {
        type : Date, 
        default : Date.now,
        required : true
    },
})

const UserCart = mongoose.model('USERCART' , cart )

module.exports = UserCart