const product = require("../models/productModel");
const categoryModel=require("../models/categoryModel"); 
// const multer = require('multer');
const path = require('path');
const cloudinary = require("../lib/cloudinary.js");
// const seller=require('../models/sellerModel');



const getProducts = async (req, res) => {
    try {
        const data = await product.find({});
        res.status(200).send({
            success: true,
            message: "Data of Products",
            data
        });


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error
        })

    }
}

const getCategory=async (req,res)=>{
    try{
        const categories=await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"categories",
            categories
        })

    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error
        })
}
}

const getSellerProducts = async (req, res) => {
    try {
        const id = req.params.id;

        const sellerProducts = await product.find({ seller: id });
        // console.log(sellerProducts)
        res.status(200).send({
            success: true,
            message: "seller products",
            sellerProducts
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error
        })
    }
}



const algoliasearch = require('algoliasearch').default;
const client = algoliasearch('VQ3KJTIQVD', '1ef54c07db897a42aa603e7acb1861ad');
const index = client.initIndex('products');  

const addProducts = async (req, res) => {
    try {
        const { name, description, price, discount, category,image, seller } = req.body;
        // console.log(req.body)
        if (!image) {
            return res.status(400).send({ success: false, message: "Image is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image

        const productData = {
            name, description, price, discount, category, image:imageUrl, seller
        }
        const newProduct = await new product(productData).save();
         try {
            const existingCategory = await categoryModel.findOne({ category: category.toLowerCase() });
            if (!existingCategory) {
                await new categoryModel({ category: category.toLowerCase() }).save();
            }
         } catch (error) {
            console.error("error adding category",error)
         }
        // console.log(client);
        

        // await index.saveObject({
        //     objectID: newProduct._id.toString(),  // Algolia requires objectID for each object
        //     name, 
        //     description, 
        //     price: parseFloat(price), 
        //     discount, 
        //     category, 
        //     image, 
        //     seller
        // });

        res.status(200).send({
            success: true,
            message: "product saved succesfully",
            productData
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            err
        })

    }
}


const updateProducts = async (req, res) => {
    try {
        console.log("updated")
        const productId = req.params.id;
        console.log(req.body);

        const { name, description, price, discount, category,image ,seller } = req.body;
        // const imag = req.file ? req.file.path : undefined;
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;


        const productData = {
            name, description, price, discount, category, image:imageUrl, seller
        }
        console.log(productData)
        await product.updateOne({ _id: productId }, { $set: productData });
        

        // Update in Algolia
        // awa=

        res.status(200).send({
            success: true,
            message: "product saved succesfuly",
            productData
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal error",
            error: error
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const Id = req.params.id;
        // await index.deleteObject(Id);
        await product.findOneAndDelete({ _id: Id });
       
        res.status(200).send({
            success: true,
            message: "product delete succesfully",
        })
    } catch (error) {
        res.status(500).send({
            success: false, 
            message: "Internal error",
            error
        })
    }
}


module.exports = { getProducts, addProducts, updateProducts, deleteProduct, getSellerProducts,getCategory };