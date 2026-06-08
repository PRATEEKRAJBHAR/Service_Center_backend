const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Users",
  required: true
},
    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // Device Info
    deviceName: {
      type: String,
      required: true,
    },

    devicePrice: {
      type: Number,
    },

    // File Uploads
    purchaseBill: {
      type: String, // PDF URL
    },

    deviceImage: {
      type: String, // Image URL
    },

    // System Fields
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
problemDescription: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
