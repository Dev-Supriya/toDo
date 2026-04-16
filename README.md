# TaskFlow — Full Stack To-Do App

A clean, minimal task management app built with the MERN stack. Register an account, create tasks, attach files, and stay organized.

---

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

**Frontend**
- React.js (functional components + hooks)
- Axios (HTTP client)
- React Router v6
- Plain CSS

---

## Getting Started

### What you need installed
- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://www.mongodb.com) locally **or** a free MongoDB Atlas account

---

### Step 1 — Get the code

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### Step 2 — Configure the backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_here
```

> To generate a strong JWT secret, run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

Start the server:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected: ...
```

---

### Step 3 — Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

App opens at `http://localhost:3000`. API calls are proxied to `http://localhost:5000`.

---

## MongoDB Connection String

### Using MongoDB Atlas (recommended)

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. Go to **Database Access** → add a user with a password
4. Go to **Network Access** → add your IP (or `0.0.0.0/0` for dev)
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<password>` with your actual password and add a DB name:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
```

### Using Local MongoDB

Make sure `mongod` is running, then use:

```
MONGO_URI=mongodb://localhost:27017/taskflow
```

---

## Folder Structure

```
taskflow/
│
├── backend/
│   ├── config/
│   │   └── db.js                   # Database connection
│   ├── controllers/
│   │   ├── authController.js       # Register + Login
│   │   └── taskController.js       # Task CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT token guard
│   │   ├── errorMiddleware.js      # Global error handler
│   │   └── uploadMiddleware.js     # Multer configuration
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Task.js                 # Task schema
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   └── taskRoutes.js           # /api/tasks/*
│   ├── uploads/                    # Stored file attachments
│   ├── .env.example                # Environment variable template
│   ├── package.json
│   └── server.js                   # App entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── TaskCard.js
│   │   │   └── TaskForm.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── App.js                  # Routes + PrivateRoute
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/register     Create a new account
POST   /api/auth/login        Login and receive a token
```

**Register request body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "mypassword"
}
```

**Login request body:**
```json
{
  "email": "alice@example.com",
  "password": "mypassword"
}
```

Both return a JWT token and user object on success.

---

### Tasks

All task endpoints require the header:
```
Authorization: Bearer <your_token>
```

```
POST   /api/tasks             Create a task
GET    /api/tasks             Get all your tasks
PUT    /api/tasks/:id         Update a task
DELETE /api/tasks/:id         Delete a task
```

Tasks are created using `multipart/form-data` to support file attachments.

| Field        | Type   | Required | Notes                             |
|--------------|--------|----------|-----------------------------------|
| title        | string | Yes      | Max 100 characters                |
| description  | string | No       | Max 500 characters                |
| status       | string | No       | `pending` or `completed`          |
| attachment   | file   | No       | JPEG, PNG, GIF, or PDF — max 5 MB |

---

## Features

**Authentication**
- Register with name, email, and password
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Automatic logout when token expires

**Task Management**
- Create tasks with a title, description, and optional file
- View all tasks sorted by newest first
- Edit any task inline — title, description, or attachment
- Toggle status between pending and completed
- Delete tasks (attachment file is removed from disk too)

**Dashboard**
- Stats bar showing total, pending, and completed counts
- Filter tasks by All / Pending / Completed
- Loading spinner while fetching
- Empty state messages

**File Uploads**
- Accepts images (JPEG, PNG, GIF) and PDF files
- Max file size: 5 MB
- Files served at `http://localhost:5000/uploads/<filename>`
- Replacing a file automatically deletes the old one

---

## Environment Variables Reference

| Variable     | Required | Description                              |
|--------------|----------|------------------------------------------|
| `PORT`       | No       | Server port (default: 5000)              |
| `MONGO_URI`  | Yes      | MongoDB connection string                |
| `JWT_SECRET` | Yes      | Secret for signing tokens (keep private) |

---

## Sample `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster0.abc.mongodb.net/taskflow
JWT_SECRET=3770559d44980d25ed0508395a71ef6f141ab8658f821dcb24571...
```

---

## Troubleshooting

**Cannot connect to MongoDB**
Check that your IP is whitelisted in Atlas Network Access, and that the username/password in the URI are correct.

**401 Unauthorized on task requests**
Your token may have expired. Log out and sign in again to get a fresh one.

**File upload rejected**
Only JPEG, PNG, GIF, and PDF files are accepted. Verify the file type and that it is under 5 MB.

**Frontend shows blank page**
Make sure both the backend (`port 5000`) and frontend (`port 3000`) servers are running at the same time.

---

## License

MIT
