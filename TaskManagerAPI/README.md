# Task Manager API - Practical 5: MongoDB Integration with Mongoose

A RESTful API built with Node.js, Express, and MongoDB for managing tasks. This project demonstrates complete CRUD operations with proper middleware implementation and MongoDB integration using Mongoose ODM.

## Practical 7: Authentication and Middleware Pipeline

The API supports bcrypt password hashing, one-hour JWTs, protected task routes, per-user task ownership, and server-side validation.

### Run Practical 7

1. Copy `.env.example` to `.env` and replace `JWT_SECRET` with a private random value. The root `.gitignore` excludes `.env`.
2. Make sure MongoDB is running, then start the API with `npm start`.
3. Start the frontend from `../task-manager-frontend` with `npm run dev`.

### Authentication endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register using `name`, `email`, and a password of at least 8 characters |
| POST | `/auth/login` | Verify credentials and return a JWT that expires in one hour |
| GET | `/me` | Return the authenticated user's name and email |

All `/tasks` endpoints require `Authorization: Bearer <token>`. Tasks are scoped to the authenticated account. Invalid, missing, or expired tokens return JSON `401` responses.

Run backend unit tests with `npm test` from `TaskManagerAPI`; they cover input validation and missing, invalid, and expired tokens.

## Practical 9: In-Memory Caching and Query Optimization

`GET /tasks` and `GET /tasks/:id` use a process-local `node-cache` instance with a 60-second TTL. Cache keys include the authenticated user ID, so users cannot receive another user's task data. Successful task creation, update, and deletion invalidate every task cache entry for that user. Task GET responses include `X-Cache: HIT` or `X-Cache: MISS`.

The authenticated `GET /tasks/cache/stats` endpoint returns the process-local hit, miss, and current-key counts. Restarting the API clears this cache and its counters. Because each server process has its own cache, multiple API instances do not share entries or invalidations; use a shared cache service such as Redis for multi-instance deployments.

See [PERFORMANCE.md](./PERFORMANCE.md) for Postman measurement instructions and a table to record three real uncached and cached readings.

## Practical 10: Asynchronous Task Notifications

The API uses Node.js's built-in `EventEmitter` for `task-created` and `task-deleted` notifications. Task notifications are emitted after the HTTP response finishes; the task-created listener logs its notification after a two-second delay. Listener failures are reported through the `task-notification-error` event, avoiding EventEmitter's special unhandled `error` event behavior.

See [EVENTS.md](./EVENTS.md) for run instructions and the console/Postman evidence checklist.

## Practical 13: AI Task Description Suggestions

The authenticated `POST /api/ai/generate-description` endpoint sends only the task title to OpenAI from the backend and returns an editable suggestion. Configure `OPENAI_API_KEY` in `TaskManagerAPI/.env` for local development; never put it in frontend variables or commit it. The frontend shows a loading state and disclaimer, allows editing, and remains usable when AI is missing or unavailable. See [AI_INTEGRATION.md](../AI_INTEGRATION.md) for setup, testing, and screenshot instructions.

## 🎯 Practical 5: MongoDB Integration with Mongoose

This is an extension of Practical 4 that replaces the in-memory JavaScript array with persistent MongoDB storage using Mongoose.

### Key Differences from Practical 4 → Practical 5

| Aspect | Practical 4 | Practical 5 |
|--------|-----------|-----------|
| **Data Storage** | JavaScript array (in-memory) | MongoDB (persistent database) |
| **Data Modeling** | Manual object structure | Mongoose Schema with validation |
| **CRUD Operations** | Array methods | Mongoose methods |
| **Validation** | Manual checking | Schema-based automatic validation |
| **Error Handling** | Basic | Advanced Mongoose validation errors |

## ✨ Features

- ✅ Complete CRUD operations with MongoDB
- ✅ Mongoose schema with field validation
- ✅ Logging middleware for request tracking
- ✅ Structured error handling for Mongoose validation
- ✅ 404 route handler
- ✅ Automatic timestamps and default values
- ✅ RESTful endpoint design
- ✅ JSON request/response support
- ✅ Async/Await with proper error handling

## 📁 Project Structure

```
TaskManagerAPI/
├── app.js                    # Express server with MongoDB connection
├── package.json              # Project dependencies
├── package-lock.json         # Dependency lock file
├── middleware/
│   ├── logger.js            # Request logging middleware
│   └── errorHandler.js      # Error handling with Mongoose validation
├── models/
│   └── Task.js              # Mongoose Task schema
├── routes/
│   └── taskRoutes.js        # CRUD endpoints with Mongoose
└── README.md                # Documentation
```

## 📋 Prerequisites

You need:
1. **Node.js** (v12 or higher)
2. **MongoDB** (Local installation - Compass recommended)
3. **MongoDB Compass** (GUI for viewing data - optional but recommended)
4. **Postman** (For API testing)

## 🚀 Installation

### Step 1: Install MongoDB

1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start MongoDB service (Windows: `mongod.exe`)
4. (Optional) Install MongoDB Compass from same page

### Step 2: Clone and Install Project

```bash
git clone https://github.com/24CS059Aemi/TaskManagerAPI.git
cd TaskManagerAPI
npm install
```

## ▶️ Running the Server

**Make sure MongoDB is running first**, then:

```bash
node app.js
```

Expected output:
```
Server is running on port 3000
MongoDB connected successfully
```

The API will be available at: `http://localhost:3000`

## 🗄️ Database Configuration

**Database:** `taskdb_practical5` (Local MongoDB via Compass)

**Connection String:** `mongodb://localhost:27017/taskdb_practical5`

**To change database name**, edit in `app.js`:
```javascript
const MONGODB_URI = "mongodb://localhost:27017/your_database_name";
```

## 📊 Task Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | MongoDB unique identifier |
| `title` | String | ✅ Yes | — | Task title (REQUIRED) |
| `description` | String | ❌ No | — | Task description |
| `completed` | Boolean | ❌ No | `false` | Completion status |
| `createdAt` | Date | ❌ No | `Date.now` | Auto-generated timestamp |

## 🔌 API Endpoints

### 1. GET All Tasks
```http
GET http://localhost:3000/tasks
```

**Response (200 OK):**
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Learn MongoDB",
        "description": "Study Mongoose CRUD",
        "completed": false,
        "createdAt": "2026-08-31T10:20:30.000Z"
    }
]
```

---

### 2. Create Task
```http
POST http://localhost:3000/tasks
Content-Type: application/json

{
    "title": "Learn MongoDB",
    "description": "Study Mongoose CRUD",
    "completed": false
}
```

**Response (201 Created):**
```json
{
    "message": "Task created successfully",
    "task": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Learn MongoDB",
        "description": "Study Mongoose CRUD",
        "completed": false,
        "createdAt": "2026-08-31T10:20:30.000Z",
        "__v": 0
    }
}
```

**Validation Error (400):**
```json
{
    "message": "Validation failed",
    "errors": {
        "title": "Path `title` is required."
    }
}
```

---

### 3. Update Task
```http
PUT http://localhost:3000/tasks/507f1f77bcf86cd799439011
Content-Type: application/json

{
    "title": "Master MongoDB",
    "description": "Advanced patterns",
    "completed": true
}
```

**Response (200 OK):**
```json
{
    "message": "Task updated successfully",
    "task": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Master MongoDB",
        "completed": true
    }
}
```

**Not Found (404):**
```json
{
    "message": "Task not found"
}
```

**Invalid ID (400):**
```json
{
    "message": "Invalid task ID"
}
```

---

### 4. Delete Task
```http
DELETE http://localhost:3000/tasks/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
    "message": "Task deleted successfully"
}
```

## 📈 HTTP Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, invalid ID |
| 404 | Not Found | Task not found, route not found |
| 500 | Server Error | Internal error |

## 🔧 Middleware Details

### Logger Middleware
**File:** `middleware/logger.js`

Logs each request with format:
```
[METHOD] [URL] - [TIMESTAMP]
```

Example:
```
GET /tasks - 08/31/2026, 10:20:30 AM
POST /tasks - 08/31/2026, 10:20:35 AM
PUT /tasks/507f1f77bcf86cd799439011 - 08/31/2026, 10:20:40 AM
```

### Error Handler Middleware
**File:** `middleware/errorHandler.js`

Handles three error types:

1. **Mongoose ValidationError** (400)
   ```json
   {
       "message": "Validation failed",
       "errors": { "field": "error message" }
   }
   ```

2. **CastError - Invalid MongoDB ID** (400)
   ```json
   { "message": "Invalid task ID" }
   ```

3. **Other Errors** (500)
   ```json
   { "message": "Internal Server Error" }
   ```

## 🧪 Testing with Postman

### Quick Test Workflow

**Step 1: Create Task**
```
POST http://localhost:3000/tasks
Body (raw JSON):
{
    "title": "Test Task",
    "description": "Testing Practical 5"
}
```
Copy the `_id` from response.

**Step 2: Get All Tasks**
```
GET http://localhost:3000/tasks
```

**Step 3: Update Task**
```
PUT http://localhost:3000/tasks/{paste_id_here}
Body:
{
    "title": "Updated Test Task",
    "completed": true
}
```

**Step 4: Delete Task**
```
DELETE http://localhost:3000/tasks/{paste_id_here}
```

**Step 5: Verify Deletion**
```
GET http://localhost:3000/tasks
```

## 🔍 Viewing Data in MongoDB Compass

1. Open **MongoDB Compass**
2. Click **Connect** (connects to localhost:27017)
3. Select database: `taskdb_practical5`
4. Click collection: `tasks`
5. View all documents

## 🎨 Mongoose CRUD Methods

| Operation | Method | Async |
|-----------|--------|-------|
| Read All | `Task.find()` | Yes |
| Create | `task.save()` | Yes |
| Update | `Task.findByIdAndUpdate(id, data, options)` | Yes |
| Delete | `Task.findByIdAndDelete(id)` | Yes |

All methods are used with `await` for async handling.

## 📋 Key Improvements from Practical 4

1. **Persistent Storage**: Data saved in MongoDB, survives server restarts
2. **Schema Validation**: Automatic field validation
3. **Automatic Fields**: `_id` and `createdAt` auto-generated
4. **Better Error Handling**: Structured Mongoose error responses
5. **Async/Await**: Modern JavaScript for database operations
6. **Type Safety**: Schema defines expected data types

## 🚨 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:** Ensure MongoDB is running
```bash
# Windows: Run mongod.exe
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: "ValidationError: title is required"
**Solution:** Always include `title` in POST/PUT requests

### Issue: "Invalid task ID"
**Solution:** Use valid MongoDB ObjectId format from GET response

### Issue: "Cannot find module 'mongoose'"
**Solution:** Install dependencies
```bash
npm install
```

## 📦 Dependencies

```json
{
    "express": "^5.2.1",
    "mongoose": "^9.9.4"
}
```

## 🔄 Request/Response Flow

```
Client (Postman)
    ↓
express.json() - Parse JSON
    ↓
Logger Middleware - Log request
    ↓
Express Router - Route to handler
    ↓
Async Route Handler
    ↓
Mongoose Model Methods ↔ MongoDB Database
    ↓
Error Handler (if error)
    ↓
HTTP Response (JSON + Status Code)
```

## 💡 Understanding Async/Await

```javascript
// GET all tasks
router.get("/", async (req, res, next) => {
    try {
        const tasks = await Task.find();  // Wait for DB query
        res.status(200).json(tasks);
    } catch (error) {
        next(error);  // Pass error to error handler
    }
});
```

- `async` - Function can use `await`
- `await` - Wait for Promise to resolve
- `try/catch` - Handle success and errors
- `next(error)` - Pass error to error handler middleware

## 📝 Practical 4 vs Practical 5 Code Comparison

### Practical 4 (In-Memory Array)
```javascript
let tasks = [{ id: 1, title: "Learn Node.js" }];

router.post("/", (req, res) => {
    const task = { id: tasks.length + 1, title: req.body.title };
    tasks.push(task);
    res.status(201).json(task);
});
```

### Practical 5 (MongoDB with Mongoose)
```javascript
const Task = require("../models/Task");

router.post("/", async (req, res, next) => {
    try {
        const task = new Task({ title: req.body.title });
        const saved = await task.save();
        res.status(201).json({ message: "Task created", task: saved });
    } catch (error) {
        next(error);
    }
});
```

## 🔒 Production Ready Checklist

- [ ] Environment variables (.env file)
- [ ] Input validation & sanitization
- [ ] Authentication & authorization
- [ ] Rate limiting
- [ ] Database indexing
- [ ] Error tracking
- [ ] Logging system
- [ ] API documentation
- [ ] HTTPS/SSL
- [ ] Database backups

## 👨‍💼 Author

24CS059Aemi

## 📄 License

ISC

## 📚 References

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [REST API Best Practices](https://restfulapi.net/)
