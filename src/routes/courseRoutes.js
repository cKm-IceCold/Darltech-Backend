const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [UI/UX Design, Cybersecurity, Frontend Development, Backend Development, Graphic Design]
 *         description: Filter courses by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *         description: Filter courses by difficulty level
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Published]
 *         description: Filter courses by status
 *     responses:
 *       200:
 *         description: List of courses
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a single course with its modules and lessons
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
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
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Cybersecurity
 *               description:
 *                 type: string
 *                 example: Learn the fundamentals of cybersecurity
 *               category:
 *                 type: string
 *                 enum: [UI/UX Design, Cybersecurity, Frontend Development, Backend Development, Graphic Design]
 *               price:
 *                 type: number
 *                 example: 0
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - role not allowed
 *       422:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               level:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       403:
 *         description: Not authorized to update this course
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Not authorized to delete this course
 *       404:
 *         description: Course not found
 */

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes (Admin & Tutor only)
router.post(
    '/',
    protect,
    authorize('Admin', 'Tutor'),
    [
        body('title').notEmpty().withMessage('Course title is required'),
        body('description').notEmpty().withMessage('Course description is required'),
        body('category')
            .notEmpty().withMessage('Category is required')
            .isIn(['UI/UX Design', 'Cybersecurity', 'Frontend Development', 'Backend Development', 'Graphic Design'])
            .withMessage('Invalid course category'),
    ],
    validate,
    createCourse
);

router.put('/:id', protect, authorize('Admin', 'Tutor'), updateCourse);
router.delete('/:id', protect, authorize('Admin', 'Tutor'), deleteCourse);

module.exports = router;
