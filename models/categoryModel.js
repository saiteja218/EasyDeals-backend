const mongoose=require('mongoose');

const customerSchema=mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports=mongoose.model("Category",customerSchema) 