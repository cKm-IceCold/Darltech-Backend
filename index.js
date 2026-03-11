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

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
