// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authenticateToken = require('../middleware/authMiddleware');

// ✅ Use o controller corretamente aqui
router.get('/', authenticateToken, statsController.getStats);

module.exports = router;
