const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// MongoDB Connection
// Using MongoDB Compass (Local MongoDB) with separate database for Practical 5
const MONGODB_URI = "mongodb://localhost:27017/taskdb_practical5";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// Routes
app.use("/tasks", taskRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});