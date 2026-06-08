const mongoose=require('mongoose');
const User=new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    role:{
        // required:true,
        enum: ["admin", "customer", "technician"],
        default:'customer',
        type:String
    },
    // profileImage:{
    //     type:String
    // },
    // documents:{
    //     type:String
    // },
    // forget password logic
    resetPasswordToken: {
  type: String
},
resetPasswordExpire: {
  type: Date
},
})
module.exports=mongoose.model("Users",User)
