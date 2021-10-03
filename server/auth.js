const express = require('express')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const {authentication} = require("./middleware/authenticate")
const router = express.Router()

require("./database-connect/initial-connect")

const _ = require('lodash')

const User = require("./model/userSchema")
const UserDeposits = require('./model/depositSchema')
const Password = require('./model/passwordSchema')
const Product = require('./model/productSchema')
const UserCart = require('./model/productsboughtSchema')

router.post("/register" , async (req,res) => {
    
    const {username , password , role } = req.body

    let passwordDB , deposit , cart ;

    if(!username  || !password || !role){   
        return res.status(422).json({error : "plz fill required data"})
    }

    try {
            const userExist = await User.findOne({ username : username })
            
            if(userExist){
                return res.status(422).json({ error : "username exists" })
            }

            const user = new User({ username , role })          

            const userRegister = await user.save()
            
            if(userRegister){

             passwordDB = new Password({
                userID : userRegister.id ,
                password : password 
            })
            
            deposit = new UserDeposits({
                username : username ,
                userID : userRegister.id
            })
            
            cart = new UserCart({
                username : username ,
                userID : userRegister.id 
            })

            }

            const savedDeposits = await deposit.save()

            const passwordRegister = await passwordDB.save()

            const savedCart = await cart.save()

            if(userRegister && passwordRegister && savedDeposits && savedCart )
            return res.status(201).json({message  : "User saved successfully"})

            return res.status(501).json({ message : "failed to registered"})    

    } catch (err) {
        console.log(err)
        return res.status(406).json({ message : "error while registrations"})
    }

})

router.post("/signin" , async (req,res)=>{

    let token;
    
    try {
        const {username , password} = req.body;

            if(!username , !password){
                return res.status(400).json({ error : "plz fill the data"})
            }

            const userLogin = await User.findOne({
                username : username
            })


           if(!userLogin)
           return res.status(400).json({ error : "username not found"})

           
           if(userLogin)
           passwordLogin = await Password.findOne({
               userID : userLogin.id
           })

           if(!passwordLogin)
           return res.status(400).json({ error : "wrong"})

           const isMatch = await bcrypt.compare(password , passwordLogin.password )

           if(!isMatch) return res.status(400).json({ error : "invalid credentials"})
           else {

            token = await userLogin.generateAuthToken();

            res.cookie("jwttoken" , token , {
                expires : new Date(Date.now() + 25892000000),
                httpOnly : true
            })
 
            return res.status(200).json({message : "user authentication is successful" , token : token })

           }   

    } catch (error) {

        console.log(error)
        return res.status(406).json({ message : "failed authentication"})
    }

})

router.get("/about"  , authentication , (req,res) => {
        return res.send(req.rootUser)
})

router.get("/getproducts" ,async (req,res) => {
    
    const products = await Product.find({})

    res.json({products : products})

})

router.get('/getproductwithid/:id' , async(req,res) => {

    const _id = req.params.id;

    const products = await Product.findById(_id)

    res.json({products : products})
})

router.delete("/removeproduct/:id" , authentication ,async (req,res) => {

    let newList;
    
    const _id = req.params.id;

    try {

        const deleteProduct = await Product.findByIdAndDelete(_id)

        if(deleteProduct)
        newList = await Product.find({})
    
        res.status(200).json({products : newList})
        
    } catch (error) {
        console.log(error)

        res.status(401).json({message : "failed to remove product"})
    } 

})

    router.get("/getdeposists/:id" , authentication  , async(req,res) =>{

        const _id = req.params.id;

        const user = await UserDeposits.findOne({userID : _id})

        if(!user)
        return res.status(404).json({ message : 'User not found' })

        return res.status(200).json({ user : user})

    })


    router.patch("/deposists/:id" , authentication , async(req,res) =>{

    const _id = req.params.id;

    const depositUpdate = _.omit(req.body.deposits , ['_id']);

    let user = await UserDeposits.findOne({ userID : _id })

    user = _.extend( user , depositUpdate )

    user = await user.save()

    if(!user)
    return res.json(404).json({ message : 'User not found' })

    return res.status(200).send( user )
    })

    // update a particular product for 

    router.patch("/updateproduct/:id" , authentication , async (req,res) => {

        let newList;

        const _id = req.params.id;

    try {

        const updateproduct = await Product.findByIdAndUpdate(_id , req.body )

        if(updateproduct)
        newList = await Product.find({})
    
        res.status(200).json({products : newList})
        
    } catch (error) {
        // console.log(error)

        res.status(404).json({message : "failed to update product"})
    }

})

router.get("/getuserproducts/:id" , authentication  , async(req,res) =>{

        const _id = req.params.id;

        const user = await UserCart.findOne({userID : _id})

        if(!user)
        return res.status(404).json({ message : 'User not found' })

        return res.status(200).json({ user : user})

    })


    router.patch("/buyproducts/:id" , async(req,res) =>{

    const _id = req.params.id;

    const addProduct = req.body

    let user = await UserCart.findOne({ userID : _id })

    user = _.extend( user , addProduct )

    user = await user.save()

    if(!user)
    return res.json(404).json({ message : 'User not found' })

    return res.status(200).send( user )
    })

router.post("/product" , authentication  , async (req,res) => {

    let userWithProduct ,  savedProduct;

    try {

        const { username , productName , productDescription , productQuantity ,productPrice } = req.body

        if(!username || !productName || !productDescription)
        res.status(400).json({ message : "blank fields"})

        const userContact = User.findOne({ username : username })

        if(userContact)
        userWithProduct =  new Product({ 
            sellerUserName : username , 
            productName : productName ,
            productDescription : productDescription,
            productQuantity : productQuantity,
            productPrice : productPrice
        })

        if(userWithProduct)
        savedProduct = await userWithProduct.save()

        if(savedProduct)
        res.status(200).json({ message: "Product saved successfully" })

        else 
        res.status(401).json({ message : "Unable to add product"})

        
    } catch (error) {
        console.log(error)

        res.status(401).json({ message : "unable to add product in DB" })
    }

    return res.send(req.rootUser)
})


router.get("/" , (req,res) => {

    res.send('This is auth page')
})

module.exports = router