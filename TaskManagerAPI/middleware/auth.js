const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const authorization = req.get("Authorization") || "";
    const match = authorization.match(/^Bearer\s+([^\s]+)$/i);

    if (!match) {
        return res.status(401).json({
            status: "error",
            message: "Authorization token is required"
        });
    }

    try {
        const decoded = jwt.verify(match[1], process.env.JWT_SECRET);
        if (!decoded.sub) {
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token"
            });
        }
        req.user = { id: decoded.sub };
        return next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token"
        });
    }
}

module.exports = auth;