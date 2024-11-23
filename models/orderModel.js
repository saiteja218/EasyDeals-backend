const mongoose = require('mongoose');

const orderSchema=mongoose.Schema({
      products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      }],
      customer:{
        type:mongoose.Schema.Types.ObjectId,  
        ref:"Customer",
        required:true
      },
      
      amount:{
        type:Number, required:true
      },
      orderDate:{
        type:Date,
        default:Date.now
      }
})

module.exports=mongoose.model("Order",orderSchema);

