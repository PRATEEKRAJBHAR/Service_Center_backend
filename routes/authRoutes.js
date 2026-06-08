// // simpel middleware
// const express=require('express');
// const router=express.Router();
// const {authUsers}=require('../controllers/authController');
// router.post('/register',authUsers);
// module.exports=router



// img and pdf store in this middleware

const express=require('express');
const router=express.Router();
const upload = require('../middleware/upload');
const {authUsers,authUserLogin,getAlltechnician,getAllCustomers,forgetPassword,resetPassword,getAllRegisterUsers, adminAssignRole}=require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
router.post('/register',upload.fields([
    { name: "profileImage", maxCount: 1 },//img upload(maxcount =1 yaha par only one img jayega )
    { name: "documents", maxCount: 1 },//pdf upload
  ]),authUsers);
router.post('/login',authUserLogin)
router.get('/technicians',getAlltechnician)
router.get('/Allcustomers',getAllCustomers);
router.post("/customers/forget-password", forgetPassword);
router.post("/customers/reset-password/:token", resetPassword);
router.get("/customers/getAllUser", getAllRegisterUsers);
router.put("/customers/assign-role/:id",
   authMiddleware,
    authorizeRoles('admin',),
    adminAssignRole);

module.exports=router