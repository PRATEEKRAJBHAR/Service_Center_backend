// const Service = require('../models/Service');
// exports.CreateService = async (req, res) => {
//     try {
//         const response = await Service.create(req.body);
//         console.log(response, "service response");
//         return res.status(200).json({
//             message: "Service Added successfully",
//             success: true,
//             data: response
//         })

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             message: "something went wrong",
//             success: false,
//             error: err.error
//         })
//     }
// }


// now here img and pdf added login


// here get service data

// exports.getAllServices = async (req, res) => {
//     try {
//         const AllService = await Service.find().populate('customerId')
//         return res.status(200).json({
//             message: "Get All Services successfully",
//             success: true,
//             data: AllService
//         })

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             message: "something went wrong",
//             success: false,
//             error: err.error
//         })
//     }
// }



// here update operation

// exports.updateService = async (req, res) => {
//     try {
//         const { id } = req.params;
//         // console.log(id,"my id");

//         const updateData = await Service.findByIdAndUpdate(
//             id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         // console.log(updateData,"update data");
//         if (!updateData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Service not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Updated service data successfully",
//             success: true,
//             data: updateData
//         });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             message: "Something went wrong",
//             success: false,
//             error: err.message
//         });
//     }
// };



// status update api


// exports.updateStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body
//             const allowedStatus = ["Pending", "In Progress", "Completed"];

//         if (!allowedStatus.includes(status)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid status value",
//             });
//         }
//         const updatedServices = await Service.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate("customerId");
//         if (!updatedServices) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Customer not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Status updated successfully",
//             data: updatedServices,
//         });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             message: "Something went wrong",
//             success: false,
//             error: err.message
//         });
//     }
// }






const Service = require('../models/Service');
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudnery");
const Part = require('../models/Parts');
const Customer = require('../models/Customer');
// now here img and pdf added login
// exports.CreateService = async (req, res) => {
//   try {
//     let { customerId, problemDescription, serviceCharge, status } = req.body;

//     serviceCharge = Number(serviceCharge) || 0;

//     // 🔥 USER se uska ticket nikaalo
//     const ticket = await Customer.findOne({
//       userId: customerId
//     }).sort({ createdAt: -1 });

//     if (!ticket) {
//       return res.status(404).json({
//         message: "No ticket found for this user",
//         success: false
//       });
//     }

//     const images =
//       req.files?.images?.map((file) => ({
//         url: file.filename,
//       })) || [];

//     const reports =
//       req.files?.reports?.map((file) => ({
//         url: file.filename,
//       })) || [];

//     const response = await Service.create({
//       customerId,          // user id
//       ticketId: ticket._id, // ✅ AUTO SET
//       problemDescription,
//       serviceCharge,
//       status,
//       images,
//       reports,
//     });

//     return res.status(200).json({
//       message: "Service Added successfully",
//       success: true,
//       data: response,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       message: "Something went wrong",
//       success: false,
//       error: err.message,
//     });
//   }
// };


exports.CreateService = async (req, res) => {
  try {
    let { customerId, ticketId, problemDescription, serviceCharge, status } = req.body;

    serviceCharge = Number(serviceCharge) || 0;

    // ✅ check ticket exists
    const ticket = await Customer.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Invalid ticket selected",
        success: false
      });
    }
if (ticket.userId.toString() !== customerId) {
  return res.status(400).json({
    message: "This ticket does not belong to the selected customer",
    success: false
  });
}
    // const images =
    //   req.files?.images?.map((file) => ({
    //     url: file.filename,
    //   })) || [];

    // const reports =
    //   req.files?.reports?.map((file) => ({
    //     url: file.filename,
    //   })) || [];

    const response = await Service.create({
      customerId,
      ticketId, // ✅ directly use selected ticket
      problemDescription,
      serviceCharge,
      status,
      // images,
      // reports,
    });

    return res.status(200).json({
      message: "Service Added successfully",
      success: true,
      data: response,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message,
    });
  }
};

// here get service data

exports.getAllServices = async (req, res) => {
  try {
//     const userId = req.user.id;
//     const role = req.user.role;
// // 🔹 RBAC filter
//     if (role === "technician") {
//       matchStage.technicianId = new mongoose.Types.ObjectId(userId);
//     }

    const { search,
status,
startDate,
endDate,
technician,
sortBy='createdAt',
sortOrder='desc',
limit,
page,
    } = req.query;
const userId = req.user.id;
const role = req.user.role;
console.log("USER:", userId);
    let matchStage = {};
    let andConditions = [];
if (role === "customer") {
  andConditions.push({
    $or: [
      { customerId: new mongoose.Types.ObjectId(userId) },
      { customerId: { $exists: false } }
    ]
  });
}

if (role === "technician") {
  andConditions.push({
    technicianId: new mongoose.Types.ObjectId(userId)
  });
}
// if (search) {
//   andConditions.push({
//     $or: [
//       { "customer.name": { $regex: search, $options: "i" } },
//       { "customer.address": { $regex: search, $options: "i" } },
//       { "customer.deviceName": { $regex: search, $options: "i" } },
//       { "customer.phone": { $regex: search, $options: "i" } },
//       { problemDescription: { $regex: search, $options: "i" } },
//       { status: { $regex: search, $options: "i" } },
//       { "technician.name": { $regex: search, $options: "i" } },
//     ]
//   });
// }

if (search) {
  andConditions.push({
    $or: [
      // USER
      { "user.name": { $regex: search, $options: "i" } },

      // TICKET
      { "ticket.address": { $regex: search, $options: "i" } },
      { "ticket.deviceName": { $regex: search, $options: "i" } },
      { "ticket.phone": { $regex: search, $options: "i" } },

      // 🔥 IMPORTANT FIX (both cases)
      { "ticket.problemDescription": { $regex: search, $options: "i" } },
      // { problemDescription: { $regex: search, $options: "i" } },

      // STATUS
      { status: { $regex: search, $options: "i" } },

      // TECHNICIAN
      { "technician.name": { $regex: search, $options: "i" } },
    ]
  });
}

// FINAL MATCH
if (andConditions.length > 0) {
  matchStage.$and = andConditions;
}
// filter apply
// ✅ Status Filter(completed ,pending,In Progress)
    // ✅ Status Filter (default Pending)
if (status) {
  matchStage.status = status;
}

//date filter
if(endDate||startDate){
  matchStage.createdAt={};
  if(startDate){
    matchStage.createdAt.$gte=new Date(startDate);
  };
  if(endDate){
    matchStage.createdAt.$lte=new Date(endDate);
  }

}

// technicain filter

if(technician){
  matchStage.technicianId={};
  if(technician){
  matchStage.technicianId = new mongoose.Types.ObjectId(technician);
  }
}

// sorting apply

const sortOption={
  [sortBy]:sortOrder==='asc'?1:-1,
}


// pagination

const PageNumber=Number(page)||1;
const PageLimit=Number(limit)||20;
const skip=(PageNumber-1)*PageLimit;
// const service = await Service.aggregate([

//   // ✅ JOIN USER (customer)
//   {
//     $lookup: {
//       from: "users",
//       localField: "customerId",
//       foreignField: "_id",
//       as: "user"
//     }
//   },
//   {
//     $addFields: {
//       user: { $arrayElemAt: ["$user", 0] }
//     }
//   },

//   // ✅ JOIN TICKET (Customer collection)
//   {
//     $lookup: {
//       from: "customers",   // ⚠️ lowercase plural
//       localField: "ticketId",
//       foreignField: "_id",
//       as: "ticket"
//     }
//   },
//   {
//     $addFields: {
//       ticket: { $arrayElemAt: ["$ticket", 0] }
//     }
//   },

//   // ✅ TECHNICIAN
//   {
//     $lookup: {
//       from: "users",
//       localField: "technicianId",
//       foreignField: "_id",
//       as: "technician"
//     }
//   },
//   {
//     $addFields: {
//       technician: { $arrayElemAt: ["$technician", 0] }
//     }
//   },

//   { $match: matchStage },
//   { $sort: sortOption },
//   { $skip: skip },
//   { $limit: PageLimit }

// ]);
// console.log(" listing all services: listing all services:listing all services:", service);


const service = await Service.aggregate([

  // JOINS
  {
    $lookup: {
      from: "users",
      localField: "customerId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },

  {
    $lookup: {
      from: "customers",
      localField: "ticketId",
      foreignField: "_id",
      as: "ticket"
    }
  },
  { $addFields: { ticket: { $arrayElemAt: ["$ticket", 0] } } },

  {
    $lookup: {
      from: "users",
      localField: "technicianId",
      foreignField: "_id",
      as: "technician"
    }
  },
  { $addFields: { technician: { $arrayElemAt: ["$technician", 0] } } },

  { $match: matchStage },

  {
    $facet: {
      data: [
        { $sort: sortOption },
        { $skip: skip },
        { $limit: PageLimit }
      ],
      totalCount: [
        { $count: "count" }
      ]
    }
  }
]);

const services = service[0].data;
const totalCount = service[0].totalCount[0]?.count || 0;
// console.log("MATCH:", matchStage);
  //   return res.status(200).json({
  //     message: "Get All Services successfully",
  //     success: true,
  //     page: PageNumber,
  // limit: PageLimit,
  // // count: service.length,
  // totalCount,
  // data: services
  //   });
return res.status(200).json({
  message: "Get All Services successfully",
  success: true,
  pagination: {
    page: PageNumber,
    limit: PageLimit,
    total: totalCount,
    totalPages: Math.ceil(totalCount / PageLimit)
  },
  data: services
});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "something went wrong",
      success: false,
      error: err.message
    });
  }
};



// here update operation

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const updateValue = { ...req.body };

    // coerce serviceCharge if provided so it doesn't stay a string
    if (updateValue.serviceCharge !== undefined) {
      updateValue.serviceCharge = Number(updateValue.serviceCharge) || 0;
    }

    // if (req.files?.images?.length > 0) {
    //   updateValue.images = req.files.images.map((file) => ({
    //     url: file.filename,
    //   }));
    // }

    // if (req.files?.reports?.length > 0) {
    //   updateValue.reports = req.files.reports.map((file) => ({
    //     url: file.filename,
    //   }));
    // }

    let updateData = await Service.findByIdAndUpdate(
      id,
      updateValue,
      { new: true, runValidators: true }
    );

    if (!updateData) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // recalc totals in case serviceCharge or parts changed
    updateData.partsTotal = updateData.parts.reduce((acc, item) => acc + (item.total || 0), 0);
    updateData.serviceCharge = Number(updateData.serviceCharge) || 0;
    updateData.grandTotal = updateData.partsTotal + updateData.serviceCharge;
    await updateData.save();

    return res.status(200).json({
      message: "Updated service data successfully",
      success: true,
      data: updateData,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message,
    });
  }
};




// status update api


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body
    const allowedStatus = ["Pending", "In Progress", "Completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }
    const updatedServices = await Service.findByIdAndUpdate(id, { status },
      { new: true, runValidators: true })
      .populate("customerId")
      .populate('technicianId')
      .populate('ticketId')
// .populate('partsId');
.populate('parts.partId');

    if (!updatedServices) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedServices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
}



// here adding service log


exports.addServiceLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        $push: {
          serviceLogs: { message }
        }
      },
      { new: true }
    )

    if (!updatedService) {
      return res.status(400).json({
        success: false,
        message: "Invalid message",
      });
    }
    res.status(200).json({
      success: true,
      message: "Added service logs successfully",
      data: updatedService,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
}




//  remove service log


exports.removeServiceLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { logId } = req.params;
    const removeServicelog = await Service.findByIdAndUpdate(
      id,
      {
        $pull: {
          serviceLogs: { _id: logId }
        }
      },
      { new: true }
    )
    res.status(200).json({
      success: true,
      message: "remove service logs successfully",
      data: removeServicelog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
}




// now adding service img
// here only url adding img
// exports.addServiceImg=async(req,res)=>{
//   try{
//     const {id}=req.params;
//     const {url}=req.body;
//     const AddedImg=await Service.findByIdAndUpdate(
//       id,
//       {$push:{
//         images:{url}
//       }},
//       {new:true}
//     )

// res.status(200).json({
//             success: true,
//             message: "added images successfully",
//             data: AddedImg,
//         });
//   }catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             message: "Something went wrong",
//             success: false,
//             error: err.message
//         });
//     }
// }

// here real add data
// here added img in cloud

exports.addServiceImg = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const AddedImg = await Service.findByIdAndUpdate(
      id,
      {
        $push: {
          images: {
            url: req.file.filename,
            public_id: req.file.filename//this is added for cloud
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image added successfully",
      data: AddedImg,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





// here remove img
// remove only db but folder not delete

// exports.removeServiceImg=async(req,res)=>{
//   try{
//     const {id,imgId}=req.params;
//     const removeImg=await Service.findByIdAndUpdate(
//       id,
//       {$pull:{
//         images:{_id:imgId}
//       }}
//     )

//     res.status(200).json({
//             success: true,
//             message: "remove img  successfully",
//             data: removeImg,
//         });

//   }catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             message: "Something went wrong",
//             success: false,
//             error: err.message
//         });
//     }
// }


// here delete db and folder both




// exports.removeServiceImg = async (req, res) => {
//   try {
//     const { id, imgId } = req.params;

//     const service = await Service.findById(id);

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     const image = service.images.id(imgId);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found",
//       });
//     }

//     // Delete file from uploads folder
//     const filePath = path.join(
//       __dirname,
//       "..",
//       "uploads",
//       image.url
//     );

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // Remove from array
//     service.images.pull(imgId);

//     // 🔥 Disable validation here
//     await service.save({ validateBeforeSave: false });

//     res.status(200).json({
//       success: true,
//       message: "Image removed successfully",
//       data: service,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// here remove img for cloud



exports.removeServiceImg = async (req, res) => {
  try {
    const { id, imgId } = req.params;

    const service = await Service.findById(id);
    const image = service.images.id(imgId);

    await cloudinary.uploader.destroy(image.public_id);

    service.images.pull(imgId);
    await service.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "remove img successfull",
      data: service
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// here add service reports

// its only static
// exports.addServiceReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { url } = req.body;

//     const updated = await Service.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           reports: { url }
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Report added successfully",
//       data: updated,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: err.message
//     });
//   }
// };

// here actual pdf add

exports.addServiceReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 🔥 Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "service_center_uploads",
      resource_type: "auto",
    });
// console.log(result,"my pdf result");
    const updated = await Service.findByIdAndUpdate(
      id,
      {
        $push: {
          reports: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Report added successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// here remove report
// delete only db

// exports.removeServiceReport = async (req, res) => {
//   try {
//     const { id, reportId } = req.params;

//     const updated = await Service.findByIdAndUpdate(
//       id,
//       {
//         $pull: {
//           reports: { _id: reportId }
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Report removed successfully",
//       data: updated,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: err.message
//     });
//   }
// };


// delete both folder and data


// exports.removeServiceReport = async (req, res) => {
//   try {
//     const { id, reportId } = req.params;

//     // 1️⃣ Find service
//     const service = await Service.findById(id);

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     // 2️⃣ Find report inside array
//     const report = service.reports.id(reportId);

//     if (!report) {
//       return res.status(404).json({
//         success: false,
//         message: "Report not found",
//       });
//     }

//     // 3️⃣ Delete file from uploads folder
//     const filePath = path.join(
//       __dirname,
//       "..",
//       "uploads",
//       report.url
//     );

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // 4️⃣ Remove from DB array
//     service.reports.pull(reportId);
//     // await service.save();
//     await service.save({ validateBeforeSave: false });

//     // 5️⃣ Send response
//     res.status(200).json({
//       success: true,
//       message: "Report removed successfully",
//       data: service,
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: err.message,
//     });
//   }
// };


// here remove cloudnery


exports.removeServiceReport = async (req, res) => {
  try {
    const { id, reportId } = req.params;

    const service = await Service.findById(id);
    const report = service.reports.id(reportId);

    await cloudinary.uploader.destroy(report.public_id);

    service.reports.pull(reportId);
    await service.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "remove report successfull",
      data: service
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// here status update like pending  to progress to completed etc..

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { oldStatus, newStatus } = req.body;

    if (!oldStatus || !newStatus) {
      return res.status(400).json({
        success: false,
        message: "Both oldStatus and newStatus are required"
      });
    }

    const UpdateProgressStatus = await Service.updateMany(
      { status: oldStatus },
      { $set: { status: newStatus } },
      { runValidators: true }
    )

    return res.status(200).json({
      message: "status update succeffully",
      success: true,
      data: UpdateProgressStatus.modifiedCount
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
}




// here single service api create

exports.singleGetService = async (req, res) => {
  try {
    const { id } = req.params;
    const singleVal = await Service.findById(id).populate("customerId").populate('technicianId')
    .populate('ticketId')
    // .populate('partsId')
    .populate('parts.partId');
console.log(singleVal,"silngel value");

    return res.status(200).json({
      message: "Get signle Services successfully",
      success: true,
      data: singleVal
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
}





// here middleware impliment (customer show only his listing and technician see only his data);
// exports.singleGetService = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const service = await Service.findById(id)
//       .populate("customerId")
//       .populate("technicianId")
//       .populate("partsId");

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found"
//       });
//     }

//     // 🔐 ROLE BASED ACCESS CONTROL

//     // 1️⃣ If Customer → can only see their own service
//     if (req.user.role === "customer") {
//       if (service.customerId._id.toString() !== req.user.id) {
//         return res.status(403).json({
//           success: false,
//           message: "Access Denied: Not your service"
//         });
//       }
//     }

//     // 2️⃣ If Technician → can only see assigned service
//     if (req.user.role === "technician") {
//       if (!service.technicianId ||
//           service.technicianId._id.toString() !== req.user.id) {
//         return res.status(403).json({
//           success: false,
//           message: "Access Denied: Not assigned to you"
//         });
//       }
//     }

//     // 3️⃣ Admin → no restriction

//     return res.status(200).json({
//       message: "Get single service successfully",
//       success: true,
//       data: service
//     });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "Something went wrong",
//       success: false,
//       error: err.message
//     });
//   }
// };


// here assign technicians



exports.assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id,"technician id");
    const { technicianId } = req.body;
    // console.log(technicianId,"technician id");

    const assigntech = await Service.findByIdAndUpdate(
      id,
      {
        $set: {
          technicianId,
          status: "In Progress"
        }
      },
      { new: true }
    ).populate('customerId').populate('technicianId');
// console.log(assigntech,"technician assig");
    return res.status(200).json({
      message: 'technician assign succssefull',
      success: true,
      data: assigntech
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
}




// find finale data (yaha par all data milega jo pdf me dikhega like customer,technicain,parts , price cost etc)




// technician uses parts

// exports.usePartsOftechnician = async (req, res) => {
//   try {
//     const { id, techId } = req.params;
//     const { partsId } = req.body;

//     const updatedService = await Service.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           technicianId: techId,
//           partsId: partsId
//         }
//       },
//       { new: true }
//     )
//       .populate("technicianId")
//       .populate("partsId");

//     return res.status(200).json({
//       message: "Technician assigned & part added successfully",
//       success: true,
//       data: updatedService
//     });

//   } catch (err) {
//     return res.status(500).json({
//       message: "Something went wrong",
//       success: false,
//       error: err.message
//     });
//   }
// };


exports.usePartsOftechnician = async (req, res) => {
  try {
    const { id, techId } = req.params;
    const { partId, quantity } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const part = await Part.findById(partId);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }

    // ✅ Stock Check
    if (part.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }

    // ✅ Calculate totals
    const total = part.price * quantity ;

    // ✅ Check if part already added
    const existingPartIndex = service.parts.findIndex(
      (p) => p.partId.toString() === partId
    );

    if (existingPartIndex > -1) {
      // update quantity
      service.parts[existingPartIndex].quantity += quantity;
      service.parts[existingPartIndex].total += total;
    } else {
      service.parts.push({
        partId: partId,
        quantity: quantity,
        price: part.price,
        total: total
      });
    }

    // ✅ Reduce stock
    part.stock -= quantity;
    await part.save();

    // ✅ Recalculate totals
    service.partsTotal = service.parts.reduce(
      (acc, item) => acc + item.total,
      0
    );

    service.grandTotal = service.partsTotal + service.serviceCharge;

    service.technicianId = techId;

    await service.save();

    const updatedService = await Service.findById(id)
      .populate("technicianId")
      .populate("parts.partId");

    return res.status(200).json({
      success: true,
      message: "Part added successfully",
      data: updatedService
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




// generate service pdf

const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");
// const Service = require("../models/Service");
const serviceTemplate = require("../utils/generateServicePdf");


const sendServiceMail = require("../utils/sendMail");

exports.generateServicePdf = async (req, res) => {
  try {
    const { id } = req.params;
console.log("Requested ID:", id);
    const service = await Service.findById(id)
      .populate("customerId")
      .populate("technicianId")
      .populate("parts.partId");
// console.log(service,"service mail");
if (!service) {
  return res.status(404).json({
    success: false,
    message: "Service not found",
  });
}
console.log("SERVICE DATA:", JSON.stringify(service, null, 2));
    const html = serviceTemplate(service);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const filePath = path.join(__dirname, `../uploads/service_${id}.pdf`);

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ✅ Send Email to Customer
    await sendServiceMail(service.customerId.email, filePath);

    res.status(200).json({
      success: true,
      message: "PDF generated and email sent to customer",
    });

  } catch (error) {
    console.log(error);
  }
};




exports.getCustomerFullHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: find all tickets of this customer
    const tickets = await Customer.find({ userId });

    const ticketIds = tickets.map(t => t._id);
console.log(ticketIds,"ticket id");
    // Step 2: find all services related to those tickets
    const services = await Service.find({ ticketId: { $in: ticketIds } })

       .populate("customerId")
      .populate("technicianId")
      .populate("parts.partId")
      .sort({ createdAt: -1 })
console.log(services,"ommmm");
    res.status(200).json({
      success: true,
      data: services
    });

  } catch (error) {
    console.log(error);
  }
};

// download pdf logic


const PDFDocument = require("pdfkit");
// const Service = require("../models/Service");

exports.downloadServicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate("customerId")
      .populate("technicianId")
      .populate("parts.partId");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const doc = new PDFDocument({ margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=service-${id}.pdf`
    );

    doc.pipe(res);

    // 🔹 HEADER
    doc.fontSize(16).text("SERVICE REPORT", { align: "center" });
    doc.moveDown();

    // 🔹 TOP INFO
    doc.fontSize(10).text(`Ticket ID: ${service.ticketId}`);
    doc.text(`Problem: ${service.problemDescription}`);
    doc.text(`Status: ${service.status}`);
    doc.text(`Date: ${new Date(service.createdAt).toLocaleDateString()}`);

    doc.moveUp(4);
    doc.text(
      `Technician: ${service.technicianId?.name || "N/A"}`,
      { align: "right" }
    );
    doc.text(`Grand Total: ₹${service.grandTotal}`, { align: "right" });

    doc.moveDown(2);

    // 🔹 PARTS TABLE
    if (service.parts.length > 0) {
      doc.text("Parts Details:");
      doc.moveDown(0.5);

      // Table Header
      doc.text("Part", 50);
      doc.text("Qty", 200);
      doc.text("Price", 260);
      doc.text("Total", 340);
      doc.moveDown(0.5);

      service.parts.forEach((part) => {
        doc.text(part.partId?.partName, 50);
        doc.text(part.quantity.toString(), 200);
        doc.text(part.price.toString(), 260);
        doc.text(part.total.toString(), 340);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};




// view customer status


// exports.getServicesByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;

//     const services = await Service.find({ customerId })
//       .populate("customerId")
//       .populate("technicianId")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       message: "Customer services fetched",
//       success: true,
//       data: services
//     });

//   } catch (err) {
//     return res.status(500).json({
//       message: "Something went wrong",
//       success: false,
//       error: err.message
//     });
//   }
// };






exports.getServicesByCustomer = async (req, res) => {
  try {
    const { customerId,ticketId } = req.params;
    console.log(ticketId,"ticket id");

    const services = await Service.find({ customerId,ticketId })
      .populate("customerId")
      .populate("technicianId")
      .populate('ticketId')
      .sort({ createdAt: -1 });
// console.log(services,"services services services");
    return res.status(200).json({
      message: "Customer services fetched",
      success: true,
      data: services
    });

  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message
    });
  }
};



// bulk upload



const XLSX = require("xlsx");
// const fs = require("fs");
// const mongoose = require("mongoose");

exports.bulkUploadServices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded",
      });
    }

    const filePath = req.file.path;

    // ✅ Read Excel File
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    let servicesToInsert = [];

    for (let row of rows) {
      try {
        const {
          customerId,
          problemDescription,
          serviceCharge,
          status,
        } = row;

        // ✅ Validate required fields
        if (!customerId || !problemDescription) {
          continue; // skip invalid row
        }

        // 🔥 Find latest ticket for user
        const ticket = await Customer.findOne({
          userId: customerId,
        }).sort({ createdAt: -1 });

        if (!ticket) {
          continue; // skip if no ticket
        }

        servicesToInsert.push({
          customerId: new mongoose.Types.ObjectId(customerId),
          ticketId: ticket._id,
          problemDescription,
          serviceCharge: Number(serviceCharge) || 0,
          status: status || "Pending",
        });
      } catch (err) {
        console.log("Row Error:", err.message);
      }
    }

    // ✅ Insert all at once (FAST 🚀)
    const insertedData = await Service.insertMany(servicesToInsert);

    // 🧹 Delete file after processing
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Bulk upload successful",
      totalInserted: insertedData.length,
      data: insertedData,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Bulk upload failed",
      error: err.message,
    });
  }
};




// get ticket by customer



exports.getTicketsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const tickets = await Customer.find({ userId: customerId });

    res.json({
      success: true,
      data: tickets
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};