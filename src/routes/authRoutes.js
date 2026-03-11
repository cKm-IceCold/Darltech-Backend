const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Tutor, Student]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       422:
 *         description: Validation error
 */
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the current logged in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Not authorized
 */
router.get('/profile', protect, getProfile);

module.exports = router;
