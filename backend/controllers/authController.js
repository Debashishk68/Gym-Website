const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !user.password) {
      return res
        .status(400)
        .json({ error: "Invalid credentials", isAuthenticated: false });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ error: "Invalid credentials", isAuthenticated: false });
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        message: "Login successful",
        isAuthenticated: true,
        role: user.role,
        userId: user._id,
        name: user.name,
        profilepic: user.profilepic,
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function register(req, res) {
  try {
    let { firstName, lastName, email, password,role } = req.body;

    if (!email || !password || !firstName || !lastName ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ error: "User already exists, please login" });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.create({
      name: firstName +" " + lastName,
      email,
      password: hashedPassword,
      role: role
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

function logout(req, res) {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
}

module.exports = { login, register, logout };
