const seller = require('../models/sellerModel');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');




function createToken(id){
     return jwt.sign({id},process.env.JWT_SECRET||"12345678",{
        expiresIn:3*60*60
     });
}

const register= async (req,res)=>{

    try {
        const {name,email,password}=req.body;

         if (!name || !email || !password) {
      return res.status(400).send({
        message: "Please provide name, email, and password"
      });
    }

     // Check if the email already exists
    const existingSeller = await seller.findOne({ email });
    if (existingSeller) { 
      return res.status(400).send({
        message: "Email already in use"
      });
    }

        const hashedPwd=await bcrypt.hash(password,10);

        const newSeller=new seller({
            name,email,password:hashedPwd
        })
        const d= await newSeller.save();
        
        let token=createToken(d._id);
        res.cookie('jwt', token, {
          httpOnly: true,   // Prevents JavaScript access to the cookie
          secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
          sameSite: 'Strict', // Can be 'Lax' or 'Strict' depending on your needs
          maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
        });
        

        res.status(200).send({
            message:"new seller added succesfully!",
            newSeller 
        })
    } catch (error) {
        res.status(500).send({
            message:"internel server error",
            error
        })
    }
}


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ensure all fields are present
    if (!email || !password) {
      return res.status(400).send({
        message: "Please provide email and password"
      });
    }

    // Find seller by email
    const isEmail = await seller.findOne({ email });
    if (!isEmail) {
      return res.status(404).send({ message: "Email not found!" });
    }

    // Compare passwords
    if (await bcrypt.compare(password, isEmail.password)) {
      let token = createToken(isEmail._id);

      res.cookie('jwt', token, {
        httpOnly: true,   // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
        sameSite: 'Strict', // Can be 'Lax' or 'Strict' depending on your needs
        maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
      });
      

      console.log('Generated JWT Token:', token);
      return res.status(200).send({ message: "Login successful", user: isEmail });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server err",
      error: error.message
    });
  }
};



module.exports={register,login};