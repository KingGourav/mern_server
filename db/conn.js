const mongoose = require('mongoose');

const db = process.env.DATABASE;
mongoose.connect(db).then(()=>{
    console.log("connection suceesfull");
}).catch((error)=>{
    console.log(error);
});