const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a module title'],
        trim: true
    },
    order: {
        type: Number,
        default: 1
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with lessons
moduleSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'module',
    justOne: false
});

module.exports = mongoose.model('Module', moduleSchema);
