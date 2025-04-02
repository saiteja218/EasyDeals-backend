const express = require('express');
const {getProducts, addProducts, updateProducts, deleteProduct, getSellerProducts,getCategory}=require("../controllers/productControllers")
const {checkUser}=require("../middleware/authMiddleware"); 

const router=express.Router();

router.get("/get-products",getProducts);
router.get("/get-categories",getCategory);
router.get("/get-seller-products/:id",checkUser,getSellerProducts);

router.post("/add-products",checkUser,addProducts);

router.patch("/update-products/:id",checkUser,updateProducts);

router.delete("/delete-product/:id",checkUser,deleteProduct);





module.exports=router;