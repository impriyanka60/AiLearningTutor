// server/routes/dashboardRoutes.js
const express = require('express');
const { recordSession, getDashboard } = require('../controllers/dashboardController');
const router = express.Router();

router.post('/record', recordSession);
router.get('/:userId', getDashboard);

module.exports = router;
