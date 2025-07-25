const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Assuming each invoice is tied to a member
      required: true,
    },
    // invoiceId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Pending",
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports= mongoose.model("Invoice", invoiceSchema);
