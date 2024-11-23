const jwt = require('jsonwebtoken');
const Seller = require('../models/sellerModel.js');
// const cookieParser=require('cookie-parser')
const checkUser =async  (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log("JWT Token: ", token); 
    // console.log("All Cookies: ", req.cookies); // Check if token is being sent

    if (token) {
       jwt.verify(token, process.env.JWT_SECRET , async (err, decodedToken) => {
            if (err) {
                console.log("JWT Verification Error: ", err);  // Log the error
                res.locals.user = null;
                next();
            } else {
                // console.log("Decoded Token: ", decodedToken);  // Check decoded token
                try {
                    let user = await Seller.findById(decodedToken.id);
                    if (!user) {
                        console.log('Seller not found');
                        res.locals.user = null;
                    } else {
                        res.locals.user = user;
                        // console.log("User authenticated: ", user);  // Log user details
                    }
                    next();
                } catch (dbError) {
                    console.log("Database Error: ", dbError);  // Log any database errors
                    res.locals.user = null;
                    next();
                }
            }
        });
    } else {
        console.log("No JWT Token found in cookies");
        res.locals.user = null;
        return res.status(401).json({ message: 'No JWT token found' });
        // next();
    }
}

module.exports = { checkUser };
