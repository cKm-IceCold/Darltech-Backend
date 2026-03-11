require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Default Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Darltech Academy API" });
});

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Course Routes
const courseRoutes = require('./src/routes/courseRoutes');
app.use('/api/courses', courseRoutes);

// Module Routes
const moduleRoutes = require('./src/routes/moduleRoutes');
app.use('/api/modules', moduleRoutes);

// Lesson Routes
const lessonRoutes = require('./src/routes/lessonRoutes');
app.use('/api/lessons', lessonRoutes);

// Upload Routes
const uploadRoutes = require('./src/routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// Enrollment Routes
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
app.use('/api/enrollments', enrollmentRoutes);

// Make uploads folder static so files can be accessed via URL
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
