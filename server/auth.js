const express = require('express')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const {authentication} = require("./middleware/authenticate")
const router = express.Router()

require("./database-connect/initial-connect")

const User = require("./model/userSchema")

router.get("/" , (req,res) => {

    res.send('This is auth page')
})

router.post("/register" , async (req,res) => {
    
    const {username , email , password } = req.body

    if(!username || !email || !password){   
        return res.status(422).json({error : "plz fill required data"})
    }

    try {
            const userExist = await User.findOne({email : email })
            
            if(userExist){
                return res.status(422).json({ error : "email exists" })
            }

            const user = new User({ username , email , password })

            const userRegister = await user.save()

            if(userRegister)
            return res.status(201).json({message  : "User saved successfully"})

            return res.status(501).json({ message : "failed to registered"})    

    } catch (err) {
        console.log(err)
    }

})

router.post("/signin" , async (req,res)=>{

    let token;
    
    try {
        const {username ,password} = req.body;

        

            if(!username , !password){
                return res.status(400).json({ error : "plz fill the data"})
            }

            const userLogin = await User.findOne({
                username : username
            })

            const isMatch = await bcrypt.compare(password , userLogin.password )

           if(!userLogin)
           return res.status(400).json({ error : "username not found"})

           if(!isMatch) return res.status(400).json({ error : "invalid credentials"})
           else {

            token = await userLogin.generateAuthToken();

            res.cookie("jwttoken" , token , {
                expires : new Date(Date.now() + 25892000000),
                httpOnly : true
            })
 
            return res.status(200).json({message : "user authentication is successful"})

           }
           

    } catch (error) {

        console.log(error)
    }

})

router.get("/about"  , authentication , (req,res) => {
  return res.send(req.rootUser)
})

module.exports = router