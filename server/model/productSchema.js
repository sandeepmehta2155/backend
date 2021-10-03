const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
   
    sellerUserName : {
        type : Object , 
        required : true
    } ,  
    productName : {
        type : String , 
        required : true
    } ,
    productPrice : {
        type : Number , 
        required : true
    }
    , 
     productDescription : {
        type : String , 
        required : true
    }
    ,
    productQuantity : {
        type : Number , 
        required : true
    }
    ,
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

const Product = mongoose.model('PRODUCT' , productSchema )

module.exports = Product