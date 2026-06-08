const mongoose=require('mongoose');
require('dotenv').config();
const dbConnect=async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI);
        console.log("database connection successfully");

    }catch(err){
        console.log("something went wrong because database cannot connect",err);
        process.exit(1);
    }
}
module.exports=dbConnect;