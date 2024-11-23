const express=require("express");
const cors = require('cors');
const connectToDB=require("./connect")
const cookieParser=require('cookie-parser')


const app=express();


const productRouter=require("./userRoutes/routes")
const sellerRouter=require("./userRoutes/userRoutes");
const buyerRouter=require("./userRoutes/buyerRoutes");


require("dotenv").config();
app.use('/uploads', express.static('uploads'));


app.use(express.json());
// app.use(express.json());

app.use(cors(
    {
        origin: ['http://localhost:5173', 'https://tejas-easydeals.netlify.app'], 
        credentials:true
    }
))
app.use(cookieParser());

 
app.use('/seller/products',productRouter); 
app.use('/seller/user',sellerRouter);
app.use('/buyer/user',buyerRouter)
// app.use('/order')


const PORT=process.env.PORT;
app.listen(PORT,()=>{  
    console.log(`server listen at port ${PORT}`);
})
connectToDB();


