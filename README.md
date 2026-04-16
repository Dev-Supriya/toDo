# Full Stack To-Do Application

A production-ready MVP To-Do app built with Node.js, Express, MongoDB, React, and JWT authentication.

---

## Project Structure

```
todo-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register / Login logic
│   │   └── taskController.js      # CRUD task logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── errorMiddleware.js     # Global error handler
│   │   └── uploadMiddleware.js    # Multer file upload config
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt hashing)
│   │   └── Task.js                # Task schema
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/auth/register|login
│   │   └── taskRoutes.js          # CRUD /api/tasks
│   ├── uploads/                   # Uploaded files stored here
│   ├── .env                       # Environment variables (not committed)
│   ├── .env.example               # Sample env file
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.js          # Top navigation bar
│   │   │   ├── TaskCard.js        # Individual task (view + edit inline)
│   │   │   └── TaskForm.js        # New task creation form
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Register page
│   │   │   └── Dashboard.js       # Main task dashboard
│   │   ├── App.js                 # Router + private route guard
│   │   ├── index.js               # React entry point
│   │   └── index.css              # All styles
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+ installed
- MongoDB running locally **or** a MongoDB Atlas account
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from the example):

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=replace_with_a_long_random_secret
```

Start the backend:

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The API will run at `http://localhost:5000`.

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The React app will open at `http://localhost:3000` and proxy API calls to `http://localhost:5000`.

---

### 4. MongoDB Setup

#### Option A — Local MongoDB

Install MongoDB Community Edition from https://www.mongodb.com/try/download/community and start it:

```bash
mongod --dbpath /data/db
```

Use this connection string in `.env`:

```
MONGO_URI=mongodb://localhost:27017/todo_app
```

#### Option B — MongoDB Atlas (Cloud, Free Tier)

1. Go to https://cloud.mongodb.com and create a free account.
2. Create a free **M0** cluster.
3. Under **Database Access**, add a user with a password.
4. Under **Network Access**, allow your IP (or `0.0.0.0/0` for development).
5. Click **Connect → Drivers** and copy the connection string.
6. Paste it into `.env`:

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/todo_app?retryWrites=true&w=majority
```

---

## Environment Variables

| Variable     | Description                              | Example                                    |
|--------------|------------------------------------------|--------------------------------------------|
| `PORT`       | Port the backend server listens on       | `5000`                                     |
| `MONGO_URI`  | MongoDB connection string                | `mongodb://localhost:27017/todo_app`        |
| `JWT_SECRET` | Secret key for signing JWTs             | `my_super_secret_key_123`                  |

> **Security note:** Never commit `.env` to version control. Add it to `.gitignore`.

---

## API Reference

### Auth Routes

| Method | Endpoint              | Description       | Auth Required |
|--------|-----------------------|-------------------|---------------|
| POST   | `/api/auth/register`  | Register new user | No            |
| POST   | `/api/auth/login`     | Login user        | No            |

**Register body:**
```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "alice@example.com", "password": "secret123" }
```

Both return: `{ token, user: { id, name, email } }`

---

### Task Routes

All task routes require the `Authorization: Bearer <token>` header.

| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| POST   | `/api/tasks`      | Create a task (multipart/form-data) |
| GET    | `/api/tasks`      | Get all tasks for current user |
| PUT    | `/api/tasks/:id`  | Update a task                  |
| DELETE | `/api/tasks/:id`  | Delete a task                  |

**Create / Update fields (form-data):**

| Field        | Type   | Required | Description                        |
|--------------|--------|----------|------------------------------------|
| `title`      | string | Yes      | Task title                         |
| `description`| string | No       | Task details                       |
| `status`     | string | No       | `pending` or `completed`           |
| `attachment` | file   | No       | Image (jpeg/png/gif) or PDF, max 5 MB |

---

## Features Overview

### Authentication
- Secure registration with bcrypt password hashing (salt rounds: 10)
- JWT tokens valid for 7 days
- Automatic logout on token expiry (via Axios interceptor)
- Protected routes on both backend (middleware) and frontend (PrivateRoute)

### Task Management
- Create tasks with title, description, and optional file attachment
- View all tasks sorted by newest first
- Edit task title, description, and replace attachment inline
- Mark tasks as completed / revert to pending
- Delete tasks (also removes uploaded file from disk)
- Filter tasks by All / Pending / Completed
- Task stats bar (total, pending, completed counts)

### File Uploads
- Handled with Multer (local disk storage)
- Allowed types: JPEG, PNG, GIF, PDF
- Max file size: 5 MB
- Files stored in `backend/uploads/` with unique filenames
- Old file automatically deleted when a new one is uploaded for the same task
- Attachments served statically at `http://localhost:5000/uploads/<filename>`

---

## Dependencies

### Backend

| Package       | Purpose                                      |
|---------------|----------------------------------------------|
| `express`     | Web framework                                |
| `mongoose`    | MongoDB ODM                                  |
| `bcryptjs`    | Password hashing                             |
| `jsonwebtoken`| JWT creation and verification                |
| `multer`      | Multipart form-data / file upload handling   |
| `cors`        | Cross-origin resource sharing                |
| `dotenv`      | Environment variable loading                 |
| `nodemon`     | Auto-restart on file changes (dev only)      |

### Frontend

| Package           | Purpose                                  |
|-------------------|------------------------------------------|
| `react`           | UI library                               |
| `react-dom`       | React DOM renderer                       |
| `react-router-dom`| Client-side routing                      |
| `axios`           | HTTP client with interceptors            |
| `react-scripts`   | CRA build tooling                        |

---

## Common Issues

**CORS errors** — Make sure both servers are running and the frontend proxy in `package.json` points to `http://localhost:5000`.

**MongoDB connection refused** — Ensure `mongod` is running, or check your Atlas connection string and network whitelist.

**`multer` file type error** — Only JPEG, PNG, GIF, and PDF files are accepted. Check the file extension and MIME type.

**JWT invalid / expired** — Logging out and back in generates a fresh token. Tokens expire after 7 days.
