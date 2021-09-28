const express = require('express')
const app = express()
const cors = require('cors')

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cors())

const PORT = process.env.PORT;

app.use(express.json())

require("./database-connect/initial-connect.js")

const middleware = (req ,res , next) => {
    console.log('middleware ')

    next()
}

const auth = require("./auth")


app.use("/auth",auth)

const User = require('./model/userSchema')



app.get("/contact" , (req,res) => {
    // res.cookie("jwttoken" , "sandeep")
    res.send("This is contact")
})

app.get("/" , (req,res) => {
    res.send("Hello world")
})

app.listen( 5000 , () => {
    console.log('server started')
})