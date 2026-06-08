const express=require('express');
const router=express.Router();
const {authMiddleware}=require('../middleware/authMiddleware');
const {authorizeRoles}=require('../middleware/roleMiddleware');
const { AddingParts,ListingParts,updateParts,deleteParts}=require('../controllers/partsController');

router.post('/parts',
     authMiddleware,
    authorizeRoles('admin'),
    AddingParts);
    router.get('/parts',
     authMiddleware,
    authorizeRoles('admin','technician'),
    ListingParts);
router.put('/parts/:id',
     authMiddleware,
    authorizeRoles('admin'),
    updateParts);
router.delete('/parts/:id',
     authMiddleware,
    authorizeRoles('admin'),
    deleteParts);

module.exports=router



// middleware attach


// const express=require('express');
// const router=express.Router();
// const {authMiddleware}=require('../middleware/authMiddleware');
// const {authorizeRoles}=require('../middleware/roleMiddleware');
// const { AddingParts,ListingParts,updateParts,deleteParts}=require('../controllers/partsController');
// router.post('/parts',
//     authMiddleware,
//   authorizeRoles("admin"),
//     AddingParts);
// router.get('/parts',
//     authMiddleware,
//   authorizeRoles("admin","technician"),
//     ListingParts);
// router.put('/parts/:id',
//     authMiddleware,
//   authorizeRoles("admin"),
//     updateParts);
// router.delete('/parts/:id',
//     authMiddleware,
//   authorizeRoles("admin"),
//     deleteParts);

// module.exports=router