# DarlTech Academy - Backend API

This is the backend (server-side) of **DarlTech Academy**, an online learning platform where students can enroll in tech courses, learn through structured modules and lessons, and grow their skills.

Built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Sprints Overview

### ✅ Sprint 1: Project Setup & Authentication
Foundation for a secure, role-based backend (JWT, RBAC).

### ✅ Sprint 2: Course Management
Blueprints and APIs for Courses, Modules (chapters), and Lessons.

### ✅ Sprint 3: Enrollment & Access Control
Logic for students to join courses and security guards to protect content.

### ⏸️ Sprint 4 & 5: (Paused)
Quizzes, Assignments, and Internship tracking features are currently in queue.

### ✅ Sprint 6: Payments & Security Polish
Integrated **Paystack** for course purchases and implemented a **Production-Grade Security Audit**.

---

## 🛡️ Security Implementation (Sprint 6)

We have implemented the following security measures to protect the platform:

1.  **Helmet:** Sets various HTTP headers to prevent common attacks like Clickjacking and XSS.
2.  **Rate Limiting:** Prevents brute-force and DDoS attacks by limiting requests from a single IP.
3.  **Mongo Sanitize:** Strips out dangerous `$` and `.` characters from user input to prevent NoSQL injection.
4.  **XSS Protection:** Cleans user-provided data to prevent malicious scripts from running in browsers.
5.  **HPP (HTTP Parameter Pollution):** Prevents attackers from manipulating API parameters.
6.  **CORS Protection:** Restricted access to authorized domains.

---

## 💳 Payments Integration (Paystack)

Students can now purchase paid courses using Paystack. 
1.  **Initialize:** Frontend calls the initialize API to get a Paystack checkout URL.
2.  **Checkout:** Student pays on Paystack.
3.  **Verify:** Frontend redirects to a verification page which calls the backend to confirm payment and unlock the course.

---

## 🛠️ How to Set Up the Project

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Variables (`.env`)
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri

# Paystack Configuration
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_CALLBACK_URL=http://localhost:3000/payment/callback
```

### Step 3: Start the Server
```bash
npm run dev
```

---

## 📖 All Available Endpoints

👉 **Check live docs at: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)**

#### 🔐 Authentication
| Method | Endpoint | What It Does |
|--------|----------|--------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and get your token |
| GET | `/api/auth/profile` | View your own profile |

#### 📚 Courses, Modules & Lessons
| Method | Endpoint | What It Does |
|--------|----------|--------------|
| GET | `/api/courses` | Browse all courses |
| GET | `/api/courses/:id` | View a single course |
| GET | `/api/modules?course=...` | Get chapters for a course |
| GET | `/api/lessons?module=...` | Get topics for a chapter |

#### 📂 File & Enrollment
| Method | Endpoint | What It Does |
|--------|----------|--------------|
| POST | `/api/upload` | Upload Images/PDFs/Videos |
| POST | `/api/enrollments` | Enroll in a course |
| GET | `/api/enrollments/my-enrollments` | Your active courses |

#### 💳 Payments (Paystack)
| Method | Endpoint | What It Does |
|--------|----------|--------------|
| POST | `/api/payments/initialize/:courseId` | Get Paystack checkout URL |
| GET | `/api/payments/verify/:reference` | Verify payment & unlock course |

---

## 📂 Project Structure

```
/backend
├── .env                          # Secret configuration
├── index.js                      # Application entry point
└── src/
    ├── controllers/
    │   ├── authController.js     # Signup/Login
    │   ├── courseController.js   # Content Management
    │   ├── enrollmentController.js # Student progress
    │   └── paymentController.js  # Paystack integration [NEW]
    ├── middleware/
    │   ├── authMiddleware.js     # JWT check
    │   ├── enrollmentMiddleware.js # Access guard
    │   └── errorMiddleware.js    # Error handler
    ├── models/
    │   ├── User.js               # Roles: Student, Tutor, Admin
    │   ├── Course.js             # Price & Category logic
    │   ├── Enrollment.js         # Student ledger
    │   └── Payment.js            # Transaction history [NEW]
    └── routes/
        ├── authRoutes.js
        ├── enrollmentRoutes.js
        └── paymentRoutes.js      # Checkout endpoints [NEW]
```
