const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegistration, validateLogin } = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateRegistration, async(req, res, next) => {
    try {
        const { name, email, password } = req.validatedAuth;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({
            message: "Registration successful",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        return next(error);
    }
});

router.post("/login", validateLogin, async(req, res, next) => {
    try {
        const { email, password } = req.validatedAuth;
        const user = await User.findOne({ email }).select("+password");
        const passwordMatches = user && await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ sub: user._id.toString() },
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;