const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const {
    validateRegistrationInput,
    validateLoginInput,
    validateTaskInput
} = require("../middleware/validation");

process.env.JWT_SECRET = "test-only-secret-for-auth-tests";

function invokeAuth(authorization) {
    const req = { get: () => authorization };
    const res = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
    let passed = false;
    auth(req, res, () => { passed = true; });
    return { req, res, passed };
}

test("registration validation checks name, email, and password and normalizes inputs", () => {
    const invalid = validateRegistrationInput({ name: " ", email: "not-an-email", password: "short" });
    assert.deepEqual(Object.keys(invalid.errors).sort(), ["email", "name", "password", "wrong"]);

    const valid = validateRegistrationInput({ name: " Ada ", email: "ADA@example.com", password: "long-pass-123" });
    assert.deepEqual(valid.errors, {});
    assert.deepEqual(valid.value, { name: "Ada", email: "ada@example.com", password: "long-pass-123" });
});

test("login validation rejects malformed email and missing password", () => {
    const result = validateLoginInput({ email: "bad", password: "" });
    assert.deepEqual(Object.keys(result.errors).sort(), ["email", "password"]);
});

test("task validation rejects blank title and non-boolean completion", () => {
    const result = validateTaskInput({ title: "  ", completed: "yes" });
    assert.deepEqual(Object.keys(result.errors).sort(), ["completed", "title"]);
});

test("auth middleware accepts a signed bearer token and exposes its subject", () => {
    const token = jwt.sign({ sub: "user-123" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const result = invokeAuth(`Bearer ${token}`);
    assert.equal(result.passed, true);
    assert.deepEqual(result.req.user, { id: "user-123" });
});

test("auth middleware rejects missing and invalid tokens with JSON 401", () => {
    for (const header of[undefined, "Basic abc", "Bearer invalid-token"]) {
        const result = invokeAuth(header);
        assert.equal(result.passed, false);
        assert.equal(result.res.statusCode, 401);
        assert.equal(result.res.body.status, "error");
    }
});

test("auth middleware rejects expired tokens with JSON 401", () => {
    const token = jwt.sign({ sub: "user-123" }, process.env.JWT_SECRET, { expiresIn: -1 });
    const result = invokeAuth(`Bearer ${token}`);
    assert.equal(result.passed, false);
    assert.equal(result.res.statusCode, 401);
    assert.equal(result.res.body.message, "Invalid or expired token");
});