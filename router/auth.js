const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('../db/conn');
const User = require("../db/model/userSchema");
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");
router.get("/",(req,res)=>{
    res.send("hii from server router sides");

});

// using promisis


// router.post('/register',(req,res)=>{
// const {name,email,phone,work,password,cpassword} = req.body;

// if(!name || !email || !phone || !work || !password || !cpassword)
// {
//     return res.status(422).json({error : "plz fill all the fields"});

// }
// User.findOne({email:email}).then((userExist)=>{
//     if(userExist){
//         return res.status(422).json({error : "user erxists "});
//     }

//         const user = new User({name,email,phone,work,password,cpassword});
//         user.save().then(()=>{
//             res.status(201).json({mesage:"insert successfully"});
//         }).catch((error)=>{
//             res.status(500).json({error:"failed register"});
//         })
    
// }).catch(err => {console.log(err);})

// });

router.post("/register", async(req,res)=>{
    const {name,email,phone,work,password,cpassword} = req.body;
    if(!name || !email || !phone || !work || !password || !cpassword)
 {
     return res.status(422).json({error : "plz fill all the fields"});
 }

 try {
     const response = await User.findOne({email:email});
     if(response){ return res.status(422).json({error : "user erxists "}); }
     else if (password != cpassword) {
        return res.status(422).json({error : "password not matched "});
     }
     const user = new User({name,email,phone,work,password,cpassword});

     const userRegister = await user.save();

     if(userRegister)
     { res.status(201).json({mesage:"insert successfully"}); }
     
 } catch (error) {
     console.log(error);
 }

});

router.post('/signin',async(req,res)=>{
   
   try {
    const {email,password} = req.body;

    if(!email, !password)
    {
        return res.status(400).json({error:"plz fill all the fields"});
    }
    const userLogin = await User.findOne({email:email});
   
    

    if(userLogin) {
        const isMatch = await bcrypt.compare(password,userLogin.password);
        const token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwtoken",token,{
            expires:new Date(Date.now() + 25892000000),
            httpOnly:true
        });
        if(!isMatch)
        {
            res.status(400).json({message:"invalid credintials"});
        }
        else
        {
            res.json({message:"login successfully"});
            console.log(userLogin);
        }
    }
    else{
        res.status(400).json({message:"invalid credintials"});
    }
    
   

   } catch (error) {
       console.log(error);
       
   }

});

router.get("/about", authenticate ,(req,res)=>{ //using middleware//
    
    res.send(req.rootUser);

});
router.get("/getdata", authenticate , (req,res)=>{
    res.send(req.rootUser);
});

// design message data by coming from frontend

router.post("/contact",authenticate, async(req,res)=>{
try {
    const {name,email,phone,message} = req.body;
    if (!name || !email || !phone || !message) {
        console.log("data not filled properly");
        return res.json({error:"plz filled the contact form"});
    }
    const userContact = await User.findOne({_id:req.userID});
    if(userContact)
    {
        const userMessage = await userContact.addMessage(name,email,phone,message);
        await userContact.save();
        res.status(201).json({message:"user contact created successfully"});
    }
    
} catch (error) {
    console.log(error);
}
});

/// logout function

router.get("/logout" ,(req,res)=>{ //using middleware//
    
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('user logout');

});



module.exports = router;