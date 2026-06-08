
const express=require('express');
const { Customer,getCutomer,EditCutomer ,toggleCustomerStatus,
    // searchingCustomerDetails,customerFilter,customerSort,getCustomersWithPagination,getCustomers
} = require('../controllers/customerController');
const upload = require('../middleware/upload');
const {authMiddleware}=require('../middleware/authMiddleware');
const {authorizeRoles}=require('../middleware/roleMiddleware');
const router=express.Router();
router.post(
  '/customers',
  authMiddleware,//meddle ware ko import kiya
  authorizeRoles('customer'),//only customer hi create kar payega
  upload.fields([
    { name: "deviceImage", maxCount: 1 },
    { name: "purchaseBill", maxCount: 1 }
  ]),
  Customer
);
router.get('/customers',
  authMiddleware,
  authorizeRoles('admin','customer'),
  getCutomer);

router.put('/customers/:id',
    authMiddleware,
    authorizeRoles('admin','customer'),
    upload.fields([
 { name: "deviceImage", maxCount: 1 },


    { name: "purchaseBill", maxCount: 1 }
    ]),
    EditCutomer)

router.patch('/customers/status/:id',
authMiddleware,
authorizeRoles('admin'),
  toggleCustomerStatus)

// router.get('/customers/searching',searchingCustomerDetails);
// router.get('/customers/filter',customerFilter);
// router.get('/customers/sort',customerSort);
// router.get('/customers/pagination',getCustomersWithPagination);
// router.get('/customers/details',getCustomers);

module.exports=router




// here middleware access




// const express=require('express');
// // middleware
// const {authMiddleware}=require('../middleware/authMiddleware');
// const {authorizeRoles}=require('../middleware/roleMiddleware');
// const { Customer,getCutomer,EditCutomer ,toggleCustomerStatus} = require('../controllers/customerController');
// const upload = require('../middleware/upload');
// const router=express.Router();
// router.post('/customers',
//     authMiddleware,
//     authorizeRoles('admin'),
//     upload.fields([
//    { name: "deviceImage", maxCount: 1 },
//     { name: "purchaseBill", maxCount: 1 }
// ]),Customer);

// router.get('/customers',
//     authMiddleware,
// authorizeRoles('admin'),
//     getCutomer);

// router.put('/customers/:id',
//     authMiddleware,
//   authorizeRoles("admin"),
//     upload.fields([
//  { name: "deviceImage", maxCount: 1 },
//     { name: "purchaseBill", maxCount: 1 }
//     ]),
//     EditCutomer)

// router.patch('/customers/status/:id',
// authMiddleware,
//   authorizeRoles("admin"),
//     toggleCustomerStatus)

// module.exports=router