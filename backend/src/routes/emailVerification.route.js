const { Router } = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');
const {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/emailVerification.controller');

const router = Router();

/**
 * @openapi
 * /api/email/send-verification:
 *   post:
 *     summary: Send email verification code
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.post(
  '/send-verification',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  validateRequest,
  sendVerificationEmail
);

/**
 * @openapi
 * /api/email/verify:
 *   post:
 *     summary: Verify email with code
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email: { type: string, format: email }
 *               code: { type: string, minLength: 6, maxLength: 6 }
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Bad request or invalid code
 *       404:
 *         description: User not found
 */
router.post(
  '/verify',
  [
    body('email').isEmail(),
    body('code').isString().isLength({ min: 6, max: 6 }),
  ],
  validateRequest,
  verifyEmail
);

/**
 * @openapi
 * /api/email/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests
 */
router.post(
  '/resend-verification',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  validateRequest,
  resendVerificationEmail
);

module.exports = router;
