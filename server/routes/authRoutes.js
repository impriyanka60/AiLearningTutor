// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser,getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
module.exports = router;

