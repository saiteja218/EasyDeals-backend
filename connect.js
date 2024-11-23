// 
require("dotenv").config();
const mongoose = require('mongoose');

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db")
    }catch(err){
        console.log("there is an error"+ err);
    }
}

module.exports=connectDb;