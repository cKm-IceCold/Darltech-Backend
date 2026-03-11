const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Course payment and checkout endpoints
 */

/**
 * @swagger
 * /api/payments/initialize/{courseId}:
 *   post:
 *     summary: Initialize a Paystack transaction
 *     tags: [Payments]
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
 *         description: Initialized successfully, returns authorization_url
 *       404:
 *         description: Course not found
 *       401:
 *         description: Not authorized
 */
router.post('/initialize/:courseId', protect, initializePayment);

/**
 * @swagger
 * /api/payments/verify/{reference}:
 *   get:
 *     summary: Verify a Paystack transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verified successfully and enrolled
 *       400:
 *         description: Verification failed
 */
router.get('/verify/:reference', protect, verifyPayment);

module.exports = router;
