// const express=require('express');
// const router=express.Router();
// const {CreateService,getAllServices,updateService,updateStatus}=require('../controllers/serviceController')
// router.post('/services',CreateService);
// router.get('/services',getAllServices);
// router.put('/services/:id',updateService);
// router.patch('/services/:id',updateStatus)

// module.exports=router



// now here added img and pdf


const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();
const {authMiddleware}=require('../middleware/authMiddleware');
const {authorizeRoles}=require('../middleware/roleMiddleware');
const bulkUpload=require('../middleware/bulkUpload')
const { CreateService, getAllServices, updateService, updateStatus, addServiceLogs, removeServiceLog, addServiceImg, removeServiceImg,
    bulkUpdateStatus, singleGetService, removeServiceReport, addServiceReport, assignTechnician,usePartsOftechnician,generateServicePdf,
    getCustomerFullHistory,downloadServicePDF,getServicesByCustomer ,bulkUploadServices,getTicketsByCustomer } = require('../controllers/serviceController');
router.put('/services/bulk-status', bulkUpdateStatus)//here update many routes create
router.post('/services',
    authMiddleware,
    authorizeRoles('admin'),
    upload.fields([
    { name: "images", maxCount: 100 },
    { name: "reports", maxCount: 100 }
]), CreateService);
router.get('/services',
 authMiddleware,
authorizeRoles('admin','technician'),
    getAllServices);
router.put('/services/:id',
authMiddleware,
authorizeRoles('admin'),
    upload.fields([
    { name: "images", maxCount: 100 },
    { name: "reports", maxCount: 100 }
]), updateService);
router.patch('/services/:id',
     authMiddleware,
    authorizeRoles('admin','technician'),
    updateStatus)
router.put('/services/add-log/:id',
    authMiddleware,
    authorizeRoles('technician'),
    addServiceLogs)
router.put('/services/remove-log/:id/:logId',
     authMiddleware,
    authorizeRoles('technician'),
    removeServiceLog)
router.put('/services/add-img/:id',
     authMiddleware,
    authorizeRoles('technician'),
    upload.single("file"), addServiceImg)
router.put('/services/remove-img/:id/:imgId',
     authMiddleware,
    authorizeRoles('technician'), removeServiceImg)
router.put("/services/add-report/:id",
    authMiddleware,
    authorizeRoles('technician'),
    upload.single("file"), addServiceReport);
router.put("/services/remove-report/:id/:reportId",
     authMiddleware,
    authorizeRoles('technician'),
     removeServiceReport);
router.get('/services/:id',
    //  authMiddleware,
    // authorizeRoles('admin'||'technician'),
    singleGetService);
router.put('/services/:id/assign',
 authMiddleware,
    authorizeRoles('admin'),
    assignTechnician);
router.put('/services/:id/technician/:techId/parts',
    authMiddleware,
    authorizeRoles('technician'),
    usePartsOftechnician);
router.get("/services/pdf/:id",
authMiddleware,
    authorizeRoles('admin'),
    generateServicePdf);
    router.get("/services/customer-history/:userId", getCustomerFullHistory);
    router.get("/services/download-pdf/:id",downloadServicePDF);
    // router.get("/services/customer/:customerId",getServicesByCustomer);
    router.get("/services/customer/:customerId/:ticketId",getServicesByCustomer);
    // bulkupload
    router.post("/services/bulk-upload", bulkUpload.single("file"), bulkUploadServices);
    router.get("/services/ticket-by-customer/:customerId", getTicketsByCustomer );

module.exports = router









// middle ware attach




// const express = require('express');
// const upload = require('../middleware/upload');
// const router = express.Router();
// // middleware
// const {authMiddleware}=require('../middleware/authMiddleware');
// const {authorizeRoles}=require('../middleware/roleMiddleware');
// const { CreateService, getAllServices, updateService, updateStatus, addServiceLogs, removeServiceLog, addServiceImg, removeServiceImg,
//     bulkUpdateStatus, singleGetService, removeServiceReport, addServiceReport, assignTechnician,
//     // usePartsOftechnician
// } = require('../controllers/serviceController')

// router.put('/services/bulk-status',
//       authMiddleware,
//   authorizeRoles("admin"),
//     bulkUpdateStatus)//here update many routes create
// router.post('/services',
// authMiddleware,
//   authorizeRoles("customer"),
//     upload.fields([
//     { name: "images", maxCount: 10 },
//     { name: "reports", maxCount: 10 }
// ]), CreateService);
// router.get('/services',
//     authMiddleware,
//   authorizeRoles("admin"),
//     getAllServices);
// router.put('/services/:id',

//     upload.fields([
//     { name: "images", maxCount: 10 },
//     { name: "reports", maxCount: 10 }
// ]), updateService);
// router.patch('/services/:id',
//       authMiddleware,
//   authorizeRoles("admin", "technician"),
//     updateStatus)
// router.put('/services/add-log/:id',
//       authMiddleware,
//   authorizeRoles("technician"),
//     addServiceLogs)
// router.put('/services/remove-log/:id/:logId', removeServiceLog)
// router.put('/services/add-img/:id',
//     upload.single("file"), addServiceImg)
// router.put('/services/remove-img/:id/:imgId', removeServiceImg)
// router.put("/services/add-report/:id",
//     upload.single("file"), addServiceReport);
// router.put("/services/remove-report/:id/:reportId", removeServiceReport);
// router.get('/services/:id',
//     authMiddleware,
//   authorizeRoles("admin", "technician", "customer"),
//     singleGetService);
// router.put('/services/:id/assign',
//       authMiddleware,
//   authorizeRoles("admin"),
//     assignTechnician);
// // router.put('/services/:id/parts', usePartsOftechnician);


// module.exports = router





