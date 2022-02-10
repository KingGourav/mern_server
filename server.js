const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
require("./db/conn");


const app = express();
app.use(cookieParser());




// const User = require("./db/model/userSchema");






app.use(express.json());
const PORT = process.env.PORT || 5000;

//now creating the middleware 

// const middleware = (req,res,next)=>
// {
//     console.log("middleware checking");
//     next();
// }

app.use(require('./router/auth'));
////////

app.get("/",(req,res)=>{
    res.send("hii from server sides");

});
// app.get("/about",middleware,(req,res)=>{ //using middleware//
//     res.send("hii from about sides");

// });
// app.get("/contact",(req,res)=>{
//     res.send("hii from contact sides");

// });
app.get("/signin",(req,res)=>{
    res.send("hii from login sides");

});
app.get("/signup",(req,res)=>{
    res.send("hii from logout sides");

});











app.listen(PORT,()=>{
    console.log(`listning on port no ${PORT}`);
})