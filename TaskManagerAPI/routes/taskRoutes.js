const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { validateTask } = require("../middleware/validation");

// GET - Get all tasks
router.get("/", async(req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
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

        res.status(201).json({
            message: "Task created successfully",
            task: savedTask
        });
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

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;