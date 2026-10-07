# Employee Management System

A full-stack CRUD web application for managing employee records, built with **React (Vite)** on the frontend and **Node.js (Express & MySQL)** on the backend.

---

## 🚀 Features

- **Employee Directory**: View all registered employees with real-time updates.
- **Add New Employee**: Create employee entries with name, role, email, and phone number.
- **Update Employee**: Edit existing employee information with prefilled form inputs.
- **Delete Employee**: Remove employees from the database.
- **Health Check Endpoint**: Monitor backend and database connection status.
- **Responsive UI**: Clean, mobile-friendly interface styled with custom CSS.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS
- **Backend**: Node.js, Express 5, MySQL2 (`mysql2/promise`), dotenv, CORS
- **Database**: MySQL

---

## 📁 Project Structure

```text
My_project/
├── backend/
│   ├── config/
│   │   └── db.js               # MySQL database connection pool
│   ├── controllers/
│   │   └── employeeControllers.js # Business logic for CRUD endpoints
│   ├── models/
│   │   └── employeeModels.js   # MySQL query functions
│   ├── routes/
│   │   └── employeeRoutes.js   # Express API routes
│   ├── .env                    # Environment variables (ignored by Git)
│   ├── package.json
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.jsx      # Header component
│   │   ├── App.css             # Component styling
│   │   ├── App.jsx             # Main CRUD dashboard component
│   │   └── main.jsx            # React root entry
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

### 1. Database Setup

Create a MySQL database and table:

```sql
CREATE DATABASE IF NOT EXISTS employee_directory;
USE employee_directory;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=employee_directory
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend server runs at `http://localhost:5000`.

### 3. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend app runs at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check API & database connection status |
| `GET` | `/api/employees` | Retrieve all employees |
| `POST` | `/api/employees` | Add a new employee |
| `PUT` | `/api/employees/:id` | Update an existing employee |
| `DELETE` | `/api/employees/:id` | Remove an employee |

---

## 📄 License

ISC License
