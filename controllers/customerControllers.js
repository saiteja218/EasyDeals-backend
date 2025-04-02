const { default: isEmail } = require("validator/lib/isEmail");
const buyer = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const order = require("../models/orderModel");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")
const algoliasearch = require('algoliasearch').default;
const product = require("../models/productModel");
// imports product from "../models/productModel";

const client = algoliasearch('VQ3KJTIQVD', '1ef54c07db897a42aa603e7acb1861ad');
const index = client.initIndex('orders');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "12345678", {
    expiresIn: 3 * 60 * 60
  })
}

const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const hashedpwd = await bcryptjs.hash(password, 10);

    const details = new buyer({
      name, email, password: hashedpwd, address
    })

    const newBuyer = await details.save();

    let token = createToken(newBuyer._id);
    res.cookie('jwt', token, {
      maxAge: 3 * 60 * 60 * 1000, credetials: true
    })



    res.status(200).send({
      message: "customer added succesfully",
      isemail: newBuyer
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Internal server error",
      error
    })
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isemail = await buyer.findOne({ email });

    if (!isemail) {
      return res.status(404).send({ message: "Email not found!" });
    }

    if (await bcryptjs.compare(password, isemail.password)) {
      let token = createToken(isemail._id);
      res.cookie("jwt", token, {
        maxAge: 3 * 60 * 60 * 1000,
        credentials: true
      });
      return res.status(200).send({ message: "Login successful", isemail });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      error
    });
  }
};

const setOrder = async (req, res) => {

  const { products, customer, totalAmount } = req.body;
  // console.log(products,customer,totalAmount)

  try {
    const order = await new orderModel({ products, customer, amount: totalAmount }).save();

    // await index.saveObject({
    //     objectID: order._id.toString(),
    //   customer: order.customer,
    //   amount: order.amount,
    //   products: order.products
    // })
    // console.log(order);
    res.status(200).send(
      {
        success: true, message: "Order saved successfully!"
      }

    )
  } catch (error) {
    res.status(500).send(
      {
        success: false, message: "Order saved Unsuccessfully:("
      })
  }

}

const getOrders = async (req, res) => {
  const { customerId } = req.body;

  try {
      const orders = await orderModel.find({ customer: customerId }).lean();
      res.status(200).json({ success: true, orders });
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

module.exports = { getOrders };


const getProds = async (req, res) => {
    try {
        const { productIds } = req.body;
        if (!productIds || productIds.length === 0) {
          return res.status(400).json({ message: "No product IDs provided" });
        }
    
        const products = await product.find({ _id: { $in: productIds } });
      //  console.log(products)
        if (!products.length) {
          return res.status(404).json({ message: "Products not found" });
        }
    
        res.json({ products });
      } catch (error) {
        console.error("Error fetching cart products:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };





module.exports = {
  register, login, setOrder, getOrders,getProds
}