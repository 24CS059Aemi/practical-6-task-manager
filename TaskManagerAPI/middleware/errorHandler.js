function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.code === 11000) {
        return res.status(409).json({
            status: "error",
            message: "An account with this email already exists"
        });
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const errors = {};
        for (let field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors
        });
    }

    // Invalid MongoDB ID (CastError)
    if (err.name === "CastError") {
        return res.status(400).json({
            status: "error",
            message: "Invalid task ID"
        });
    }

    const statusCode = Number.isInteger(err.status) && err.status >= 400 && err.status < 500 ?
        err.status :
        500;
    return res.status(statusCode).json({
        status: "error",
        message: statusCode === 500 ? "Internal Server Error" : err.message
    });
}

module.exports = errorHandler;