const jwt = require("jsonwebtoken");
const sendEmail = require("../services/mailService");
const userModel = require("../models/userModel");
const OTP = require("../models/otpModel");
const crypto = require("crypto");


const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = hashOtp(otpCode);

    // Save or update OTP
    await OTP.findOneAndUpdate(
      { email },
      { email, code: hashedOtp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send the OTP via email
    await sendEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check expiration (10 minutes)
    const expirationTime = 10 * 60 * 1000; // 10 minutes in ms
    const now = new Date();

    if (now - otpRecord.createdAt > expirationTime) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedInputOtp = hashOtp(otp);

    if (hashedInputOtp !== otpRecord.code) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, delete it
    await OTP.deleteOne({ email });

    // Issue JWT token
    const token = jwt.sign({ email }, process.env.RESET_SECRET, {
      expiresIn: "10m",
    });

    return res.status(200).json({
      message: "OTP verified",
      token,
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Failed to verify OTP", error: err.message });
  }
};
module.exports = {
  verifyOtp,
  sendOtp,
};
