# DarlTech Academy - Security Documentation & Audit Report

This document outlines the security measures, architectural decisions, and defensive implementations built into the DarlTech Academy backend to protect user data and ensure platform integrity.

---

## 🔐 1. Authentication & Identity Management

### JWT-Based Stateless Auth
We use **JSON Web Tokens (JWT)** for secure, stateless authentication.
- **Lifespan:** Reduced to **7 days** (previously 30) for enhanced security.
- **Storage:** Frontend should store tokens in `HttpOnly` cookies (recommended) or securely in state.
- **Payload:** Tokens only contain the user ID, preventing sensitive data exposure in the decoded payload.

### Password Hashing
- **Algorithm:** `bcryptjs` with a salt factor of **10**.
- **Implementation:** Handled via Mongoose pre-save hooks in the `User` model. Raw passwords are never stored in the database.

---

## 🛡️ 2. Authorization & Access Control

### Role-Based Access Control (RBAC)
Strict endpoint-level authorization using the `authorize()` middleware.
- **Roles:** `Student`, `Tutor`, `Admin`.
- **Logic:** Tutors are restricted to modifying only courses, modules, or lessons they specifically created.

### Enrollment-Based Content Guard
A specialized `checkEnrollment` middleware protects learning materials.
- **Logic:** Students cannot access module or lesson data unless they have an `Active` enrollment record for the parent course.
- **Bypass:** Admins and the original Course Tutor bypass this check automatically.

---

## 🚀 3. Production Hardening (Sprint 6 Audit)

The following middleware layers are active on all `/api` routes:

### HTTP Header Security (Helmet)
- **Tool:** `helmet`
- **Purpose:** Sets headers like `X-Content-Type-Options`, `X-Frame-Options` (prevent clickjacking), and `Content-Security-Policy`.

### Rate Limiting (DDoS Protection)
- **Tool:** `express-rate-limit`
- **Limit:** 100 requests per 15 minutes per IP.
- **Impact:** Prevents brute-force login attempts and denial-of-service (DDoS) patterns.

### Data Sanitization (Injection Prevention)
- **NoSQL Injection:** `express-mongo-sanitize` strips out `$` and `.` characters from `req.body`, `req.query`, and `req.params`.
- **XSS (Cross-Site Scripting):** `xss-clean` sanitizes user input in the request body to prevent malicious script injection.

### HTTP Parameter Pollution (HPP)
- **Tool:** `hpp`
- **Purpose:** Prevents attackers from manipulating API behaviors by sending multiple parameters with the same name.

---

## 📂 4. Data & File Security

### Input Validation
- **Tool:** `express-validator`
- **Strictness:** Every creation and update endpoint has a strict schema. Unexpected fields are ignored; missing required fields trigger an automatic `400 Bad Request`.

### File Upload Restrictions
- **Tool:** `multer`
- **Filters:** Only specific MIME types are allowed (`image/jpeg`, `image/png`, `application/pdf`, `video/mp4`).
- **Storage:** Files are stored with unique timestamp suffixes to prevent overwriting existing assets.

### Body Size Limits
- **Constraint:** `express.json({ limit: '10kb' })`
- **Purpose:** Rejects excessively large JSON payloads to save memory and prevent buffer-overflow style attacks.

---

## 💳 5. Payment Security (Paystack)

### Server-Side Verification
- Handled in `paymentController.js`.
- **Logic:** The backend never trusts the "Success" message from the frontend. It makes a direct, server-to-server call to Paystack's API using the `PAYSTACK_SECRET_KEY` to verify every transaction reference before unlocking course content.

---

## 🛑 6. Error Handling

- **Middleware:** `errorMiddleware.js`
- **Production Mode:** In production, stack traces are hidden from users. They receive a clean JSON response with a helpful message, preventing "Information Leakage" where hackers could learn about the server's file structure or dependencies.

---

## 📋 7. Future Security Roadmap
- [ ] Implement **Redis-based** distributed rate limiting.
- [ ] Add **Two-Factor Authentication (2FA)** for Admin accounts.
- [ ] Migration to **S3/Cloudinary** for file storage with signed URLs.
