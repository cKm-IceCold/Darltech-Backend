const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    thumbnail: {
        type: String,
        default: 'no-photo.jpg'
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: {
            values: [
                'UI/UX Design',
                'Cybersecurity',
                'Frontend Development',
                'Backend Development',
                'Graphic Design'
            ],
            message: '{VALUE} is not a supported course category'
        }
    },
    price: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    tutor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with modules
courseSchema.virtual('modules', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

module.exports = mongoose.model('Course', courseSchema);
