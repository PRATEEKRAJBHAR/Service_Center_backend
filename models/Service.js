// const mongoose = require("mongoose");

// const serviceSchema = new mongoose.Schema(
// {
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer",
//     required: true,
//   },
//   // here adding one technician feilds
// technicianId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Users",
// },

// // adding parts here

// partsId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Part",
// },

// // parts: [
// //   {
// //     partId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Part",
// //       required: true
// //     },
// //     quantity: {
// //       type: Number,
// //       required: true,
// //       default: 1
// //     }
// //   }
// // ],
//   problemDescription: {
//     type: String,
//     required: true,
//   },

//   serviceCharge: {
//     type: Number,
//     default: 0,
//   },

//   status: {
//     type: String,
//     enum: ["Pending", "In Progress", "Completed"],
//     default: "Pending",
//   },

//   // images: [
//   //   {
//   //     url: String,
//   //   },
//   // ],

//   // reports: [
//   //   {
//   //     url: String,
//   //   },
//   // ],



//   // img and report store in cloud

//   images: [
//   {
//     url: String,
//     public_id: String
//   }
// ],

// reports: [
//   {
//     url: String,
//     public_id: String
//   }
// ],
//   serviceLogs: [
//     {
//       message: {
//         type: String,
//         required: true
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now
//       }
//     }
//   ],

// },
// { timestamps: true }
// );

// module.exports = mongoose.model("Service", serviceSchema);




  const mongoose = require("mongoose");

  const serviceSchema = new mongoose.Schema(
  {

    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
ticketId: {   // ✅ ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
    // ✅ Multiple parts with quantity
    parts: [
      {
        partId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Part",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        price: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        }
      }
    ],

    // problemDescription: {
    //   type: String,
    //   required: true,
    // },

    serviceCharge: {
      type: Number,
      default: 0,
    },

    // ✅ total of parts
    partsTotal: {
      type: Number,
      default: 0
    },

    // ✅ grand total (service + parts)
    grandTotal: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // images: [
    //   {
    //     url: String,
    //     public_id: String
    //   }
    // ],

    // reports: [
    //   {
    //     url: String,
    //     public_id: String
    //   }
    // ],

    serviceLogs: [
      {
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
  },
  { timestamps: true }
  );

  module.exports = mongoose.model("Service", serviceSchema);

