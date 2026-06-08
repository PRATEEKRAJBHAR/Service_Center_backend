const User = require('../models/User.js');
const jwt = require("jsonwebtoken");

const bcrypt=require('bcrypt')
require("dotenv").config();

exports.authUsers = async (req, res) => {
  try {
    // text fields
    const { name, email, password, role } = req.body;
    const existingEmail=await User.findOne({email});
    if(existingEmail){
      return res.status(400).json({
        success:false,
        message:"this email already exist in database"
      })
    }

    // file fields
    // const profileImage = req.files?.profileImage?.[0]?.filename;
    // const documents = req.files?.documents?.[0]?.filename;


    // using the bcrypt

    const hashPassword=await bcrypt.hash(password,10);
    const newUser = await User.create({
      name,
      email,
      password:hashPassword,
      role,
      // profileImage,
      // documents,
    });

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: newUser,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "something went wrong",
    });
  }
};





// auth login user



// exports.authUserLogin=async(req,res)=>{
//   try{
//     const {email,password}=req.body;
//     if(!email||!password){
//  return     res.status(400).json({
//         success:false,
//         message:"please fill both fields",
//       })
//     }
//     const user=await User.findOne({email});
//       if(!user){
//    return   res.status(401).json({
//         success:false,
//         message:"first register then login",
//       })
//     }

// // console.log("user:", password);

//     const isMatch=await bcrypt.compare(password,user.password);
//     // console.log("Password Match:", isMatch);

//     if(!isMatch){
//       return res.status(401).json({
//         message:"invalid credinials",
//         success:false
//       })
//     }
//     const payload={
//   name:user.name,
//   role:user.role,
//   email:user.email,
//   id:user._id
// }

// const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"2h"})
// console.log(token,"token");
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax"
//     });


//   return  res.status(200).json({
//       message:"login successfull",
//       success:true,
//       data: payload,
//       token
//     })

//   }catch(err){
//     console.log(err);
//     res.status(400).json({
//       message:"something went wrong",
//       success:false,
//       error:err.message

//     })
//   }
// }


exports.authUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    const payload = {
      name: user.name,
      role: user.role,
      email: user.email,
      id: user._id,
    };
console.log(payload,"my payload");
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: payload,
      token,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// here get all technician which role technique;


exports.getAlltechnician=async(req,res)=>{
  try{
    // const role=req.body;
    const getTech=await User.find({role:"technician"});
    // console.log(getTech,"technicians ");
    return res.status(200).json({
      message:"all technisian data found successfull",
      success:true,
      data:getTech
    })

  }catch(err){
    console.log(err);
    res.status(400).json({
      message:"something went wrong",
      success:false,
      error:err.message

    })
  }
}



// getall register customer;

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' });
// console.log(customers,"get all customers");
    return res.status(200).json({
      message: "All customer data fetched successfully",
      success: true,
      data: customers
    });

  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
};



const crypto = require("crypto");
const sendResetPasswordMail = require("../utils/sendResetPasswordmail.js");
const { error } = require('console');
// const User = require("../models/User");

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset</h2>
      <p>Click below link to reset password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendResetPasswordMail(user.email, "Password Reset", message);

    res.json({
      success: true,
      message: "Reset link sent to email",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Forget password failed",
    });
  }
};

// reset password


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Reset password failed",
    });
  }
};



// get all registers users


exports.getAllRegisterUsers=async(req,res)=>{
  try{
    const allUsers=await User.find({});
    // console.log(allUsers,"all user");
res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: allUsers
    });

  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"something went wrong",
      success:false,
      error:err.message
    })
  }
}




// admin assign role technician or admin (jan user register karega to uska role by default customer hi rahega);


exports.adminAssignRole=async(req,res)=>{
  try{
    const {id}=req.params;
    const {role}=req.body;


    // ✅ 2. Allow only specific roles
    // const allowedRoles = ["admin", "technician"];
    // if (!allowedRoles.includes(role)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid role. Only admin or technician allowed"
    //   });
    // }
    const UpdateROle=await User.findByIdAndUpdate(id,{role},{new:true});
    console.log(UpdateROle,"updaterole");
     if (!UpdateROle) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "user updated role is successfully",
      data: UpdateROle
    });

  }catch(err){
    res.status(500).json({
      message:"something went wrong",
      success:false,
      error:err.message
    })
  }
}