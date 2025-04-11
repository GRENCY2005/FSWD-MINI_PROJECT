const mongoose = require("mongoose");

// Transection Schema
const transectionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String, // income / expense
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // users collection reference
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

const transectionModel = mongoose.model("transections", transectionSchema);

module.exports = transectionModel;
