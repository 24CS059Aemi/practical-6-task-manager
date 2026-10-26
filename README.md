# 📋 Practical 6 - Task Manager (Full-Stack)

Complete MERN-like application with React frontend, Express backend, and MongoDB database.

## Practical 12: GitHub Actions CI

[![CI Pipeline](https://github.com/24CS059Aemi/practical-6-task-manager/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/24CS059Aemi/practical-6-task-manager/actions/workflows/ci.yml)

The workflow runs backend tests and frontend lint/build on pushes and pull requests targeting `main`. See [CI_PIPELINE.md](./CI_PIPELINE.md) for workflow details and instructions to capture successful and intentionally failing test runs safely on a temporary branch.

## Practical 11: Docker Compose

The application runs as a three-service Docker Compose stack. See [CONTAINERIZATION.md](./CONTAINERIZATION.md) for setup, startup, verification, and suggested lab screenshots.

---

## 📁 Project Structure

```
Practical-6-Task-Manager/
├── TaskManagerAPI/                    (Backend - Express.js)
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── app.js                         (Main server file)
│   ├── package.json
│   └── package-lock.json
│
└── task-manager-frontend/             (Frontend - React + Vite)
    ├── src/
    │   ├── App.jsx                    (Main React component)
    │   ├── App.css                    (Styling)
    │   └── main.jsx
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── README.md
```

---

## 🚀 Quick Start

### **Terminal 1: Start Backend**
```powershell
cd "c:\Users\smitp\Practical-6-Task-Manager\TaskManagerAPI"
npm install      # (If not already installed)
node app.js
```

**Expected Output:**
```
MongoDB connected successfully
Server running at http://localhost:5000
```

### **Terminal 2: Start Frontend**
```powershell
cd "c:\Users\smitp\Practical-6-Task-Manager\task-manager-frontend"
npm install      # (If not already installed)
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

### **Browser**
```
Open: http://localhost:5173
```

---

## 📊 Technology Stack

| Layer | Technology | Port |
|-------|-----------|------|
| **Frontend** | React + Vite | 5173 |
| **Backend** | Express.js + Mongoose | 5000 |
| **Database** | MongoDB (Local) | 27017 |

---

## ✨ Features

### **Backend (TaskManagerAPI)**
- ✅ Express server on port 5000
- ✅ CORS enabled for frontend communication
- ✅ MongoDB connection with Mongoose
- ✅ RESTful API with 4 endpoints
- ✅ Error handling middleware
- ✅ Request logging

### **Frontend (task-manager-frontend)**
- ✅ React component with Vite
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Optimistic UI updates
- ✅ Error handling with user feedback
- ✅ Loading states
- ✅ Success messages
- ✅ Responsive CSS styling

### **Database (MongoDB)**
- ✅ Local MongoDB connection
- ✅ Task collection with schema validation
- ✅ Persistent data storage
- ✅ Document-based storage

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/tasks` | Fetch all tasks |
| `POST` | `/tasks` | Create new task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |

---

## 📝 Task Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  completed: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing Workflow

### **Step 1: Read** (GET)
- Page loads
- Tasks fetch from MongoDB
- Display in list

### **Step 2: Create** (POST)
- Enter task title and description
- Click "Add Task"
- Task appears instantly (optimistic update)
- Server confirms, persists to MongoDB

### **Step 3: Update** (PUT)
- Click "Update" button
- Prompts for new title/description
- MongoDB updates, UI refreshes

### **Step 4: Delete** (DELETE)
- Click "Delete" button
- Confirmation dialog
- Task removed from MongoDB and UI

### **Step 5: Persistence** (Refresh Test)
- Create a task
- Press Ctrl+R (refresh)
- Task still appears (MongoDB storage confirmed)

### **Step 6: Error Handling**
- Stop backend (Ctrl+C in Terminal 1)
- Try to add task in React
- Error message displays
- Restart backend
- Application recovers

---

## 🔧 Development Commands

### **Backend**
```powershell
# Start server
node app.js

# With nodemon (auto-restart on changes)
npx nodemon app.js

# Install dependencies
npm install
```

### **Frontend**
```powershell
# Start development server
npm run dev

# Build for production
npm build

# Preview production build
npm preview

# Install dependencies
npm install
```

---

## 📋 Configuration Files

### **Backend: app.js**
```javascript
const PORT = 5000;
const MONGODB_URI = "mongodb://localhost:27017/taskdb_practical5";
```

### **Frontend: App.jsx**
```javascript
const API_URL = "http://localhost:5000/tasks";
```

---

## 🐛 Troubleshooting

### **Issue: "Failed to fetch tasks"**
- **Solution:** Ensure backend is running on port 5000
- **Check:** `node app.js` outputs "Server running at http://localhost:5000"

### **Issue: "MongoDB connection failed"**
- **Solution:** Ensure MongoDB is running locally
- **Check:** `mongosh` or check Services

### **Issue: CORS error in browser console**
- **Solution:** Backend CORS is enabled in `app.js`
- **Check:** `app.use(cors())` is present

### **Issue: Form inputs not appearing**
- **Solution:** Vite dev server needs refresh
- **Fix:** Hard refresh (Ctrl+Shift+R)

---

## 📚 Learning Outcomes

After completing this practical, you'll understand:

✅ **Frontend-Backend Communication** - How React talks to Express via HTTP  
✅ **CRUD Operations** - All four database operations  
✅ **State Management** - React hooks (useState, useEffect)  
✅ **Asynchronous Programming** - Async/await with fetch API  
✅ **Error Handling** - Try/catch, user feedback, rollback  
✅ **Optimistic UI** - Updating UI before server confirmation  
✅ **Persistence** - Data survives page refresh (MongoDB)  
✅ **Full-Stack Architecture** - How all layers work together  

---

## 📖 File Explanations

### **TaskManagerAPI/app.js**
Main backend server file. Imports routes, middleware, connects to MongoDB.

### **TaskManagerAPI/middleware/errorHandler.js**
Global error handling middleware. Catches exceptions and returns error responses.

### **TaskManagerAPI/middleware/logger.js**
Request logging middleware. Logs incoming requests to console.

### **TaskManagerAPI/models/Task.js**
Mongoose schema for Task collection. Defines structure and validation.

### **TaskManagerAPI/routes/taskRoutes.js**
Express routes for all CRUD operations. Handles GET, POST, PUT, DELETE requests.

### **task-manager-frontend/src/App.jsx**
Main React component. Contains all state, handlers, and JSX for UI.

### **task-manager-frontend/src/App.css**
Styling for the entire application. Container, form, buttons, task cards.

---

## 🎯 Practical 6 Requirements Met

✅ Backend runs on localhost:5000  
✅ Frontend runs on localhost:5173  
✅ CORS enabled for cross-origin requests  
✅ MongoDB persistence verified  
✅ All CRUD operations functional  
✅ Optimistic UI updates implemented  
✅ Error handling for all operations  
✅ Loading and success messages displayed  
✅ Data persists after page refresh  
✅ Application recovers after backend restart  

---

## 🎬 Demo Instructions

See: `DEMO_DATA_TASKS.md` for complete demo workflow with sample data.

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify both servers are running
3. Check browser console (F12) for errors
4. Ensure MongoDB is running locally

---

**Created:** August 31, 2026  
**Status:** ✅ Complete and Ready for Demonstration
