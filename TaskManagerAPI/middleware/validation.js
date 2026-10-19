const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistrationInput(body = {}) {
    const errors = {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name) errors.name = "Name is required";
    if (name.length > 80) errors.name = "Name must be 80 characters or fewer";
    if (!emailPattern.test(email)) errors.email = "A valid email address is required";
    if (password.length < 8) errors.password = "Password must be at least 8 characters";

    return { errors, value: { name, email, password } };
}

function validateLoginInput(body = {}) {
    const errors = {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!emailPattern.test(email)) errors.email = "A valid email address is required";
    if (!password) errors.password = "Password is required";

    return { errors, value: { email, password } };
}

function createValidator(validate, destination) {
    return (req, res, next) => {
        const { errors, value } = validate(req.body);
        if (Object.keys(errors).length) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors
            });
        }
        req[destination] = value;
        return next();
    };
}

function validateTaskInput(body = {}) {
    const errors = {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";

    if (!title) errors.title = "Task title is required";
    if (title.length > 160) errors.title = "Task title must be 160 characters or fewer";
    if (body.completed !== undefined && typeof body.completed !== "boolean") {
        errors.completed = "Completed must be true or false";
    }

    const value = { title, description };
    if (body.completed !== undefined) value.completed = body.completed;
    return { errors, value };
}

const validateRegistration = createValidator(validateRegistrationInput, "validatedAuth");
const validateLogin = createValidator(validateLoginInput, "validatedAuth");
const validateTask = createValidator(validateTaskInput, "validatedTask");

module.exports = {
    validateRegistration,
    validateLogin,
    validateTask,
    validateRegistrationInput,
    validateLoginInput,
    validateTaskInput
};