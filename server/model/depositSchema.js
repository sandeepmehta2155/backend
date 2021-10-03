const mongoose = require('mongoose')

const deposit = new mongoose.Schema({
   
    username : {
        type : String , 
        required : true
    } , 

    userID : {
        type : Object , 
        required : true
    }
     ,   
    deposits : {
        fivecents: { type : Number , default : 0},
        tencents:   { type : Number , default : 0},
        twentycents :  { type : Number , default : 0},
        fiftycents :  { type : Number , default : 0},
        hundredcents :  { type : Number , default : 0}
    } , 
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

const UserDeposits = mongoose.model('USERDEPOSITS' , deposit )

module.exports = UserDeposits