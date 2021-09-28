const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema =  new mongoose.Schema({
    username : {
        type : String ,
        required : true
    } , 
    email : {
        type : String ,
        required : false
    } ,  
    password : {
        type : String ,
        required : true
    } , 
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
})


userSchema.pre('save' , async function (next) {
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password ,12);
        }

        next() 
})

userSchema.methods.generateAuthToken  = async function(){
  
    try {

        let newToken = jwt.sign({_id: this._id} , process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : newToken })
        await this.save();

        return newToken;

    } catch (error) {
        console.log(error)
        
    }
}


const User  = mongoose.model('USER' , userSchema)

module.exports = User