# Student Database Management System

A full-stack CRUD application to manage student records, built with **React**, **Express**, **MongoDB Atlas** (cloud), and **Redis** caching.

---

## Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React 18 + Vite    |
| Backend   | Node.js + Express  |
| Database  | MongoDB Atlas      |
| Caching   | Redis (ioredis)    |

---

## Features

- **Add** new students with unique Student ID validation
- **View** all students (served from Redis cache when available)
- **Search** students by name, ID, class, section, or phone
- **Update** student details via inline edit
- **Delete** student records with confirmation
- **Redis caching** — cache TTL of 5 minutes, auto-invalidated on any CUD operation
- **Single deploy** — one `npm start` serves both API and frontend
- **No page reloads** — all interactions via Axios API calls
- **Responsive** — works on mobile and desktop

---

## Project Structure

```
student-dbms/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StudentForm.jsx      # Add / Edit form
│   │   │   ├── StudentList.jsx      # List + Search
│   │   │   └── StudentCard.jsx      # Individual card
│   │   ├── services/
│   │   │   └── api.js               # Axios API calls
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   └── redis.js                 # Redis client
│   ├── models/
│   │   └── Student.js               # Mongoose schema
│   ├── controllers/
│   │   └── studentController.js     # CRUD + Redis logic
│   ├── routes/
│   │   └── studentRoutes.js         # API routes
│   └── server.js                    # Entry point
├── .env                             # Environment variables (not committed)
├── .env.example                     # Template
├── .gitignore
├── package.json                     # Root scripts
└── README.md
```

---

## Prerequisites

1. **Node.js** ≥ 18
2. **MongoDB Atlas** cluster — [create free cluster](https://www.mongodb.com/cloud/atlas)
3. **Redis** — local install or [Redis Cloud](https://redis.com/try-free/)

---

## Setup & Run

### 1. Clone & Install

```bash
cd student-dbms
npm run setup        # installs root + client deps, builds frontend
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/studentDB?retryWrites=true&w=majority
REDIS_URL=redis://127.0.0.1:6379
PORT=5000
```

### 3. Start

```bash
# Production (serves built React app)
npm start

# Development (hot-reload for both client & server)
npm run dev
```

Open **http://localhost:5000** (production) or **http://localhost:3000** (dev).

---

## API Endpoints

| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| GET    | `/api/students`           | Get all students        |
| GET    | `/api/students/search?q=` | Search students         |
| POST   | `/api/students`           | Add a student           |
| PUT    | `/api/students/:id`       | Update a student        |
| DELETE | `/api/students/:id`       | Delete a student        |

---

## Redis Caching Strategy

1. **GET /api/students** → Check Redis (`students:all`). If cached, return immediately. If not, query MongoDB, store result in Redis with **300 s TTL**.
2. **POST / PUT / DELETE** → After DB operation, delete the `students:all` Redis key to invalidate cache.

---

## Student Schema

| Field     | Type   | Constraints          |
|-----------|--------|----------------------|
| name      | String | Required             |
| studentId | String | Required, **Unique** |
| className | String | Required             |
| section   | String | Required             |
| phone     | String | Required             |

---
