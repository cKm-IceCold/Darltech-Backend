const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    enrollCourse,
    getMyEnrollments,
    checkEnrollment,
    getCourseStudents
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Student course enrollment endpoints
 */

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll a student into a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *             properties:
 *               course:
 *                 type: string
 *                 description: ID of the course to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled
 *       400:
 *         description: Already enrolled or course missing
 *       404:
 *         description: Course not found
 */
router.post(
    '/',
    protect,
    authorize('Student', 'Admin'), // Admin can also enroll for testing if needed
    [
        body('course').notEmpty().withMessage('Course ID is required')
    ],
    validate,
    enrollCourse
);

/**
 * @swagger
 * /api/enrollments/my-enrollments:
 *   get:
 *     summary: Get all courses the logged-in user is enrolled in
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active enrollments
 */
router.get('/my-enrollments', protect, getMyEnrollments);

/**
 * @swagger
 * /api/enrollments/check/{courseId}:
 *   get:
 *     summary: Check if the logged-in user is enrolled in a specific course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment status (boolean)
 */
router.get('/check/:courseId', protect, checkEnrollment);

/**
 * @swagger
 * /api/enrollments/course/{courseId}:
 *   get:
 *     summary: Get all students enrolled in a specific course (Admin/Tutor only)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of students
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.get(
    '/course/:courseId',
    protect,
    authorize('Admin', 'Tutor'),
    getCourseStudents
);

module.exports = router;
