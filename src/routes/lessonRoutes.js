const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createLesson,
    getLessons,
    getLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { checkEnrollment } = require('../middleware/enrollmentMiddleware');

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management endpoints
 */

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons for a module
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: module
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID to get lessons for
 *     responses:
 *       200:
 *         description: List of lessons
 *       400:
 *         description: Missing module ID
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get a single lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson details
 *       404:
 *         description: Lesson not found
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson for a module
 *     tags: [Lessons]
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
 *               - module
 *             properties:
 *               title:
 *                 type: string
 *                 example: Understanding Firewalls
 *               content:
 *                 type: string
 *                 example: "In this lesson we will cover..."
 *               videoUrl:
 *                 type: string
 *                 example: https://youtube.com/watch?v=example
 *               resources:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
 *               order:
 *                 type: number
 *                 example: 1
 *               module:
 *                 type: string
 *                 description: The Module ID this lesson belongs to
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       401:
 *         description: Not authorized
 *         description: Not authorized
 *       403:
 *         description: Forbidden (Not enrolled)
 *       404:
 *         description: Module not found
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
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
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               resources:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Lesson not found
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
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
 *         description: Lesson deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Lesson not found
 */

// Protected access routines (Must be enrolled or own the course)
router.get('/', protect, checkEnrollment, getLessons);
router.get('/:id', protect, checkEnrollment, getLesson);

// Protected routes (Admin & Tutor only)
router.post(
    '/',
    protect,
    authorize('Admin', 'Tutor'),
    [
        body('title').notEmpty().withMessage('Lesson title is required'),
        body('module').notEmpty().withMessage('Module ID is required'),
    ],
    validate,
    createLesson
);

router.put('/:id', protect, authorize('Admin', 'Tutor'), updateLesson);
router.delete('/:id', protect, authorize('Admin', 'Tutor'), deleteLesson);

module.exports = router;
