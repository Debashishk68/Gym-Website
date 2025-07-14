const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function isLoggedIn(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token)
      return res
        .status(400)
        .send({ message: "You are not Login", isAuthicated: false });

    const decoded = jwt.verify(token, process.env.SECRET);


    const user = await userModel.findOne({ email: decoded.email });

    if (!user)
      return res
        .status(400)
        .send({ message: `You are not Login ${decoded.email}`, isAuthicated: false });

    req.id = { user: user._id , userName: user.name };
    next();
  } catch (error) {
  
    if (error.name === "JsonWebTokenError") {
        return res.status(401).send({
          error: "Invalid token",
          isAuthenticated: false,
        });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).send({
          error: "Token expired",
          isAuthenticated: false,
        });
      } else {
        // General server error
        return res.status(500).send({
          error: "Server error",
          isAuthenticated: false,
        });
    }}
}

module.exports = isLoggedIn;
