const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
  try {


const token =
  req.headers.authorization?.split(" ")[1]
  // ||
  // req.cookies?.token;
// console.log("HEADER:", req.headers.authorization);
// console.log("TOKEN:", token);
// console.log("SECRET:", process.env.SECRET_KEY);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // console.log("DECODED:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }
};