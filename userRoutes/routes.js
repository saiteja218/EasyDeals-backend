const express = require('express');
const {getProducts, addProducts, updateProducts, deleteProduct, getSellerProducts,upload,getCategory}=require("../controllers/productControllers")
const {checkUser}=require("../middleware/authMiddleware"); 

const router=express.Router();

router.get("/get-products",getProducts);
router.get("/get-categories",getCategory);
router.get("/get-seller-products/:id",getSellerProducts);

router.post("/add-products",upload.single('image'),addProducts);

router.patch("/update-products/:id",updateProducts);

router.delete("/delete-product/:id",deleteProduct);
 




module.exports=router;