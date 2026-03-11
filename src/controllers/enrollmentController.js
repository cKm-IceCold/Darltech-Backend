const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Private (Student)
const enrollCourse = async (req, res, next) => {
    try {
        const { course: courseId } = req.body;

        if (!courseId) {
            res.status(400);
            throw new Error('Course ID is required');
        }

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Check if the user is already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user._id,
            course: courseId
        });

        if (existingEnrollment) {
            res.status(400);
            throw new Error('You are already enrolled in this course');
        }

        const enrollment = await Enrollment.create({
            user: req.user._id,
            course: courseId
        });

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: enrollment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all enrollments for a logged-in student
// @route   GET /api/enrollments/my-enrollments
// @access  Private
const getMyEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate({
                path: 'course',
                select: 'title description thumbnail category level tutor set',
                populate: {
                    path: 'tutor',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check enrollment status for a specific course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        if (!enrollment) {
            return res.status(200).json({
                success: true,
                isEnrolled: false
            });
        }

        res.status(200).json({
            success: true,
            isEnrolled: true,
            data: enrollment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students enrolled in a course (for Tutors and Admins)
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Tutor, Admin)
const getCourseStudents = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Only course owner (Tutor) or Admin can view students
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to view students for this course');
        }

        const enrollments = await Enrollment.find({ course: req.params.courseId })
            .populate('user', 'name email status');

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    enrollCourse,
    getMyEnrollments,
    checkEnrollment,
    getCourseStudents
};
