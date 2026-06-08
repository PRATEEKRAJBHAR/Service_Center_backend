const express = require('express');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const app = express();
const dbConnect = require('./config/db.js');

dbConnect();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://service-center-frontend.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // its remove because now using the cloudnery

const authUser = require('./routes/authRoutes.js');
const authCustomer=require('./routes/customerRoutes.js')
const Service=require('./routes/serviceRouter.js')
const Parts=require('./routes/PartsRoutes.js')
app.use('/api/auth', authUser);
app.use('/api/auth', authCustomer);
app.use('/api', Service);
app.use('/api',Parts)

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: "Something went wrong",
    success: false,
    error: err.message || "Server Error",
  });
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Port is listening on:", PORT);
});

app.get('/', (req, res) => {
  res.send("Backend is running");
});
