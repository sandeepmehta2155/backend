const jwt = require('jsonwebtoken')
const User = require("../model/userSchema")


const authentication = async(req, res , next) => {


    try {

        const token = req.cookies.jwttoken;

        const verifyToken = jwt.verify(token , process.env.SECRET_KEY)

        const rootUser = await User.findOne({ _id : verifyToken._id , "tokens.token" : token })

        if(!rootUser){
            throw new Error('User not found')
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next()
        
    } catch (error) {
        // console.log(error)    
    return res.status(400).json({message : "Unauthorized : No token provided"})

    }

}

module.exports = {authentication}