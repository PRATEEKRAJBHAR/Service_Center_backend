const customer = require('../models/Customer');
const Service = require('../models/Service');
const { options } = require('../routes/serviceRouter');
const mongoose = require("mongoose");
exports.Customer = async (req, res) => {
  try {

    const { name, phone, address, deviceName, devicePrice ,problemDescription} = req.body;

    // const purchaseBill = req.files?.purchaseBill?.[0]?.filename;
    // const deviceImage = req.files?.deviceImage?.[0]?.filename;
const purchaseBill = req.files?.purchaseBill?.[0]?.path;
const deviceImage = req.files?.deviceImage?.[0]?.path;
// console.log(req.files,"sdfjsdoi jjnfsd");
    const response = await customer.create({
      name,
      phone,
      address,
      deviceName,
      devicePrice,
      purchaseBill,
      deviceImage,
      problemDescription,
      userId:req.user.id
    },
);

    return res.status(200).json({
      message: "customer details created successfully",
      data: response,
      success: true
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "something went wrong",
      error: err.message,
      success: false
    });
  }
};


// here get api operation
// ye bhi kaam kar raha h without aggrestion

// exports.getCutomer = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const role = req.user.role;
//     const {
//       search,
//       isActive,
//       minPrice,
//       maxPrice,
//       startDate,
//       endDate,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       page,
//       limit,
//     } = req.query;

//     let query = {}; // ✅ let use karo
//     // console.log(query,"quieryknskf k ksjdfkls");
//  // ✅ ROLE BASED FILTER
//     if (role === "customer") {
//       query.userId = userId; // only own data
//     }
//     if (search) {
//       query.$or = [

//           // { name: { $regex: search, $options: "i" } },
//           { "userId.name": { $regex: search, $options: "i" } },
//           { address: { $regex: search, $options: "i" } },
//           { deviceName: { $regex: search, $options: "i" } },
//           { phone: { $regex: search, $options: "i" } },
//           { problemDescription: { $regex: search, $options: "i" } },


//       ];

//       // Agar numeric hai
//       if (!isNaN(search)) {
//         query.$or.push({ devicePrice: {$gte:Number(search) }});
//       }


//     }

//     // status update active or inactive
//     if (isActive !== undefined) {
//       query.isActive = isActive === "true";
//     }


//     // range b/w price
//     if (minPrice || maxPrice) {
//       query.devicePrice = {};
//       if (minPrice) query.devicePrice.$gte = Number(minPrice);
//       if (maxPrice) query.devicePrice.$lte = Number(maxPrice);
//     }
//     // date ke update filter
//     // Date filter

//     if (startDate || endDate) {
//       query.createdAt = {};

//       if (startDate) {
//         query.createdAt.$gte = new Date(startDate);
//       }

//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         query.createdAt.$lte = end;
//       }
//     }


//     // sorting

//     const sortOption = {
//       [sortBy]: sortOrder === "asc" ? 1 : -1,
//     };

//     // pagination
//     const pageNumber = Number(page) || 1;
//     const limitNumber = Number(limit) || 10;
//     const skip = (pageNumber - 1) * limitNumber;

//     // total count for frontend pagination
//     // const totalRecords = await customer.countDocuments(query);
//     // const response = await customer.find(query).sort(sortOption).skip(skip).limit(limitNumber).populate('userId');
//     const totalData = await customer.aggregate([
//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "_id",
//       as: "userId",
//     },
//   },
//   { $unwind: "$userId" },

//   {
//     $match: {
//       ...(role === "customer" && { userId: userId }),

//       ...(isActive !== undefined && { isActive: isActive === "true" }),

//       ...(minPrice || maxPrice
//         ? {
//             devicePrice: {
//               ...(minPrice && { $gte: Number(minPrice) }),
//               ...(maxPrice && { $lte: Number(maxPrice) }),
//             },
//           }
//         : {}),

//       ...(startDate || endDate
//         ? {
//             createdAt: {
//               ...(startDate && { $gte: new Date(startDate) }),
//               ...(endDate && {
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
//               }),
//             },
//           }
//         : {}),

//       ...(search && {
//         $or: [
//           { address: { $regex: search, $options: "i" } },
//           { deviceName: { $regex: search, $options: "i" } },
//           { phone: { $regex: search, $options: "i" } },
//           { problemDescription: { $regex: search, $options: "i" } },
//           { "userId.name": { $regex: search, $options: "i" } },
//           { "userId.email": { $regex: search, $options: "i" } },
//         ],
//       }),
//     },
//   },

//   { $count: "total" },
// ]);

// const totalRecords = totalData[0]?.total || 0;
//     const response = await customer.aggregate([
//   // 🔗 join user collection
//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "_id",
//       as: "userId",
//     },
//   },
//   { $unwind: "$userId" },

//   // 🔍 MATCH (your filters)
//   {
//     $match: {
//       ...query,

//       ...(search && {
//         $or: [
//           { address: { $regex: search, $options: "i" } },
//           { deviceName: { $regex: search, $options: "i" } },
//           { phone: { $regex: search, $options: "i" } },
//           { problemDescription: { $regex: search, $options: "i" } },

//           // ✅ NEW (user fields)
//           { "userId.name": { $regex: search, $options: "i" } },
//           { "userId.email": { $regex: search, $options: "i" } },
//         ],
//       }),
//     },
//   },

//   // 📊 sorting
//   { $sort: sortOption },

//   // 📄 pagination
//   { $skip: skip },
//   { $limit: limitNumber },
// ]);
// console.log(response,"jshkfj sfsd");
//     return res.status(200).json({
//       message: "customer details find successfully",
//       data: response,
//       success: true,
//       pagination: {
//         totalRecords,
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalRecords / limitNumber),
//         pageSize: limitNumber,
//       }
//     });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "something went wrong",
//       error: err.message,
//       success: false,
//     });
//   }
// };

// ye bhi kaam kar rha hai (aggretion )



exports.getCutomer = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const {
      search,
      isActive,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // ✅ pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // ✅ sorting


    const sortOption = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    // ✅ MATCH FILTER (COMMON)
const matchStage = {
  ...(role === "customer" && {
    // userId: new mongoose.Types.ObjectId(userId)
    "userId._id": new mongoose.Types.ObjectId(userId)
  }),

  ...(isActive !== undefined && { isActive: isActive === "true" }),

  ...(minPrice || maxPrice
    ? {
        devicePrice: {
          ...(minPrice && { $gte: Number(minPrice) }),
          ...(maxPrice && { $lte: Number(maxPrice) }),
        },
      }
    : {}),

  ...(startDate || endDate
    ? {
        createdAt: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && {
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
          }),
        },
      }
    : {}),
};
    // ✅ SEARCH FILTER
    const searchStage = search
      ? {
          $or: [
            { address: { $regex: search, $options: "i" } },
            { deviceName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { problemDescription: { $regex: search, $options: "i" } },

            // 🔥 user fields
            { "userId.name": { $regex: search, $options: "i" } },
            // { "userId.email": { $regex: search, $options: "i" } },

            // 🔥 numeric search
            ...(!isNaN(search)
              ? [{ devicePrice: { $gte: Number(search) } }]
              : []),
          ],
        }
      : {};

    // ====================================================
    // ✅ MAIN DATA QUERY
    // ====================================================
    const data = await customer.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },

      {
        $match: {
          ...matchStage,
          ...searchStage,
        },
      },

      { $sort: sortOption },
      { $skip: skip },
      { $limit: limitNumber },
    ]);

    // ====================================================
    // ✅ TOTAL COUNT QUERY (IMPORTANT)
    // ====================================================
    const totalData = await customer.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },

      {
        $match: {
          ...matchStage,
          ...searchStage,
        },
      },

      { $count: "total" },
    ]);

    const totalRecords = totalData[0]?.total || 0;
// console.log(totalRecords,"tpal recpdrd");
    // ====================================================
    // ✅ RESPONSE
    // ====================================================
    return res.status(200).json({
      message: "Customer details fetched successfully",
      success: true,
      data,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
        pageSize: limitNumber,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};


// here edit operation perform without img and pdg


// exports.EditCutomer=async(req,res)=>{
//     try{
// const id = req.params.id.trim();
//         const updatedCustomer=await customer.findByIdAndUpdate(id,req.body,{new:true});
//         if (!updatedCustomer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//         return res.status(200).json({
//             message:'edited successfully',
//             data:updatedCustomer,
//             success:true
//         })

//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             message:"something went wrong",
//             success:false,
//             error:error.message
//         })
//     }
// }



// here edit operation perform with img and pdg

exports.EditCutomer = async (req, res) => {
  try {

    const id = req.params.id.trim();

    const updateData = { ...req.body };

    // ✅ if new pdf uploaded
    if (req.files?.purchaseBill?.[0]) {
      updateData.purchaseBill = req.files.purchaseBill[0].filename;
    }

    // ✅ if new image uploaded
    if (req.files?.deviceImage?.[0]) {
      updateData.deviceImage = req.files.deviceImage[0].filename;
    }

    const updatedCustomer = await customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({
      message: "edited successfully",
      data: updatedCustomer,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
      success: false,
      error: error.message
    });
  }
};




// here status update

exports.toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedCustomer = await customer.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// customer history

// searching api for customer



// exports.searchingCustomerDetails = async (req, res) => {
//   try {
//     const { search } = req.query;

//     if (!search) {
//       return res.status(400).json({
//         success: false,
//         message: "Search value is required",
//       });
//     }

//     let searchVal = {
//       $or: [
//         { name: { $regex: search, $options: "i" } },
//         { address: { $regex: search, $options: "i" } },
//         { deviceName: { $regex: search, $options: "i" } },
//       ],
//     };

//     // If search is number → also search in phone
//     if (!isNaN(search)) {
//       searchVal.$or.push({ phone: search });
//     }
//    if (!isNaN(search)) {
//       searchVal.$or.push({ devicePrice: search });
//     }

//     const val = await customer.find(searchVal);

//     return res.status(200).json({
//       message: "Searching data successfully",
//       success: true,
//       data: val,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };




// // here filter api



// exports.customerFilter=async(req,res)=>{
//     try{
//         const {devicePrice}=req.query;
//         const filter={}
//         if(devicePrice){
//             filter.devicePrice={$gte:Number(devicePrice)}
//         }

//         const val=await customer.find(filter);
//         // console.log(val,"this is my value");
//         return res.status(200).json({
//             message:"filter data successfully",
//             success:true,
//             data:val
//         })

//     }catch(err){
//         console.error(err);
//         return res.status(500).json({
//             message:"something went wrong",
//             success:false,
//             error:err
//         })
//     }
// }



// // sorting api




// exports.customerSort = async (req, res) => {
//   try {
//     const { sortBy, order } = req.query;

//     // default sorting
//     let sortObj = { createdAt: -1 };

//     if (sortBy) {
//       sortObj = {
//         [sortBy]: order === "asc" ? 1 : -1
//       };
//     }

//     const customers = await customer.find({ isActive: true }).sort(sortObj);

//     return res.status(200).json({
//       success: true,
//       message: "Customers sorted successfully",
//       data: customers
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error
//     });
//   }
// };




// // here pagination



// exports.getCustomersWithPagination = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;   // current page
//     const limit = parseInt(req.query.limit) || 10; // records per page

//     const skip = (page - 1) * limit;

//     const total = await customer.countDocuments({ isActive: true });

//     const customers = await customer.find({ isActive: true })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     return res.status(200).json({
//       success: true,
//       data: customers,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };




// // its my all combunation like seaching ,sorting, filtering and pagination




// exports.getCustomers = async (req, res) => {
//   try {
//     const page  = parseInt(req.query.page)  || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     const {
//       search,
//       devicePrice,
//       sortBy,
//       order
//     } = req.query;

//     const skip = (page - 1) * limit;

//     let query = { isActive: true };

//     // 🔍 searching
//     if (search) {
//       const orArr = [
//         { name: { $regex: search, $options: "i" } },
//         { address: { $regex: search, $options: "i" } },
//         { deviceName: { $regex: search, $options: "i" } },
//       ];

//       if (!isNaN(search)) {
//         orArr.push({ phone: search });
//         orArr.push({ devicePrice: Number(search) });
//       }

//       query.$or = orArr;
//     }

//     // 🎯 filtering
//     if (devicePrice) {
//       query.devicePrice = { $gte: Number(devicePrice) };
//     }

//     // 🔃 sorting
//     let sortQuery = { createdAt: -1 };

//     if (sortBy) {
//       sortQuery = {
//         [sortBy]: order === "asc" ? 1 : -1,
//       };
//     }

//     const total = await customer.countDocuments(query);

//     const customers = await customer
//       .find(query)
//       .sort(sortQuery)
//       .skip(skip)
//       .limit(limit);

//     return res.status(200).json({
//       success: true,
//       data: customers,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };
