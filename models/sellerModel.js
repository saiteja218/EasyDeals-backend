const mongoose=require('mongoose');
const {isEmail}=require("validator");

const sellerSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"please enter email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter password"],
        minlength:[6,"minimum password length is 6 characters"]
    }

})

module.exports= mongoose.model("Seller",sellerSchema);