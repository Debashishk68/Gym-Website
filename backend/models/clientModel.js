const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
   fathersname: {
    type: String,
    required: true,
    trim: true
  },
  profilePic:{
    type: String,
    default: ''
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  membershipDeadline:{
    type:Date
  },
  plan: {
    type: String,
    required: true,

  },
  planPrice: {
    type: Number,
    required: true
  },
  emergencyContact: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive']
  },
  address: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Client", clientSchema);
