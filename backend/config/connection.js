// backend/config/db.js or connection.js
const mongoose = require('mongoose');

async function connectMongoDb(uri) {
    if (!uri) {
        console.error("MongoDB URI is not defined.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }

    // Optional: Additional event listeners
    const db = mongoose.connection;
    db.on('error', (err) => console.error("❗ MongoDB Error:", err));
    db.on('disconnected', () => console.warn("⚠️ MongoDB disconnected"));
}

module.exports = { connectMongoDb };
