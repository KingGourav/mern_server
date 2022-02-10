const jwt = require("jsonwebtoken");
const User = require("../db/model/userSchema");

const authenticate = async(req,res,next) => {
    try {
       const token = req.cookies.jwtoken;
    //    console.log(token);
        const verifyToken =  jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyToken);
        const rootUser = await User.findOne({_id:verifyToken,"tokens.token":token});
        console.log(rootUser);
        if(!rootUser){throw new Error('user not found')}
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    } catch (error) {
        res.status(401).send("unauthorized");
        console.log(error);
    }

}
module.exports = authenticate;