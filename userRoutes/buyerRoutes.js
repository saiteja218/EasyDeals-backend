const express = require('express');
const {register,login,setOrder,getOrders,getProds} = require("../controllers/customerControllers")

const router=express.Router();

router.post('/register',register)
router.post('/login',login)
router.post('/get-orders',getOrders);
router.post('/set-order',setOrder);
router.post("/cart/get-products",getProds); 


module.exports=router;
