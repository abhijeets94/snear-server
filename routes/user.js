const e = require("express");
const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../model/order");
const { Product } = require("../model/product");
const User = require("../model/user");

userRouter.post('/api/add-to-cart',auth, async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);
        if(user.cart.length == 0) {
            user.cart.push({product, quantity: 1});
        } else {
            let isProductFound = false;
            for (let index = 0; index < user.cart.length; index++) {
              if(user.cart[index].product._id.equals(product._id)) {
                isProductFound = true;
              }
                
            }
            if(isProductFound) {
                let producttt = user.cart.find((productt) => 
                    productt.product._id.equals(product._id)
                );
                producttt.quantity += 1;
            } else {
            user.cart.push({product, quantity: 1});

            }
        }
        user = await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({error: e.message});
    }
});

userRouter.delete('/api/remove-from-cart/:id',auth, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);
       
           
            for (let index = 0; index < user.cart.length; index++) {
              if(user.cart[index].product._id.equals(product._id)) {
                if(user.cart[index].quantity == 1) {

                    user.cart.splice(index, 1);
                } else {
                    user.cart[index].quantity -= 1;
                }
              } 
                
            }
           
        
        user = await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({error: e.message});
    }
});

//save user address

userRouter.post('/api/save-user-address', auth, async(req, res) => {
    try {
        const {address} = req.body;
        let user = await user.findById(req.user);
        user.address = address;
        user = await user.save();
        res.json(user);

    } catch (error) {
        res.status(500).json({error: e.message});
    }
});


//order product
userRouter.post('/api/order', auth, async(req, res) => {
    try {
        const {cart, totalPrice, address} = req.body;
        let products = [];

        for (let i = 0; i < cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);
            if(product.quantity >= cart[i].quantity) {
                product.quantity -= cart[i].quantity;
                products.push({product, quantity: cart[i].quantity});
                await product.save();
            } else {
                return res.json({msg: `${product.name} is out of stock`});
            }
            
        }
        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save;

        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        res.json(order);

    } catch (error) {
        res.status(500).json({error: e.message});
    }
});

userRouter.get('/api/orders/me', auth, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.user});
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


module.exports = userRouter;
