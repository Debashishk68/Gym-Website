const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Load environment variables
dotenv.config();

// MongoDB connection
const { connectMongoDb } = require("./config/connection");

// Routes
const authRouter = require("./routes/auth/index");
const dashboardRouter = require("./routes/private/index");
const certificateRoutes = require("./routes/private/certificate");
const supplementRoutes = require("./routes/private/suppliment");
const expenseRoutes = require("./routes/private/Expense");

// Cron jobs
require("./corn/deleteOldClients");

// Connect to MongoDB
connectMongoDb(process.env.MONGODB);

// Initialize Express app
const app = express();

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// API Routes
app.get("/", (req, res) => {
  res.send("✅ Backend server is running");
});

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/api/certificate", certificateRoutes);
app.use("/suppliment", supplementRoutes);
app.use("/expenses", expenseRoutes);

// Static folders (optional)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/certificates", express.static(path.join(__dirname, "certificates")));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT);
