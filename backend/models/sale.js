// models/SupplementSale.js
const mongoose = require("mongoose");

const supplementSaleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Validates Indian mobile format
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  weightKg: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  supplementName: {
    type: String,
    required: true,
  },
  supplementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplement",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  modeOfPayment: {
    type: String,
    enum: ["cash", "upi", "card", "online", "other"],
    required: true,
  },
  soldAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SupplementSale", supplementSaleSchema);
