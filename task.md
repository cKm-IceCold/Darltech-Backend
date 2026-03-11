# Darltech Academy Backend Task List

## Sprint 1: Core Foundation & Authentication [x]
- [x] Initialize project structure (Controllers, Services, Models, Routes, Middleware, Config)
- [x] Setup MongoDB connection and environment configuration
- [x] Implement User Model with roles (Admin, Tutor, Student)
- [x] Develop Signup and Login API with JWT authentication
- [x] Implement Role-based access control (RBAC) middleware
- [x] Add basic error handling and validation middleware

## Sprint 2: Course Management [x]
- [x] Design Course, Module, and Lesson schemas
- [x] Implement CRUD APIs for Courses (Restricted to Admin/Tutor)
- [x] Implement CRUD APIs for Modules and Lessons
- [x] Setup file upload handling for course materials

## Sprint 3: Enrollment & Access Control [x]
- [x] Implement Course Enrollment logic
- [x] Develop Access Control middleware for course content
- [x] Create Student Dashboard APIs (Enrolled courses, progress)

## Sprint 4: Quizzes & Assignments [PAUSED]
- [ ] Design Quiz and Question schemas
- [ ] Implement Quiz taking and automatic scoring logic
- [ ] Design Assignment schema and submission handling
- [ ] Develop Tutor dashboard for assignment grading

## Sprint 5: Internship & Capstone Tracking [PAUSED]
- [ ] Implement Internship tracking system
- [ ] Develop Capstone project submission and review workflow

## Sprint 6: Payments & Security Polish [x]
- [x] Integrate Payment Gateway (Paystack)
- [x] Final security audit (Helmet, Rate Limiting, Sanitization, HPP)
- [ ] Performance optimization (Caching)
