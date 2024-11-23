const express = require('express');

const mongoose = require('mongoose');

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
        
    },
    category:{
        type:String,
        required:true 
    },
    image:{
        type:String,
        required:true 
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller",
        required:true
    },
    times_sold:{
        type:Number,default:0
    }
})
 
module.exports=mongoose.model("Product",productSchema);
