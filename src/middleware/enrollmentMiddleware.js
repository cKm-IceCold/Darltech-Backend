const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

/**
 * Middleware to check if a student is enrolled in a course.
 * Used for protecting Lesson and Module view endpoints.
 * Admin and the Course Tutor are always allowed.
 */
const checkEnrollment = async (req, res, next) => {
    try {
        let courseId = req.params.courseId || req.query.course;

        // If hitting a Module or Lesson route by ID, we must find the parent course
        if (!courseId && req.params.id) {
            // Determine if the URL contains "modules" or "lessons"
            if (req.originalUrl.includes('/modules/')) {
                const moduleDoc = await Module.findById(req.params.id);
                if (!moduleDoc) return res.status(404).json({ message: 'Module not found' });
                courseId = moduleDoc.course;
            } else if (req.originalUrl.includes('/lessons/')) {
                const lessonDoc = await Lesson.findById(req.params.id);
                if (!lessonDoc) return res.status(404).json({ message: 'Lesson not found' });
                const moduleDoc = await Module.findById(lessonDoc.module);
                if (!moduleDoc) return res.status(404).json({ message: 'Module not found' });
                courseId = moduleDoc.course;
            }
        }

        if (!courseId) {
            res.status(400);
            throw new Error('Course ID could not be determined for access check');
        }

        // 1. Admins have universal access
        if (req.user.role === 'Admin') {
            return next();
        }

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // 2. The Tutor who created the course has access
        if (req.user.role === 'Tutor' && course.tutor.toString() === req.user._id.toString()) {
            return next();
        }

        // 3. Students must be actively enrolled
        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: courseId,
            status: 'Active'
        });

        if (!enrollment) {
            res.status(403);
            throw new Error('Not authorized to access this course content. Please enroll first.');
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { checkEnrollment };
