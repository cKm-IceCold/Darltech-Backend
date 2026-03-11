const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
        trim: true
    },
    content: {
        type: String
    },
    videoUrl: {
        type: String
    },
    resources: [
        {
            name: String,
            url: String
        }
    ],
    order: {
        type: Number,
        default: 1
    },
    module: {
        type: mongoose.Schema.ObjectId,
        ref: 'Module',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);
