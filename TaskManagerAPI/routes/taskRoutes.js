const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { validateTask } = require("../middleware/validation");
const {
    allTasksCacheKey,
    getCached,
    getCacheStats,
    invalidateUserTaskCache,
    setCached,
    taskCacheKey
} = require("../utils/taskCache");
const taskEvents = require("../events");

router.get("/cache/stats", (req, res) => {
    res.status(200).json(getCacheStats());
});

// GET - Get all tasks
router.get("/", async(req, res, next) => {
    try {
        const cacheKey = allTasksCacheKey(req.user.id);
        const cachedTasks = getCached(cacheKey);
        if (cachedTasks !== undefined) {
            res.set("X-Cache", "HIT");
            return res.status(200).json(cachedTasks);
        }

        const tasks = await Task.find({ userId: req.user.id }).lean();
        setCached(cacheKey, tasks);
        res.set("X-Cache", "MISS");
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});

// GET - Get one task by ID
router.get("/:id", async(req, res, next) => {
    try {
        const cacheKey = taskCacheKey(req.user.id, req.params.id);
        const cachedTask = getCached(cacheKey);
        if (cachedTask !== undefined) {
            res.set("X-Cache", "HIT");
            return res.status(200).json(cachedTask);
        }

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).lean();

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found"
            });
        }

        setCached(cacheKey, task);
        res.set("X-Cache", "MISS");
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

// POST - Create a new task
router.post("/", validateTask, async(req, res, next) => {
    try {
        const task = new Task({
            ...req.validatedTask,
            userId: req.user.id
        });

        const savedTask = await task.save();
        invalidateUserTaskCache(req.user.id);

        const responseBody = {
            message: "Task created successfully",
            task: savedTask
        };
        res.once("finish", () => {
            const timestamp = new Date().toISOString();
            console.log(`[API] Task-created response sent at ${timestamp}`);
            taskEvents.emit("task-created", {
                title: savedTask.title,
                timestamp,
                userId: req.user.id
            });
        });
        res.status(201).json(responseBody);
    } catch (error) {
        next(error);
    }
});

// PUT - Update a task by ID
router.put("/:id", validateTask, async(req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id },
            req.validatedTask, {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found"
            });
        }

        invalidateUserTaskCache(req.user.id);

        res.status(200).json({
            message: "Task updated successfully",
            task: task
        });
    } catch (error) {
        next(error);
    }
});

// DELETE - Delete a task by ID
router.delete("/:id", async(req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found"
            });
        }

        invalidateUserTaskCache(req.user.id);

        const responseBody = {
            message: "Task deleted successfully"
        };
        res.once("finish", () => {
            taskEvents.emit("task-deleted", {
                title: task.title,
                userId: req.user.id
            });
        });
        res.status(200).json(responseBody);
    } catch (error) {
        next(error);
    }
});

module.exports = router;