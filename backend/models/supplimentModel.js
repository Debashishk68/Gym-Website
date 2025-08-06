const mongoose = require("mongoose");

const supplementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    company: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports= mongoose.model("Supplement", supplementSchema);
