//IMPORT FROM PACKAGES
const express = require("express"); //similar to import in flutter
const mongoose = require("mongoose");


//IMPORT FROM FILES
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

//INIT

//first api using express
const PORT = process.env.PORT || 3000;
const app = express(); //creating object
const DB = "mongodb+srv://abhijeets94:abhijeet1234@cluster0.7ur2yjy.mongodb.net/?retryWrites=true&w=majority"


//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//Connections 
mongoose.connect(DB).then(() => {
    console.log("connection success")
}).catch((e) => {console.log(`Exception ${e} occured!`)});

//GET, PUT, POST, DELETE, UPDATE = CRUD  

//we need to specify "0.0.0.0" as it wont work on android emulators
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at port ${PORT} hello`);
 
} ) 