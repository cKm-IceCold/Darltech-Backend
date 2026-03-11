const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createModule,
    getModules,
    getModule,
    updateModule,
    deleteModule
} = require('../controllers/moduleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { checkEnrollment } = require('../middleware/enrollmentMiddleware');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Course module management endpoints
 */

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all modules for a course
 *     tags: [Modules]
 *     parameters:
 *       - in: query
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to get modules for
 *     responses:
 *       200:
 *         description: List of modules
 *       400:
 *         description: Missing course ID
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get a single module with its lessons
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module details with lessons
 *       404:
 *         description: Module not found
 */

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create a new module for a course
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - course
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Network Security
 *               order:
 *                 type: number
 *                 example: 1
 *               course:
 *                 type: string
 *                 description: The Course ID this module belongs to
 *     responses:
 *       201:
 *         description: Module created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update a module
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Module not found
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Module not found
 */

// Protected access routines (Must be enrolled or own the course)
router.get('/', protect, checkEnrollment, getModules);
router.get('/:id', protect, checkEnrollment, getModule);

// Protected routes (Admin & Tutor only)
router.post(
    '/',
    protect,
    authorize('Admin', 'Tutor'),
    [
        body('title').notEmpty().withMessage('Module title is required'),
        body('course').notEmpty().withMessage('Course ID is required'),
    ],
    validate,
    createModule
);

router.put('/:id', protect, authorize('Admin', 'Tutor'), updateModule);
router.delete('/:id', protect, authorize('Admin', 'Tutor'), deleteModule);

module.exports = router;
