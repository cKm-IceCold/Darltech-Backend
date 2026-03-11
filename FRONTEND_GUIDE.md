# DarlTech Academy - Frontend Data Collection Guide

This guide outlines exactly which fields the frontend application needs to collect from users to ensure the API functions correctly. Use this to build your forms, validation, and state management.

---

## 🔐 User Authentication

### 1. Registration (`POST /api/auth/register`)
**Purpose:** Creating a new user account.
| Dashboard Field | API Key | Type | Requirement | Notes |
|-----------------|---------|------|-------------|-------|
| Full Name | `name` | String | **Required** | At least 1 character |
| Email Address | `email` | String | **Required** | Must be a valid format |
| Password | `password` | String | **Required** | **Min 6 characters** |
| User Role | `role` | String | Optional | Options: `Student`, `Tutor`, `Admin` (default: `Student`) |

### 2. Login (`POST /api/auth/login`)
**Purpose:** Authenticating an existing user.
| Dashboard Field | API Key | Type | Requirement |
|-----------------|---------|------|-------------|
| Email Address | `email` | String | **Required** |
| Password | `password` | String | **Required** |

---

## 📚 Course & Content Management

### 3. Course Creation (`POST /api/courses`)
**Purpose:** Adding a new course to the platform.
| Dashboard Field | API Key | Type | Requirement | Notes |
|-----------------|---------|------|-------------|-------|
| Title | `title` | String | **Required** | Max 100 characters |
| Description | `description` | String | **Required** | Long-form text |
| Category | `category` | String | **Required** | **Dropdown Select only** (see specific list below) |
| Price | `price` | Number | Optional | Defaults to 0 (free) |
| Difficulty Level | `level` | String | Optional | Dropdown: `Beginner`, `Intermediate`, `Advanced` |
| Course Status | `status` | String | Optional | Options: `Draft`, `Published` (default: `Draft`) |

**Valid Categories (Case Sensitive):**
- `UI/UX Design`
- `Cybersecurity`
- `Frontend Development`
- `Backend Development`
- `Graphic Design`

---

## 📂 File Handling

### 6. File Upload (`POST /api/upload`)
**Purpose:** Uploading attachments or thumbnails.
| Input Element | API Key | Accepted Formats |
|---------------|---------|------------------|
| `type="file"` | `file` | `jpg`, `jpeg`, `png`, `pdf`, `mp4` |

---

## 🎓 Enrollments & Dashboards

### 7. Join Free Course (`POST /api/enrollments`)
**Purpose:** Enrolling a student in a free course.
- **Required Key:** `course` (ID of the course)

### 8. Fetch My Dashboard (`GET /api/enrollments/my-enrollments`)
- **Returns:** An array of active courses for the student.

---

## 💳 Payments (Paystack Integration)

### 9. Initialize Transaction (`POST /api/payments/initialize/:courseId`)
**Purpose:** Starting a payment for a paid course.
- **Backend Flow:** Returns a JSON object containing an `authorization_url`.
- **Frontend Action:** Redirect the user to this `authorization_url` so they can pay on the Paystack page.

### 10. Verify Transaction (`GET /api/payments/verify/:reference`)
**Purpose:** Confirming the payment was successful.
- **Implementation:** After the user is redirected back to your `callback_url`, take the `reference` from the URL and call this endpoint to unlock the course content for the student.

---

## 🚦 Error Handling & Security Interception

### 1. HTTP 401 Unauthorized
The user's session has expired. Redirect to `/login`.

### 2. HTTP 403 Forbidden
The user is not enrolled in the course or does not have permission for the action.

### 3. HTTP 429 Too Many Requests
**New Security Guard:** If a user (or bot) makes more than 100 requests in 15 minutes, they will be blocked.
- **Action:** Show a "Slow down, please wait a few minutes" message.

### 4. HTTP 422 Unprocessable Entity
Validation failed. Check the response body for field-specific errors.
