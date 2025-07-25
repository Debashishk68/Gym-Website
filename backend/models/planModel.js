const mongoose= require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  durations: [
    {
      months: { type: Number, required: true },  // e.g., 1, 3, 6, 12
      price: { type: Number, required: true },    // e.g., 2099
    },
  ],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plan", planSchema);

