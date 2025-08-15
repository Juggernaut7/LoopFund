const { Router } = require('express');

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

module.exports = router;