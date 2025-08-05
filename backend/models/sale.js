const mongoose = require("mongoose");

const supplementSaleSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String },
    weightKg: { type: String },
    company: { type: String },
    supplementName:[{ type: String, required: true }],
    supplementId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplement",
      required: true,
    }],
    quantity: { type: Number, required: true },
    modeOfPayment: { type: String, enum: ["cash", "online"], required: true },

   
    mrp: [{ type: Number, required: true }], 
    discountPercent: [{ type: Number, default: 0 }], 
    unitPrice: [{ type: Number, required: true }], 
    total: { type: Number, required: true }, 
    totalDiscount: { type: Number, default: 0 }, 

    // Auto fields
    invoiceNo: { type: String },
    date: { type: Date, default: Date.now },
    invoicePdf: { type: String },
    amountDue: { type: Number, required: true,default:0 }, // New field for amount paid
    amountPaid: { type: Number, default: 0 }, // New field for amount paid
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplementSale", supplementSaleSchema);
