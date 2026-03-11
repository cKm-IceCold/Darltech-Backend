const Course = require('../models/Course');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin, Tutor)
const createCourse = async (req, res, next) => {
    try {
        // Attach the logged-in user as the tutor
        req.body.tutor = req.user._id;

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all courses (with optional filters)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        const { category, level, status } = req.query;

        // Build filter object dynamically
        const filter = {};
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (status) filter.status = status;

        const courses = await Course.find(filter)
            .populate('tutor', 'name email')
            .populate('modules')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('tutor', 'name email')
            .populate({
                path: 'modules',
                populate: {
                    path: 'lessons',
                    model: 'Lesson'
                }
            });

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin, or the Tutor who owns it)
const updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Only the course owner (tutor) or an Admin can update
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to update this course');
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin, or the Tutor who owns it)
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Only the course owner (tutor) or an Admin can delete
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to delete this course');
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCourse, getCourses, getCourse, updateCourse, deleteCourse };
