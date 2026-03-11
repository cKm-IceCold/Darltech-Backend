const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Initialize Paystack Payment
// @route   POST /api/payments/initialize/:courseId
// @access  Private
const initializePayment = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Check if user is already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        if (existingEnrollment) {
            res.status(400);
            throw new Error('You are already enrolled in this course');
        }

        const amount = course.price * 100; // Paystack takes amount in kobo
        const reference = crypto.randomBytes(12).toString('hex');

        const params = JSON.stringify({
            "email": req.user.email,
            "amount": amount,
            "reference": reference,
            "callback_url": process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment-success',
            "metadata": {
                "courseId": course._id,
                "userId": req.user._id
            }
        });

        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', params, config);

        if (response.data.status) {
            // Save payment record
            await Payment.create({
                user: req.user._id,
                course: course._id,
                reference: reference,
                amount: course.price,
                status: 'Pending'
            });

            res.status(200).json({
                success: true,
                data: response.data.data
            });
        } else {
            res.status(400);
            throw new Error('Payment initialization failed');
        }
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        next(error);
    }
};

// @desc    Verify Paystack Payment
// @route   GET /api/payments/verify/:reference
// @access  Private
const verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.params;

        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        };

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, config);

        if (response.data.status && response.data.data.status === 'success') {
            const { courseId, userId } = response.data.data.metadata;

            const payment = await Payment.findOne({ reference });

            if (!payment) {
                res.status(404);
                throw new Error('Payment record not found');
            }

            if (payment.status === 'Success') {
                return res.status(200).json({
                    success: true,
                    message: 'Payment already verified',
                    data: payment
                });
            }

            // Update payment record
            payment.status = 'Success';
            payment.paidAt = new Date();
            await payment.save();

            // Create enrollment
            const enrollment = await Enrollment.create({
                user: userId,
                course: courseId,
                status: 'Active'
            });

            res.status(200).json({
                success: true,
                message: 'Payment verified and course enrolled',
                data: enrollment
            });
        } else {
            res.status(400);
            throw new Error('Payment verification failed or not successful yet');
        }
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        next(error);
    }
};

module.exports = {
    initializePayment,
    verifyPayment
};
