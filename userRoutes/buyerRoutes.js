const express = require('express');
const {register,login,setOrder,getOrders} = require("../controllers/customerControllers")

const router=express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/get-orders',getOrders);
router.post('/set-order',setOrder);


module.exports=router;
