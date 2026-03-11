# DarlTech Academy LMS - Technical Architecture & Developer Guide

## 1. System Overview
DarlTech Academy is a monolithic, RESTful backend Node.js application built using the Express web framework.

## 2. Technology Stack (Updated)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Managed via Mongoose)
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, xss-clean, hpp
- **Authentication:** JWT (7-day lifespan)
- **Payment:** Paystack (axios for server-side verification)
- **API Docs:** Swagger UI

## 3. Security Architecture (Sprint 6 Audit)
The following middleware layers have been implemented for production-grade security:
- **Helmet:** Headers for CSP, XSS protection, and frameguard.
- **Rate Limiting:** Global limiter set to 100 requests per 15 minutes per IP.
- **Sanitization:** Strict prevention of NoSQL Injection using `mongo-sanitize` and XSS attacks using `xss-clean`.
- **Parameter Pollution:** `hpp` protects against multiple parameters of the same name.
- **Data Size Limit:** Body parser restricted to 10KB to prevent payload-based DDoS.

## 4. Payment Architecture (Paystack)
The payment flow relies on server-side initialization and verification:
- `POST /api/payments/initialize/:courseId`: 
  - Validates user and course existence.
  - Generates a unique 12-byte hex reference.
  - Requests an `authorization_url` from Paystack.
- `GET /api/payments/verify/:reference`:
  - Verifies the transaction reference directly with Paystack’s API.
  - On success, atomically updates the `Payment` ledger and creates an `Enrollment` record.

## 5. Database Schema
### 5.1 Enrollment (Sprint 3)
Tracks student-course relationships with a compound unique index on `{ user, course }`.

### 5.2 Payment (Sprint 6)
Stores transaction references, status, and audit timestamps.

## 6. Development Status
- ✅ **Sprint 1:** Auth & Foundation
- ✅ **Sprint 2:** Course Infrastructure
- ✅ **Sprint 3:** Enrollment Logic
- ⏸️ **Sprint 4 & 5:** (Paused)
- ✅ **Sprint 6:** Payments & Security [STABLE]

## 7. Configuration
Requires the following environment variables:
- `PAYSTACK_SECRET_KEY`: Private key from Paystack dashboard.
- `FRONTEND_URL`: For CORS restriction.
- `MONGO_URI`: Atlas or local MongoDB connection string.
