const Module = require('../models/Module');
const Course = require('../models/Course');

// @desc    Create a module for a course
// @route   POST /api/modules
// @access  Private (Admin, Tutor)
const createModule = async (req, res, next) => {
    try {
        const { title, order, course: courseId } = req.body;

        // Verify the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Only course owner or Admin can add modules
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to add modules to this course');
        }

        const module = await Module.create({ title, order, course: courseId });

        res.status(201).json({
            success: true,
            message: 'Module created successfully',
            data: module
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all modules for a specific course
// @route   GET /api/modules?course=courseId
// @access  Public
const getModules = async (req, res, next) => {
    try {
        const { course } = req.query;

        if (!course) {
            res.status(400);
            throw new Error('Please provide a course ID as a query parameter');
        }

        const modules = await Module.find({ course })
            .populate('lessons')
            .sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: modules.length,
            data: modules
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single module
// @route   GET /api/modules/:id
// @access  Public
const getModule = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id)
            .populate('lessons');

        if (!module) {
            res.status(404);
            throw new Error('Module not found');
        }

        res.status(200).json({
            success: true,
            data: module
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a module
// @route   PUT /api/modules/:id
// @access  Private (Admin, Tutor who owns the course)
const updateModule = async (req, res, next) => {
    try {
        let module = await Module.findById(req.params.id);

        if (!module) {
            res.status(404);
            throw new Error('Module not found');
        }

        // Check ownership through the parent course
        const course = await Course.findById(module.course);
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to update this module');
        }

        module = await Module.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Module updated successfully',
            data: module
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a module
// @route   DELETE /api/modules/:id
// @access  Private (Admin, Tutor who owns the course)
const deleteModule = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            res.status(404);
            throw new Error('Module not found');
        }

        const course = await Course.findById(module.course);
        if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('Not authorized to delete this module');
        }

        await module.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Module deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createModule, getModules, getModule, updateModule, deleteModule };
