const express = require("express");
const User = require("../model/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post('/api/signup', async (req, res) => {
try {
     //get the data from the client
   const { name, email, password } = req.body;

   const existingUser = await User.findOne({email});
   //existingUser is not bool, in js it just check if its not empty
   if(existingUser) {
    return res.status(400).json({msg: "User with same email already exists!"});
   }

   //for encryption and 8 is salt which randomizes the string
   const hashedPassword = await bcryptjs.hash(password, 8); 

   let user = new User({
    email,
    password: hashedPassword,
    name,
   });

   user = await user.save();
   res.json({user: user});

    //post the data in database
    //return the data to user
} catch (e) {
    res.status(500).json({error : e.message});
}
    
   
});

authRouter.post("/api/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({msg: "User with that email does not exist"});
        }
       const isMatch = await bcryptjs.compare(password, user.password);
       if(!isMatch) {
        return res.status(400).json({msg: "Incorrect Password!"});
       }
       const token = jwt.sign({id: user._id}, "passwordKey"); //authorise if jwt is correct or not
       res.json({token, ...user._doc});
       //{
        // 'token' : 'someToken'
       //'name':'Riv'
       //'email':'rr@gmail.com'
       //}

    } catch (e) {}
})

authRouter.post("/tokenIsValid", async (req, res) => {

    try {
    const token = req.header('x-auth-token');
    if(!token) return res.json(false);
    // "passwordKey" is the secretOrPublicKey which we mention above in signin
    const verified = jwt.verify(token, 'passwordKey');
        if(!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        return res.json(true);
        
    } catch (e) {
        res.status(500).json({error: e.message});
    }
    // for token we will use header instead of body
});

authRouter.get('/', auth, async(req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
})

module.exports = authRouter; //add parameters by {authRouter, name: "PERSON_NAME"}