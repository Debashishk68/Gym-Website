const express = require("express");
const cors = require("cors");
const { connectMongoDb } = require("./config/connection");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth/index");
const dashboardRouter = require("./routes/private/index")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config();

connectMongoDb(process.env.MONGODB);
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRouter);

app.use("/dashboard", dashboardRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
