const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const Course = require('../models/Course');

// @desc    Create a lesson for a module
// @route   POST /api/lessons
// @access  Private (Admin, Tutor)
const createLesson = async (req, res, next) => {
    try {
        const { title, content, videoUrl, resources, order, module: moduleId } = req.body;

        // Verify the module exists
        const parentModule = await Module.findById(moduleId);
        if (!parentModule) {
            res.status(404);
            throw new Error('Module not found');
        }

        // Check ownership through the parent course
        const course = await Course.findById(parentModule.course);
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to add lessons to this module');
        }

        const lesson = await Lesson.create({
            title,
            content,
            videoUrl,
            resources,
            order,
            module: moduleId
        });

        res.status(201).json({
            success: true,
            message: 'Lesson created successfully',
            data: lesson
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all lessons for a specific module
// @route   GET /api/lessons?module=moduleId
// @access  Public
const getLessons = async (req, res, next) => {
    try {
        const { module: moduleId } = req.query;

        if (!moduleId) {
            res.status(400);
            throw new Error('Please provide a module ID as a query parameter');
        }

        const lessons = await Lesson.find({ module: moduleId }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: lessons.length,
            data: lessons
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single lesson
// @route   GET /api/lessons/:id
// @access  Public
const getLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            res.status(404);
            throw new Error('Lesson not found');
        }

        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Admin, Tutor who owns the course)
const updateLesson = async (req, res, next) => {
    try {
        let lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            res.status(404);
            throw new Error('Lesson not found');
        }

        // Check ownership through module -> course chain
        const parentModule = await Module.findById(lesson.module);
        const course = await Course.findById(parentModule.course);
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to update this lesson');
        }

        lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Lesson updated successfully',
            data: lesson
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Admin, Tutor who owns the course)
const deleteLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            res.status(404);
            throw new Error('Lesson not found');
        }

        const parentModule = await Module.findById(lesson.module);
        const course = await Course.findById(parentModule.course);
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to delete this lesson');
        }

        await lesson.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Lesson deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createLesson, getLessons, getLesson, updateLesson, deleteLesson };
