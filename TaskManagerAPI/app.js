require("dotenv").config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in TaskManagerAPI/.env");
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const taskEvents = require("./events");
const registerTaskListeners = require("./listeners/taskListeners");

registerTaskListeners(taskEvents);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(logger);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/taskdb_practical7";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// Routes
app.use("/auth", authRoutes);
app.get("/health", (req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
        status: databaseReady ? "ok" : "waiting",
        database: databaseReady ? "connected" : "disconnected"
    });
});
app.get("/me", auth, async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("name email");
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User account no longer exists"
            });
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
});
app.use("/tasks", auth, taskRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found"
    });
});

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});