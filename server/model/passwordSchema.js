const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const passwordSchema = new mongoose.Schema({
    password : {
        type : String ,
        required : true
    } ,
    userID : {
        type : Object , 
        required : true
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

passwordSchema.pre('save' , async function (next) {
      
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password ,12);
    }

    next() 
})

const Password = mongoose.model('PASSWORD' , passwordSchema )

module.exports = Password